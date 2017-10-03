import { $, docHeight, isInView, offsetTop, toJQuery } from '../util/index';

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

        computed: {

            links() {
                return this.$el.find('a[href^="#"]').filter((i, el) => el.hash);
            },

            elements() {
                return this.closest ? this.links.closest(this.closest) : this.links;
            },

            targets() {
                return $(this.links.toArray().map(el => el.hash).join(','));
            }

        },

        update: [

            {

                read() {
                    if (this.scroll) {
                        UIkit.scroll(this.links, {offset: this.offset || 0});
                    }
                }

            },

            {

                read() {

                    var scroll = window.pageYOffset + this.offset + 1, max = docHeight() - window.innerHeight + this.offset;

                    this.active = false;

                    this.targets.each((i, el) => {

                        var top = offsetTop(el), last = i + 1 === this.targets.length;
                        if (!this.overflow && (i === 0 && top > scroll || last && top + el.offsetTop < scroll)) {
                            return false;
                        }

                        if (!last && offsetTop(this.targets.eq(i + 1)) <= scroll) {
                            return;
                        }

                        if (scroll >= max) {
                            for (var j = this.targets.length - 1; j > i; j--) {
                                if (isInView(this.targets[j])) {
                                    el = this.targets[j];
                                    break;
                                }
                            }
                        }

                        return !(this.active = toJQuery(this.links.filter(`[href="#${el.id}"]`)));

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

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

}
