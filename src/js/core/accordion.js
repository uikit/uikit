import Class from '../mixin/class';
import Togglable from '../mixin/togglable';
import { keyMap } from '../util/keys';
import { generateId } from '../api/instance';
import { lazyload } from '../api/observables';
import {
    $,
    $$,
    attr,
    children,
    css,
    dimensions,
    filter,
    getIndex,
    hasClass,
    includes,
    index,
    isTag,
    scrollParents,
    sumBy,
    toFloat,
    toggleClass,
    Transition,
    unwrap,
    within,
    wrapAll,
} from 'uikit-util';

export default {
    mixins: [Class, Togglable],

    props: {
        animation: Boolean,
        targets: String,
        active: null,
        collapsible: Boolean,
        multiple: Boolean,
        toggle: String,
        content: String,
        offset: Number,
    },

    data: {
        targets: '> *',
        active: false,
        animation: true,
        collapsible: true,
        multiple: false,
        clsOpen: 'uk-open',
        toggle: '> .uk-accordion-title',
        content: '> .uk-accordion-content',
        offset: 0,
    },

    computed: {
        items({ targets }, $el) {
            return $$(targets, $el);
        },

        toggles({ toggle }) {
            return this.items.map((item) => $(toggle, item));
        },

        contents({ content }) {
            return this.items.map((item) => item._wrapper?.firstElementChild || $(content, item));
        },
    },

    watch: {
        items(items, prev) {
            if (prev || hasClass(items, this.clsOpen)) {
                return;
            }

            const active =
                (this.active !== false && items[Number(this.active)]) ||
                (!this.collapsible && items[0]);

            if (active) {
                this.toggle(active, false);
            }
        },

        toggles() {
            this.$emit();
        },

        contents(items) {
            for (const el of items) {
                const isOpen = hasClass(
                    this.items.find((item) => within(el, item)),
                    this.clsOpen
                );

                hide(el, !isOpen);
            }
            this.$emit();
        },
    },

    observe: lazyload(),

    events: [
        {
            name: 'click keydown',

            delegate() {
                return `${this.targets} ${this.$props.toggle}`;
            },

            async handler(e) {
                if (e.type === 'keydown' && e.keyCode !== keyMap.SPACE) {
                    return;
                }

                e.preventDefault();

                this._off?.();
                this._off = keepScrollPosition(e.target);
                await this.toggle(index(this.toggles, e.current));
                this._off();
            },
        },
        {
            name: 'shown hidden',

            self: true,

            delegate() {
                return this.targets;
            },

            handler() {
                this.$emit();
            },
        },
    ],

    update() {
        const activeItems = filter(this.items, `.${this.clsOpen}`);

        for (const index in this.items) {
            const toggle = this.toggles[index];
            const content = this.contents[index];

            if (!toggle || !content) {
                continue;
            }

            toggle.id = generateId(this, toggle, `-title-${index}`);
            content.id = generateId(this, content, `-content-${index}`);

            const active = includes(activeItems, this.items[index]);
            attr(toggle, {
                role: isTag(toggle, 'a') ? 'button' : null,
                'aria-controls': content.id,
                'aria-expanded': active,
                'aria-disabled': !this.collapsible && activeItems.length < 2 && active,
            });

            attr(content, { role: 'region', 'aria-labelledby': toggle.id });
            if (isTag(content, 'ul')) {
                attr(children(content), 'role', 'presentation');
            }
        }
    },

    methods: {
        async toggle(item, animate) {
            item = this.items[getIndex(item, this.items)];
            let items = [item];
            const activeItems = filter(this.items, `.${this.clsOpen}`);

            if (!this.multiple && !includes(activeItems, items[0])) {
                items = items.concat(activeItems);
            }

            if (!this.collapsible && activeItems.length < 2 && includes(activeItems, item)) {
                return;
            }

            await Promise.all(
                items.map((el) =>
                    this.toggleElement(el, !includes(activeItems, el), (el, show) => {
                        toggleClass(el, this.clsOpen, show);

                        if (animate === false || !this.animation) {
                            hide($(this.content, el), !show);
                            return;
                        }

                        return transition(el, show, this);
                    })
                )
            );
        },
    },
};

function hide(el, hide) {
    el && (el.hidden = hide);
}

async function transition(el, show, { content, duration, velocity, transition }) {
    content = el._wrapper?.firstElementChild || $(content, el);

    if (!el._wrapper) {
        el._wrapper = wrapAll(content, '<div>');
    }

    const wrapper = el._wrapper;
    css(wrapper, 'overflow', 'hidden');
    const currentHeight = toFloat(css(wrapper, 'height'));

    await Transition.cancel(wrapper);
    hide(content, false);

    const endHeight =
        sumBy(['marginTop', 'marginBottom'], (prop) => css(content, prop)) +
        dimensions(content).height;

    const percent = currentHeight / endHeight;
    duration = (velocity * endHeight + duration) * (show ? 1 - percent : percent);
    css(wrapper, 'height', currentHeight);

    await Transition.start(wrapper, { height: show ? endHeight : 0 }, duration, transition);

    unwrap(content);
    delete el._wrapper;

    if (!show) {
        hide(content, true);
    }
}

function keepScrollPosition(el) {
    const [scrollParent] = scrollParents(el, true);
    let frame;
    (function scroll() {
        frame = requestAnimationFrame(() => {
            const { top } = el.getBoundingClientRect();
            if (top < 0) {
                scrollParent.scrollTop += top;
            }
            scroll();
        });
    })();

    return () => requestAnimationFrame(() => cancelAnimationFrame(frame));
}
