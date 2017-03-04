import { $, toJQuery, win, isInView } from '../util/index';

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

        update: [

            {

                read() {
                    this.links = this.$el.find('a[href^="#"]').filter((i, el) => el.hash);
                    this.elements = (this.closest ? this.links.closest(this.closest) : this.links);
                    this.targets = $($.map(this.links, (el) => el.hash).join(','));

                    if (this.scroll) {
                        this.links.each((_, el) => UIkit.scroll(el, {offset: this.offset || 0}));
                    }
                }

            },

            {

                read() {

                    var scroll = win.scrollTop() + this.offset, max = document.documentElement.scrollHeight - window.innerHeight + this.offset;

                    this.active = false;

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

                        return !(this.active = toJQuery(this.links.filter(`[href="#${el.attr('id')}"]`)));

                    });

                },

                write() {

                    this.links.blur();
                    this.elements.removeClass(this.cls);

                    if (this.active) {
                        this.$el.trigger('active', [
                            this.active,
                            (this.closest ? this.active.closest(this.closest) : this.active).addClass(this.cls)
                        ]);
                    }

                },

                events: ['scroll', 'load', 'resize', 'orientationchange']

            }

        ]

    });

}
