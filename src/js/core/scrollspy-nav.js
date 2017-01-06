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

                var scroll = win.scrollTop() + this.offset,
                    max = document.documentElement.scrollHeight - window.innerHeight + this.offset;

                this.links.blur();
                this.elements.removeClass(this.cls);

                this.targets.each((i, el) => {

                    el = $(el);

                    var offset = el.offset(), last = i + 1 === this.targets.length;
                    if (!this.overflow && (i === 0 && offset.top > scroll || last && offset.top + el.outerHeight() < scroll)) {
                        return false;
                    }

                    if (!last && this.targets.eq(i + 1).offset().top <= scroll) {
                        return;
                    }

                    if (scroll >= max) {
                        for (var j = this.targets.length; j > i; j--) {
                            if (isInView(this.targets.eq(j))) {
                                el = this.targets.eq(j);
                                break;
                            }
                        }
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
