import {$$, addClass, css, data, filter, isInView, Promise, removeClass, toggleClass, trigger} from 'uikit-util';

export default {

    args: 'cls',

    props: {
        cls: 'list',
        target: String,
        hidden: Boolean,
        offsetTop: Number,
        offsetLeft: Number,
        repeat: Boolean,
        delay: Number
    },

    data: () => ({
        cls: [],
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

            read(els) {

                if (!els.update) {
                    return;
                }

                this.elements.forEach((el, i) => {

                    let elData = els[i];

                    if (!elData || elData.el !== el) {
                        const cls = data(el, 'uk-scrollspy-class');
                        elData = {el, toggles: cls && cls.split(',') || this.cls};
                    }

                    elData.show = isInView(el, this.offsetTop, this.offsetLeft);
                    els[i] = elData;

                });

            },

            write(els) {

                // Let child components be applied at least once first
                if (!els.update) {
                    this.$emit();
                    return els.update = true;
                }

                this.elements.forEach((el, i) => {

                    const elData = els[i];
                    const cls = elData.toggles[i] || elData.toggles[0];

                    if (elData.show && !elData.inview && !elData.queued) {

                        const show = () => {

                            css(el, 'visibility', '');
                            addClass(el, this.inViewClass);
                            toggleClass(el, cls);

                            trigger(el, 'inview');

                            this.$update(el);

                            elData.inview = true;
                            elData.abort && elData.abort();
                        };

                        if (this.delay) {

                            elData.queued = true;
                            els.promise = (els.promise || Promise.resolve()).then(() => {
                                return !elData.inview && new Promise(resolve => {

                                    const timer = setTimeout(() => {

                                        show();
                                        resolve();

                                    }, els.promise || this.elements.length === 1 ? this.delay : 0);

                                    elData.abort = () => {
                                        clearTimeout(timer);
                                        resolve();
                                        elData.queued = false;
                                    };

                                });

                            });

                        } else {
                            show();
                        }

                    } else if (!elData.show && (elData.inview || elData.queued) && this.repeat) {

                        elData.abort && elData.abort();

                        if (!elData.inview) {
                            return;
                        }

                        css(el, 'visibility', this.hidden ? 'hidden' : '');
                        removeClass(el, this.inViewClass);
                        toggleClass(el, cls);

                        trigger(el, 'outview');

                        this.$update(el);

                        elData.inview = false;

                    }


                });

            },

            events: ['scroll', 'load', 'resize']

        }

    ]

};

