import { $, win, isInView } from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            scroll: Boolean,
            overflow: Boolean,
            offset: Number
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            scroll: false,
            overflow: true,
            offset: 0
        },

        ready() {
            this.links = this.$el.find('a[href^="#"]').filter((i, el) => el.hash);
            this.elements = (this.closest ? this.links.closest(this.closest) : this.links);
            this.targets = $($.map(this.links, (el) => el.hash).join(','));

            if (this.scroll) {

                var offset = this.offset || 0;

                this.links.each(function () {
                    UIkit.scroll(this, {offset});
                });
            }
        },

        update: {

            write() {

                var scrollTop = win.scrollTop() + this.offset, maxScroll = this.offset + document.documentElement.scrollHeight - window.innerHeight;
                var activeLink, activeTarget;

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

                    var link = this.links.filter(`[href="#${el.attr('id')}"]`);

                    if (link.length) {
                        activeLink = link;
                        activeTarget = el;
                        return false;
                    }
                });

                if (scrollTop >= maxScroll) {

                    var inview = this.targets.filter((i, el) => isInView(el)).last();

                    if (inview.length) {
                        activeTarget = inview;
                        activeLink = this.links.filter(`[href="#${activeTarget.attr('id')}"]`);
                    }
                }

                if (activeLink && activeLink.length) {
                    activeLink = (this.closest ? activeLink.closest(this.closest) : activeLink).addClass(this.cls);
                    this.$el.trigger('active', [activeTarget, activeLink]);
                }
            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        }

    });

}
