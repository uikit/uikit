import {$$, addClass, css, data, filter, isInView, removeClass, toggleClass, trigger} from 'uikit-util';

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

                if (!els.delay) {
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
                if (!els.delay) {
                    this.$emit();
                    return els.delay = true;
                }

                let index = this.elements.length === 1 ? 1 : 0;

                this.elements.forEach((el, i) => {

                    const elData = els[i];
                    const cls = elData.toggles[i] || elData.toggles[0];

                    if (elData.show && !elData.inview && !elData.timer) {

                        const show = () => {
                            css(el, 'visibility', '');
                            addClass(el, this.inViewClass);
                            toggleClass(el, cls);

                            trigger(el, 'inview');

                            this.$update(el);

                            elData.inview = true;
                            delete elData.timer;
                        };

                        if (this.delay && index) {
                            elData.timer = setTimeout(show, this.delay * index);
                        } else {
                            show();
                        }

                        index++;

                    } else if (!elData.show && elData.inview && this.repeat) {

                        if (elData.timer) {
                            clearTimeout(elData.timer);
                            delete elData.timer;
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
