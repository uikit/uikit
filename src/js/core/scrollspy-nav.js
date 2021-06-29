import {$$, addClass, closest, escape, getViewport, getViewportClientHeight, hasClass, isVisible, offset, removeClass, scrollParents, trigger} from 'uikit-util';

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

        links: {

            get(_, $el) {
                return $$('a[href^="#"]', $el).filter(el => el.hash);
            },

            watch(links) {
                if (this.scroll) {
                    this.$create('scroll', links, {offset: this.offset || 0});
                }
            },

            immediate: true

        },

        targets() {
            return $$(this.links.map(el => escape(el.hash).substr(1)).join(','));
        },

        elements({closest: selector}) {
            return closest(this.links, selector || '*');
        }

    },

    update: [

        {

            read() {

                const {length} = this.targets;

                if (!length || !isVisible(this.$el)) {
                    return false;
                }

                const [scrollElement] = scrollParents(this.targets, /auto|scroll/, true);
                const {scrollTop, scrollHeight} = scrollElement;
                const max = scrollHeight - getViewportClientHeight(scrollElement);
                let active = false;

                if (scrollTop === max) {
                    active = length - 1;
                } else {

                    this.targets.every((el, i) => {
                        if (offset(el).top - offset(getViewport(scrollElement)).top - this.offset <= 0) {
                            active = i;
                            return true;
                        }
                    });

                    if (active === false && this.overflow) {
                        active = 0;
                    }
                }

                return {active};
            },

            write({active}) {

                const changed = active !== false && !hasClass(this.elements[active], this.cls);

                this.links.forEach(el => el.blur());
                removeClass(this.elements, this.cls);
                addClass(this.elements[active], this.cls);

                if (changed) {
                    trigger(this.$el, 'active', [active, this.elements[active]]);
                }
            },

            events: ['scroll', 'resize']

        }

    ]

};
