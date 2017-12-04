import { $, $$, addClass, closest, doc, filter, height, isInView, offset, removeClass, trigger, win } from '../util/index';

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

            links(_, $el) {
                return $$('a[href^="#"]', $el).filter(el => el.hash);
            },

            elements() {
                return this.closest ? closest(this.links, this.closest) : this.links;
            },

            targets() {
                return $$(this.links.map(el => el.hash).join(','));
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

                read(data) {

                    var scroll = win.pageYOffset + this.offset + 1,
                        max = height(doc) - height(win) + this.offset;

                    data.active = false;

                    this.targets.every((el, i) => {

                        var top = offset(el).top, last = i + 1 === this.targets.length;
                        if (!this.overflow && (i === 0 && top > scroll || last && top + el.offsetTop < scroll)) {
                            return false;
                        }

                        if (!last && offset(this.targets[i + 1]).top <= scroll) {
                            return true;
                        }

                        if (scroll >= max) {
                            for (var j = this.targets.length - 1; j > i; j--) {
                                if (isInView(this.targets[j])) {
                                    el = this.targets[j];
                                    break;
                                }
                            }
                        }

                        return !(data.active = $(filter(this.links, `[href="#${el.id}"]`)));

                    });

                },

                write({active}) {

                    this.links.forEach(el => el.blur());
                    removeClass(this.elements, this.cls);

                    if (active) {
                        trigger(this.$el, 'active', [active, addClass(this.closest ? closest(active, this.closest) : active, this.cls)]);
                    }

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

}
