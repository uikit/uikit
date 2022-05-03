import Class from '../mixin/class';
import Lazyload from '../mixin/lazyload';
import { default as Togglable, toggleHeight } from '../mixin/togglable';
import {
    $,
    $$,
    attr,
    fastdom,
    filter,
    getIndex,
    hasClass,
    includes,
    index,
    isInView,
    scrollIntoView,
    toggleClass,
    unwrap,
    wrapAll,
} from 'uikit-util';

export default {
    mixins: [Class, Lazyload, Togglable],

    props: {
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
        animation: [true],
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
                            this.items.find((item) => item.contains(el)),
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
                this.toggleElement(el, !hasClass(el, this.clsOpen), async (el, show) => {
                    toggleClass(el, this.clsOpen, show);
                    attr($(this.$props.toggle, el), 'aria-expanded', show);

                    const content = $(`${el._wrapper ? '> * ' : ''}${this.content}`, el);

                    if (animate === false || !this.hasTransition) {
                        hide(content, !show);
                        return;
                    }

                    if (!el._wrapper) {
                        el._wrapper = wrapAll(content, `<div${show ? ' hidden' : ''}>`);
                    }

                    hide(content, false);
                    await toggleHeight(this)(el._wrapper, show);
                    hide(content, !show);

                    delete el._wrapper;
                    unwrap(content);

                    if (show) {
                        const toggle = $(this.$props.toggle, el);
                        fastdom.read(() => {
                            if (!isInView(toggle)) {
                                scrollIntoView(toggle, { offset: this.offset });
                            }
                        });
                    }
                });
            }
        },
    },
};

function hide(el, hide) {
    el && (el.hidden = hide);
}
