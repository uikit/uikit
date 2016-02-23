import $ from 'jquery';
import {isInView} from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            smoothScroll: Boolean,
            overflow: Boolean
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            smoothScroll: false,
            overflow: true
        },

        ready() {
            this.links = this.$el.find('a[href^="#"]').filter((i, el) => { return el.hash; });
            this.elements = (this.closest ? this.links.closest(this.closest) : this.links);
            this.targets = $($.map(this.links, (el) => { return el.hash }).join(','));

            if (this.smoothScroll) {
                this.links.each(function () {
                    UIkit.smoothScroll(this);
                });
            }
        },

        update: {

            handler() {

                var scrollTop = $(window).scrollTop();

                this.targets.each((i, el) => {

                    el = $(el);

                    var offset = el.offset();
                    if (offset.top > scrollTop) {

                        this.clear();

                        if (this.overflow) {
                            this.activate(el);
                        }

                        return false;
                    }

                    if (!this.overflow && i + 1 === this.targets.length  && offset.top + el.outerHeight() < scrollTop) {
                        this.clear();
                        return false;
                    }

                    if (this.targets.eq(i + 1).length && this.targets.eq(i + 1).offset().top <= scrollTop) {
                        return;
                    }

                    this.clear();
                    this.activate(el);
                    return false;
                });
            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        },

        methods: {

            clear: function () {
                this.links.blur();
                this.elements.removeClass(this.cls);
            },

            activate: function (el) {

                var active = this.links.filter(`[href="#${el.attr('id')}"]`);

                if (active.length) {
                    active = (this.closest ? active.closest(this.closest) : active).addClass(this.cls);
                    this.$el.trigger('active', [el, active]);
                }
            }

        }

    });

}
