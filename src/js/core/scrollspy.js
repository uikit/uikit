import { $$, addClass, attr, css, filter, isInView, removeClass, toggleClass, trigger } from '../util/index';

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
                return target && $$(target, $el) || [$el];
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

                read() {
                    this.elements.forEach(el => {

                        if (!el._scrollspy) {
                            var cls = attr(el, 'uk-scrollspy-class');
                            el._scrollspy = {toggles: cls && cls.split(',') || this.cls};
                        }

                        el._scrollspy.show = isInView(el, this.offsetTop, this.offsetLeft);

                    });
                },

                write() {

                    var index = this.elements.length === 1 ? 1 : 0;

                    this.elements.forEach((el, i) => {

                        var data = el._scrollspy, cls = data.toggles[i] || data.toggles[0];

                        if (data.show) {

                            if (!data.inview && !data.timer) {

                                var show = () => {
                                    css(el, 'visibility', '');
                                    addClass(el, this.inViewClass);
                                    toggleClass(el, cls);

                                    trigger(el, 'inview');

                                    this.$update();

                                    data.inview = true;
                                    delete data.timer;
                                };

                                if (this.delay && index) {
                                    data.timer = setTimeout(show, this.delay * index);
                                } else {
                                    show();
                                }

                                index++;

                            }

                        } else {

                            if (data.inview && this.repeat) {

                                if (data.timer) {
                                    clearTimeout(data.timer);
                                    delete data.timer;
                                }

                                css(el, 'visibility', this.hidden ? 'hidden' : '');
                                removeClass(el, this.inViewClass);
                                toggleClass(el, cls);

                                trigger(el, 'outview');

                                this.$update();

                                data.inview = false;

                            }

                        }

                    });

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

}
