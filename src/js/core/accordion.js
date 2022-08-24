import Class from '../mixin/class';
import Lazyload from '../mixin/lazyload';
import Togglable from '../mixin/togglable';
import {
    $,
    $$,
    attr,
    css,
    filter,
    getIndex,
    hasClass,
    includes,
    index,
    isInView,
    noop,
    scrollIntoView,
    toFloat,
    toggleClass,
    Transition,
    unwrap,
    within,
    wrapAll,
} from 'uikit-util';

export default {
    mixins: [Class, Lazyload, Togglable],

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
        items: {
            get({ targets }, $el) {
                return $$(targets, $el);
            },

            watch(items, prev) {
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

            immediate: true,
        },

        toggles({ toggle }) {
            return this.items.map((item) => $(toggle, item));
        },

        contents: {
            get({ content }) {
                return this.items.map((item) => $(content, item));
            },

            watch(items) {
                for (const el of items) {
                    hide(
                        el,
                        !hasClass(
                            this.items.find((item) => within(el, item)),
                            this.clsOpen
                        )
                    );
                }
            },

            immediate: true,
        },
    },

    connected() {
        this.lazyload();
    },

    events: [
        {
            name: 'click',

            delegate() {
                return `${this.targets} ${this.$props.toggle}`;
            },

            handler(e) {
                e.preventDefault();
                this.toggle(index(this.toggles, e.current));
            },
        },
    ],

    methods: {
        toggle(item, animate) {
            let items = [this.items[getIndex(item, this.items)]];
            const activeItems = filter(this.items, `.${this.clsOpen}`);

            if (!this.multiple && !includes(activeItems, items[0])) {
                items = items.concat(activeItems);
            }

            if (
                !this.collapsible &&
                activeItems.length < 2 &&
                !filter(items, `:not(.${this.clsOpen})`).length
            ) {
                return;
            }

            for (const el of items) {
                this.toggleElement(el, !hasClass(el, this.clsOpen), (el, show) => {
                    toggleClass(el, this.clsOpen, show);
                    attr($(this.$props.toggle, el), 'aria-expanded', show);

                    if (animate === false || !this.animation) {
                        hide($(this.content, el), !show);
                        return;
                    }

                    return transition(el, show, this).then(() => {
                        if (show) {
                            const toggle = $(this.$props.toggle, el);
                            requestAnimationFrame(() => {
                                if (!isInView(toggle)) {
                                    scrollIntoView(toggle, { offset: this.offset });
                                }
                            });
                        }
                    }, noop);
                });
            }
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
        toFloat(css(content, 'height')) +
        toFloat(css(content, 'marginTop')) +
        toFloat(css(content, 'marginBottom'));
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
