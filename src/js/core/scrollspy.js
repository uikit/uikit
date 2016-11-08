import { $, isInView, toJQuery } from '../util/index';

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

            handler() {

                var index = this.elements.length === 1 ? 1 : 0;

                requestAnimationFrame(() => { // wait for other components to do their positioning (grid)

                    this.elements.each((i, el) => {

                        var $el = $(el);

                        if (!el.__uk_scrollspy) {
                            el.__uk_scrollspy = {toggles: ($el.attr('uk-scrollspy-class') ? $el.attr('uk-scrollspy-class') : this.cls).split(',')};
                        }

                        var data = el.__uk_scrollspy;

                        if (isInView(el, this.offsetTop, this.offsetLeft)) {

                            if (!data.inview && !data.timer) {

                                data.timer = setTimeout(() => {

                                    $el.css('visibility', '').addClass(this.inViewClass).toggleClass(data.toggles[0]).trigger('inview'); // TODO rename event?

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

                                $el.removeClass(this.inViewClass).toggleClass(data.toggles[0]).css('visibility', this.hidden ? 'hidden' : '').trigger('outview'); // TODO rename event?
                                data.inview = false;
                            }

                        }

                        data.toggles.reverse();
                    });

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
