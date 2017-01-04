import { $, fastdom, isInView, toJQuery } from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy', {

        props: {
            cls: String,
            target: String,
            hidden: Boolean,
            offsetTop: Number,
            offsetLeft: Number,
            repeat: Boolean,
            delay: Number
        },

        defaults: {
            cls: 'uk-scrollspy-inview',
            target: false,
            hidden: true,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        },

        init() {
            if (this.hidden) {
                this.getElements().css('visibility', 'hidden');
            }
        },

        ready() {

            this.elements = this.getElements();

            if (this.hidden) {
                this.elements.css('visibility', 'hidden');
            }
        },

        update: {

            read() {
                this.elements.each((i, el) => {

                    if (!el.__uk_scrollspy) {
                        el.__uk_scrollspy = {toggles: ($(el).attr('uk-scrollspy-class') || this.cls).split(',')};
                    }

                    el.__uk_scrollspy.show = isInView(el, this.offsetTop, this.offsetLeft);

                });
            },

            write() {

                var index = this.elements.length === 1 ? 1 : 0;

                this.elements.each((i, el) => {

                    var $el = $(el);

                    var data = el.__uk_scrollspy;

                    if (data.show) {

                        if (!data.inview && !data.timer) {

                            data.timer = setTimeout(() => {

                                $el.css('visibility', '')
                                    .addClass(this.inViewClass)
                                    .toggleClass(data.toggles[0])
                                    .trigger('inview');

                                data.inview = true;
                                delete data.timer;

                            }, this.delay * index++);

                        }

                    } else {

                        if (data.inview && this.repeat) {

                            if (data.timer) {
                                clearTimeout(data.timer);
                                delete data.timer;
                            }

                            $el.removeClass(this.inViewClass)
                                .toggleClass(data.toggles[0])
                                .css('visibility', this.hidden ? 'hidden' : '')
                                .trigger('outview');

                            data.inview = false;
                        }

                    }

                    data.toggles.reverse();

                });

            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        },

        methods: {

            getElements() {
                return this.target && toJQuery(this.target, this.$el) || this.$el;
            }

        }

    });

}
