import Scroll from '../mixin/scroll';
import {
    $$,
    css,
    filter,
    data as getData,
    observeIntersection,
    once,
    removeClass,
    removeClasses,
    toggleClass,
    toPx,
    trigger,
} from 'uikit-util';

const stateKey = '_ukScrollspy';
export default {
    mixins: [Scroll],

    args: 'cls',

    props: {
        cls: String,
        target: String,
        hidden: Boolean,
        offsetTop: Number,
        offsetLeft: Number,
        repeat: Boolean,
        delay: Number,
    },

    data: () => ({
        cls: '',
        target: false,
        hidden: true,
        offsetTop: 0,
        offsetLeft: 0,
        repeat: false,
        delay: 0,
        inViewClass: 'uk-scrollspy-inview',
    }),

    computed: {
        elements: {
            get({ target }, $el) {
                return target ? $$(target, $el) : [$el];
            },

            watch(elements, prev) {
                if (this.hidden) {
                    css(filter(elements, `:not(.${this.inViewClass})`), 'visibility', 'hidden');
                }

                if (prev) {
                    this.$reset();
                }
            },

            immediate: true,
        },
    },

    connected() {
        this.registerObserver(
            observeIntersection(
                this.elements,
                (records) => {
                    for (const { target: el, isIntersecting } of records) {
                        if (!el[stateKey]) {
                            el[stateKey] = { cls: getData(el, 'uk-scrollspy-class') || this.cls };
                        }

                        if (!this.repeat && el[stateKey].show) {
                            continue;
                        }

                        el[stateKey].show = isIntersecting;
                    }

                    this.$emit();
                },
                {
                    rootMargin: `${toPx(this.offsetTop, 'height') - 1}px ${
                        toPx(this.offsetLeft, 'width') - 1
                    }px`,
                },
                false
            )
        );
    },

    disconnected() {
        for (const el of this.elements) {
            removeClass(el, this.inViewClass, el[stateKey]?.cls || '');
            delete el[stateKey];
        }
    },

    update: [
        {
            write(data) {
                for (const el of this.elements) {
                    const state = el[stateKey];

                    if (!state) {
                        continue;
                    }

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
            const state = el[stateKey];

            state.off?.();

            css(el, 'visibility', !inview && this.hidden ? 'hidden' : '');

            toggleClass(el, this.inViewClass, inview);
            toggleClass(el, state.cls);

            if (/\buk-animation-/.test(state.cls)) {
                const removeAnimationClasses = () => removeClasses(el, 'uk-animation-[\\w-]+');
                if (inview) {
                    state.off = once(el, 'animationcancel animationend', removeAnimationClasses);
                } else {
                    removeAnimationClasses();
                }
            }

            trigger(el, inview ? 'inview' : 'outview');

            state.inview = inview;

            this.$update(el);
        },
    },
};
