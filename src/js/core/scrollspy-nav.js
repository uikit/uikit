import {$, $$, addClass, closest, escape, filter, height, isInView, offset, removeClass, trigger} from 'uikit-util';

export default {

    props: {
        cls: String,
        closest: String,
        scroll: Boolean,
        overflow: Boolean,
        offset: Number
    },

    data: {
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

        elements({closest: selector}) {
            return closest(this.links, selector || '*');
        },

        targets() {
            return $$(this.links.map(el => escape(el.hash).substr(1)).join(','));
        }

    },

    update: [

        {

            read() {
                if (this.scroll) {
                    this.$create('scroll', this.links, {offset: this.offset || 0});
                }
            }

        },

        {

            read(data) {

                const scroll = window.pageYOffset + this.offset + 1;
                const max = height(document) - height(window) + this.offset;

                data.active = false;

                this.targets.every((el, i) => {

                    const {top} = offset(el);
                    const last = i + 1 === this.targets.length;

                    if (!this.overflow && (i === 0 && top > scroll || last && top + el.offsetTop < scroll)) {
                        return false;
                    }

                    if (!last && offset(this.targets[i + 1]).top <= scroll) {
                        return true;
                    }

                    if (scroll >= max) {
                        for (let j = this.targets.length - 1; j > i; j--) {
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

            events: ['scroll', 'resize']

        }

    ]

};
