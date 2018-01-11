import { $$, addClass, css, data, filter, isInView, removeClass, toggleClass, trigger } from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy', {

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

        defaults: {
            cls: ['uk-scrollspy-inview'],
            target: false,
            hidden: true,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        },

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

                    if (!UIkit._initialized) {
                        return false;
                    }

                    this.elements.forEach((el, i) => {

                        var elData = els[i];

                        if (!elData) {
                            var cls = data(el, 'uk-scrollspy-class');
                            elData = {toggles: cls && cls.split(',') || this.cls};
                        }

                        elData.show = isInView(el, this.offsetTop, this.offsetLeft);
                        els[i] = elData;

                    });
                },

                write(data) {

                    var index = this.elements.length === 1 ? 1 : 0;

                    this.elements.forEach((el, i) => {

                        var elData = data[i], cls = elData.toggles[i] || elData.toggles[0];

                        if (elData.show) {

                            if (!elData.inview && !elData.timer) {

                                var show = () => {
                                    css(el, 'visibility', '');
                                    addClass(el, this.inViewClass);
                                    toggleClass(el, cls);

                                    trigger(el, 'inview');

                                    this.$update();

                                    elData.inview = true;
                                    delete elData.timer;
                                };

                                if (this.delay && index) {
                                    elData.timer = setTimeout(show, this.delay * index);
                                } else {
                                    show();
                                }

                                index++;

                            }

                        } else {

                            if (elData.inview && this.repeat) {

                                if (elData.timer) {
                                    clearTimeout(elData.timer);
                                    delete elData.timer;
                                }

                                css(el, 'visibility', this.hidden ? 'hidden' : '');
                                removeClass(el, this.inViewClass);
                                toggleClass(el, cls);

                                trigger(el, 'outview');

                                this.$update();

                                elData.inview = false;

                            }

                        }

                    });

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

}
