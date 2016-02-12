import $ from 'jquery';
import {isInView} from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            offsetTop: Number,
            offsetLeft: Number,
            smoothScroll: Boolean
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            offsetTop: 0,
            offsetLeft: 0,
            smoothScroll: false
        },

        ready() {
            this.links = this.$el.find('a[href^="#"]').filter((i, el) => { return el.hash; });
            this.targets = $($.map(this.links, (el) => { return el.hash }).join(','));

            if (this.smoothScroll) {
                this.links.each(function () {
                    UIkit.smoothScroll(this);
                });
            }
        },

        update: {

            handler() {

                var scrollTop = $(window).scrollTop(), target, links,
                    visible = this.targets.filter((i, el) => {
                        return isInView(el, this.offsetTop, this.offsetLeft);
                    });

                visible.each((i, el) => {

                    if (!$(el).offset().top >= scrollTop || target) {
                        return;
                    }

                    target = $(el);

                    if (this.closest) {
                        this.links.blur().closest(this.closest).removeClass(this.cls);
                        links = this.links.filter(`a[href="#${target.attr('id')}"]`).closest(this.closest);
                    } else {
                        links = this.links.removeClass(this.cls).filter(`a[href="#${target.attr('id')}"]`);
                    }

                    links.addClass(this.cls);

                    this.$el.trigger('inview', [target, links]);

                });
            },

            events: ['scrolling', 'load', 'resize', 'orientationchange', 'update']

        }

    });

}
