import {$$, addClass, css, data, filter, isInView, Promise, removeClass, toggleClass, trigger} from 'uikit-util';

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

        elements({target}, $el) {
            return target ? $$(target, $el) : [$el];
        }

    },

    update: [

        {

            write() {
                if (this.hidden) {
                    css(filter(this.elements, `:not(.${this.inViewClass})`), 'visibility', 'hidden');
                }
            }

        },

        {

            read({update}) {

                if (!update) {
                    return;
                }

                this.elements.forEach(el => {

                    let state = el._ukScrollspyState;

                    if (!state) {
                        state = {cls: data(el, 'uk-scrollspy-class') || this.cls};
                    }

                    state.show = isInView(el, this.offsetTop, this.offsetLeft);
                    el._ukScrollspyState = state;

                });

            },

            write(data) {

                // Let child components be applied at least once first
                if (!data.update) {
                    this.$emit();
                    return data.update = true;
                }

                this.elements.forEach(el => {

                    const state = el._ukScrollspyState;
                    const {cls} = state;

                    if (state.show && !state.inview && !state.queued) {

                        const show = () => {

                            css(el, 'visibility', '');
                            addClass(el, this.inViewClass);
                            toggleClass(el, cls);

                            trigger(el, 'inview');

                            this.$update(el);

                            state.inview = true;
                            state.abort && state.abort();
                        };

                        if (this.delay) {

                            state.queued = true;
                            data.promise = (data.promise || Promise.resolve()).then(() => {
                                return !state.inview && new Promise(resolve => {

                                    const timer = setTimeout(() => {

                                        show();
                                        resolve();

                                    }, data.promise || this.elements.length === 1 ? this.delay : 0);

                                    state.abort = () => {
                                        clearTimeout(timer);
                                        resolve();
                                        state.queued = false;
                                    };

                                });

                            });

                        } else {
                            show();
                        }

                    } else if (!state.show && (state.inview || state.queued) && this.repeat) {

                        state.abort && state.abort();

                        if (!state.inview) {
                            return;
                        }

                        css(el, 'visibility', this.hidden ? 'hidden' : '');
                        removeClass(el, this.inViewClass);
                        toggleClass(el, cls);

                        trigger(el, 'outview');

                        this.$update(el);

                        state.inview = false;

                    }


                });

            },

            events: ['scroll', 'resize']

        }

    ]

};

