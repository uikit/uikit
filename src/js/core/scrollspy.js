import {
    $$,
    css,
    filter,
    data as getData,
    once,
    removeClass,
    toggleClass,
    trigger,
} from 'uikit-util';
import { intersection } from '../api/observables';

const clsInView = 'uk-scrollspy-inview';

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
    }),

    computed: {
        elements: ({ target }, $el) => (target ? $$(target, $el) : [$el]),
    },

    watch: {
        elements(elements) {
            if (this.hidden) {
                // use `opacity:0` instead of `visibility:hidden` to make content focusable with keyboard
                css(filter(elements, `:not(.${clsInView})`), 'opacity', 0);
            }
        },
    },

    connected() {
        this.elementData = new Map();
    },

    disconnected() {
        for (const [el, state] of this.elementData.entries()) {
            removeClass(el, clsInView, state?.cls || '');
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
            const state = this.elementData?.get(el);

            if (!state) {
                return;
            }

            state.off?.();

            css(el, 'opacity', !inview && this.hidden ? 0 : '');

            toggleClass(el, clsInView, inview);
            toggleClass(el, state.cls);

            let match;
            if ((match = state.cls.match(/\buk-animation-[\w-]+/g))) {
                const removeAnimationClasses = () => removeClass(el, match);
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
