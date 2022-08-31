import Scroll from '../mixin/scroll';
import {
    $$,
    closest,
    hasClass,
    isVisible,
    offset,
    offsetViewport,
    scrollParents,
    toggleClass,
    trigger,
} from 'uikit-util';
import { getTargetElement } from './scroll';
import { isSameSiteAnchor } from '../mixin/modal';

export default {
    mixins: [Scroll],

    props: {
        cls: String,
        closest: String,
        scroll: Boolean,
        overflow: Boolean,
        offset: Number,
    },

    data: {
        cls: 'uk-active',
        closest: false,
        scroll: false,
        overflow: true,
        offset: 0,
    },

    computed: {
        links: {
            get(_, $el) {
                return $$('a[href*="#"]', $el).filter((el) => el.hash && isSameSiteAnchor(el));
            },

            watch(links) {
                if (this.scroll) {
                    this.$create('scroll', links, { offset: this.offset || 0 });
                }
            },

            immediate: true,
        },

        elements({ closest: selector }) {
            return closest(this.links, selector || '*');
        },
    },

    update: [
        {
            read() {
                const targets = this.links.map(getTargetElement).filter(Boolean);

                const { length } = targets;

                if (!length || !isVisible(this.$el)) {
                    return false;
                }

                const [scrollElement] = scrollParents(targets, /auto|scroll/, true);
                const { scrollTop, scrollHeight } = scrollElement;
                const viewport = offsetViewport(scrollElement);
                const max = scrollHeight - viewport.height;
                let active = false;

                if (scrollTop === max) {
                    active = length - 1;
                } else {
                    for (let i = 0; i < targets.length; i++) {
                        if (offset(targets[i]).top - viewport.top - this.offset > 0) {
                            break;
                        }
                        active = +i;
                    }

                    if (active === false && this.overflow) {
                        active = 0;
                    }
                }

                return { active };
            },

            write({ active }) {
                const changed = active !== false && !hasClass(this.elements[active], this.cls);

                this.links.forEach((el) => el.blur());
                for (let i = 0; i < this.elements.length; i++) {
                    toggleClass(this.elements[i], this.cls, +i === active);
                }

                if (changed) {
                    trigger(this.$el, 'active', [active, this.elements[active]]);
                }
            },

            events: ['scroll', 'resize'],
        },
    ],
};
