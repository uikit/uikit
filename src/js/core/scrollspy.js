import {$$, css, filter, data as getData, isInView, once, Promise, removeClass, removeClasses, toggleClass, trigger} from 'uikit-util';

const stateKey = '_ukScrollspy';
export default {

    args: 'cls',

    props: {
        cls: String,
        target: String,
        hidden: Boolean,
        offsetTop: Number,
        offsetLeft: Number,
        repeat: Boolean,
        delay: Number
    },

    data: () => ({
        cls: false,
        target: false,
        hidden: true,
        offsetTop: 0,
        offsetLeft: 0,
        repeat: false,
        delay: 0,
        inViewClass: 'uk-scrollspy-inview'
    }),

    computed: {

        elements: {

            get({target}, $el) {
                return target ? $$(target, $el) : [$el];
            },

            watch(elements) {
                if (this.hidden) {
                    css(filter(elements, `:not(.${this.inViewClass})`), 'visibility', 'hidden');
                }
            },

            immediate: true

        }

    },

    disconnected() {
        this.elements.forEach(el => {
            removeClass(el, this.inViewClass, el[stateKey] ? el[stateKey].cls : '');
            delete el[stateKey];
        });
    },

    update: [

        {

            read(data) {

                // Let child components be applied at least once first
                if (!data.update) {
                    Promise.resolve().then(() => {
                        this.$emit();
                        data.update = true;
                    });
                    return false;
                }

                this.elements.forEach(el => {

                    if (!el[stateKey]) {
                        el[stateKey] = {cls: getData(el, 'uk-scrollspy-class') || this.cls};
                    }

                    el[stateKey].show = isInView(el, this.offsetTop, this.offsetLeft);

                });

            },

            write(data) {

                this.elements.forEach(el => {

                    const state = el[stateKey];

                    if (state.show && !state.inview && !state.queued) {

                        state.queued = true;

                        data.promise = (data.promise || Promise.resolve()).then(() =>
                            new Promise(resolve =>
                                setTimeout(resolve, this.delay)
                            )
                        ).then(() => {
                            this.toggle(el, true);
                            setTimeout(() => {
                                state.queued = false;
                                this.$emit();
                            }, 300);
                        });

                    } else if (!state.show && state.inview && !state.queued && this.repeat) {

                        this.toggle(el, false);

                    }

                });

            },

            events: ['scroll', 'resize']

        }

    ],

    methods: {

        toggle(el, inview) {

            const state = el[stateKey];

            state.off && state.off();

            css(el, 'visibility', !inview && this.hidden ? 'hidden' : '');

            toggleClass(el, this.inViewClass, inview);
            toggleClass(el, state.cls);

            if (/\buk-animation-/.test(state.cls)) {
                state.off = once(el, 'animationcancel animationend', () =>
                    removeClasses(el, 'uk-animation-[\\w-]+')
                );
            }

            trigger(el, inview ? 'inview' : 'outview');

            state.inview = inview;

            this.$update(el);
        }

    }

};

