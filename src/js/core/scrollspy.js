import {$$, css, data, filter, isInView, Promise, removeClass, toggleClass, trigger} from 'uikit-util';

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

            read({update}) {

                if (!update) {
                    return;
                }

                this.elements.forEach(el => {

                    if (!el[stateKey]) {
                        el[stateKey] = {cls: data(el, 'uk-scrollspy-class') || this.cls};
                    }

                    el[stateKey].show = isInView(el, this.offsetTop, this.offsetLeft);

                });

            },

            write(data) {

                // Let child components be applied at least once first
                if (!data.update) {
                    this.$emit();
                    return data.update = true;
                }

                this.elements.forEach(el => {

                    const state = el[stateKey];
                    const toggle = inview => {

                        css(el, 'visibility', !inview && this.hidden ? 'hidden' : '');

                        toggleClass(el, this.inViewClass, inview);
                        toggleClass(el, state.cls);

                        trigger(el, inview ? 'inview' : 'outview');

                        state.inview = inview;

                        this.$update(el);

                    };

                    if (state.show && !state.inview && !state.queued) {

                        state.queued = true;

                        data.promise = (data.promise || Promise.resolve()).then(() =>
                            new Promise(resolve =>
                                setTimeout(resolve, this.delay)
                            )
                        ).then(() => {
                            toggle(true);
                            setTimeout(() => {
                                state.queued = false;
                                this.$emit();
                            }, 300);
                        });

                    } else if (!state.show && state.inview && !state.queued && this.repeat) {

                        toggle(false);

                    }

                });

            },

            events: ['scroll', 'resize']

        }

    ]

};

