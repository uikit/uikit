import {
    $$,
    css,
    filter,
    data as getData,
    once,
    removeClass,
    removeClasses,
    toggleClass,
    trigger,
} from 'uikit-util';
import { intersection } from '../api/observables';

export default {
    args: 'cls',

    props: {
        cls: String,
        target: String,
        hidden: Boolean,
        margin: String,
        repeat: Boolean,
        delay: Number,
    },

    data: () => ({
        cls: '',
        target: false,
        hidden: true,
        margin: '-1px',
        repeat: false,
        delay: 0,
        inViewClass: 'uk-scrollspy-inview',
    }),

    computed: {
        elements: ({ target }, $el) => (target ? $$(target, $el) : [$el]),
    },

    watch: {
        elements(elements) {
            if (this.hidden) {
                // use `opacity:0` instead of `visibility:hidden` to make content focusable with keyboard
                css(filter(elements, `:not(.${this.inViewClass})`), 'opacity', 0);
            }
        },
    },

    connected() {
        this.elementData = new Map();
    },

    disconnected() {
        for (const [el, state] of this.elementData.entries()) {
            removeClass(el, this.inViewClass, state?.cls || '');
        }
        delete this.elementData;
    },

    observe: intersection({
        target: ({ elements }) => elements,
        handler(records) {
            const elements = this.elementData;
            for (const { target: el, isIntersecting } of records) {
                if (!elements.has(el)) {
                    elements.set(el, {
                        cls: getData(el, 'uk-scrollspy-class') || this.cls,
                    });
                }

                const state = elements.get(el);
                if (!this.repeat && state.show) {
                    continue;
                }

                state.show = isIntersecting;
            }

            this.$emit();
        },
        options: ({ margin }) => ({ rootMargin: margin }),
        args: { intersecting: false },
    }),

    update: [
        {
            write(data) {
                for (const [el, state] of this.elementData.entries()) {
                    if (state.show && !state.inview && !state.queued) {
                        state.queued = true;

                        data.promise = (data.promise || Promise.resolve())
                            .then(() => new Promise((resolve) => setTimeout(resolve, this.delay)))
                            .then(() => {
                                this.toggle(el, true);
                                setTimeout(() => {
                                    state.queued = false;
                                    this.$emit();
                                }, 300);
                            });
                    } else if (!state.show && state.inview && !state.queued && this.repeat) {
                        this.toggle(el, false);
                    }
                }
            },
        },
    ],

    methods: {
        toggle(el, inview) {
            const state = this.elementData.get(el);

            if (!state) {
                return;
            }

            state.off?.();

            css(el, 'opacity', !inview && this.hidden ? 0 : '');

            toggleClass(el, this.inViewClass, inview);
            toggleClass(el, state.cls);

            const triggerRepaint = () => {
                Array.prototype
                    .slice
                    .call(el
                        .querySelectorAll('img')
                    )
                    .filter(el => {
                        const imgExtension = el.src.slice(-3);

                        if (imgExtension === 'svg') {
                            return el;
                        }
                    })
                    .forEach(img => {
                        const display = img.style.display;

                        if (display === 'none') {
                            return;
                        }

                        img.style.display = 'none';
                        const h = img.offsetHeight;
                        img.style.display = display;
                        return h;
                    });
            };

            if (/\buk-animation-/.test(state.cls)) {
                const removeAnimationClasses = () => {
                    removeClasses(el, 'uk-animation-[\\w-]+');
                    triggerRepaint();
                }
                if (inview) {
                    state.off = once(el, 'animationcancel animationend', removeAnimationClasses, {
                        self: true,
                    });
                } else {
                    removeAnimationClasses();
                }
            }

            trigger(el, inview ? 'inview' : 'outview');

            state.inview = inview;
        },
    },
};
