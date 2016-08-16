import { $ } from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            scroll: Boolean,
            overflow: Boolean
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            scroll: false,
            overflow: true
        },

        ready() {
            this.links = this.$el.find('a[href^="#"]').filter((i, el) => el.hash);
            this.elements = (this.closest ? this.links.closest(this.closest) : this.links);
            this.targets = $($.map(this.links, (el) => el.hash).join(','));

            if (this.scroll) {
                this.links.each(function () {
                    UIkit.scroll(this);
                });
            }
        },

        update: {

            handler() {

                var scrollTop = $(window).scrollTop();

                this.links.blur();
                this.elements.removeClass(this.cls);

                this.targets.each((i, el) => {

                    el = $(el);

                    var offset = el.offset(), last = i + 1 === this.targets.length;
                    if (!this.overflow && (i === 0 && offset.top > scrollTop || last && offset.top + el.outerHeight() < scrollTop)) {
                        return false;
                    }

                    if (!last && this.targets.eq(i + 1).offset().top <= scrollTop) {
                        return;
                    }

                    var active = this.links.filter(`[href="#${el.attr('id')}"]`);

                    if (active.length) {
                        active = (this.closest ? active.closest(this.closest) : active).addClass(this.cls);
                        this.$el.trigger('active', [el, active]);

                        return false;
                    }
                });
            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        }

    });

}
