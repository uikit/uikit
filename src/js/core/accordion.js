import {
    $,
    $$,
    attr,
    children,
    css,
    dimensions,
    filter,
    findIndex,
    getIndex,
    hasClass,
    includes,
    index,
    isTag,
    scrollParent,
    sumBy,
    toFloat,
    toggleClass,
    Transition,
    unwrap,
    wrapAll,
} from 'uikit-util';
import { generateId } from '../api/instance';
import { lazyload } from '../api/observables';
import Class from '../mixin/class';
import Connect from '../mixin/connect';
import { maybeDefaultPreventClick } from '../mixin/event';
import { keyMap } from '../util/keys';

export default {
    mixins: [Class, Connect],

    props: {
        targets: String,
        active: null,
        collapsible: Boolean,
        multiple: Boolean,
        toggle: String,
        content: String,
        offset: Number,
        switcherConnect: String,
    },

    data: {
        targets: '> *',
        active: false,
        animation: [true],
        collapsible: true,
        multiple: false,
        clsOpen: 'uk-open',
        cls: 'uk-active',
        toggle: '.uk-accordion-title',
        content: '.uk-accordion-content',
        offset: 0,
        switcherConnect: '',
    },

    beforeConnect() {
        this.connect = this.$props.connect = this.switcherConnect;
    },

    computed: {
        items: ({ targets }, $el) => $$(targets, $el),

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

        connectChildren() {
            this.showConnects(
                findIndex(this.items, (el) => hasClass(el, this.clsOpen)),
                false,
            );
        },

        toggles() {
            this.$emit();
        },

        contents(items) {
            for (const el of items) {
                const isOpen = hasClass(
                    this.items.find((item) => item.contains(el)),
                    this.clsOpen,
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

            delegate: ({ targets, $props }) => `${targets} ${$props.toggle}`,

            handler(e) {
                if (e.type === 'keydown' && e.keyCode !== keyMap.SPACE) {
                    return;
                }

                const item = index(this.toggles, e.current);

                if (item === -1) {
                    return;
                }

                maybeDefaultPreventClick(e);

                const off = keepScrollPosition(e.target);
                this.toggle(item).finally(off);
            },
        },
        {
            name: 'show hide shown hidden',

            self: true,

            delegate: ({ targets }) => targets,

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

            toggle.id = generateId(this, toggle);

            const active = includes(activeItems, this.items[index]);

            attr(content, {
                id: generateId(this, content),
                role: 'region',
                'aria-labelledby': toggle.id,
            });
            if (isTag(content, 'ul')) {
                attr(children(content), 'role', 'presentation');
            }

            const controls = [content.id];
            for (const { children } of this.connects) {
                const item = children[index];

                if (!item) {
                    continue;
                }

                attr(item, {
                    id: generateId(this, item),
                    role: 'tabpanel',
                    'aria-labelledby': toggle.id,
                });
                controls.push(item.id);
            }

            attr(toggle, {
                role: isTag(toggle, 'a') ? 'button' : null,
                'aria-controls': controls.join(' '),
                'aria-expanded': active,
                'aria-disabled': !this.collapsible && activeItems.length < 2 && active,
            });
        }
    },

    methods: {
        async toggle(item, animate) {
            animate = animate !== false;

            const next = getIndex(item, this.items);

            item = this.items[next];
            let items = [item];
            const activeItems = filter(this.items, `.${this.clsOpen}`);
            const isActive = includes(activeItems, item);

            if (isActive && !this.collapsible && activeItems.length < 2) {
                return;
            }

            if (!isActive && !this.multiple) {
                items.push(...activeItems);
            }

            const toggle = (el) =>
                this.toggleElement(el, !includes(activeItems, el), (el, show) => {
                    toggleClass(el, this.clsOpen, show);

                    if (!animate || !this.hasAnimation) {
                        hide($(this.content, el), !show);
                        return;
                    }

                    return transition(el, show, this);
                });

            const hideIndex = () => {
                const index = findIndex(children(this.connects[0]), (el) => hasClass(el, this.cls));

                return index === next
                    ? findIndex(this.items, (i) => i !== item && includes(activeItems, i))
                    : index;
            };

            return Promise.all([
                ...items.map(toggle),
                this.showConnects(isActive ? hideIndex() : next, animate),
            ]);
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
    duration = endHeight ? (velocity * endHeight + duration) * (show ? 1 - percent : percent) : 0;
    css(wrapper, 'height', currentHeight);

    await Transition.start(wrapper, { height: show ? endHeight : 0 }, duration, transition);

    unwrap(content);
    delete el._wrapper;

    if (!show) {
        hide(content, true);
    }
}

function keepScrollPosition(el) {
    const scrollElement = scrollParent(el, true);
    let frame;
    (function scroll() {
        frame = requestAnimationFrame(() => {
            const { top } = dimensions(el);
            if (top < 0) {
                scrollElement.scrollTop += top;
            }
            scroll();
        });
    })();

    return () => requestAnimationFrame(() => cancelAnimationFrame(frame));
}
