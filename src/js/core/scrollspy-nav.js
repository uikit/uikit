import {
    $$,
    dimensions,
    getCoveringElement,
    getTargetedElement,
    hasClass,
    isVisible,
    offset,
    offsetViewport,
    scrollParent,
    toggleClass,
    trigger,
} from 'uikit-util';
import { intersection, scroll } from '../api/observables';

export default {
    props: {
        cls: String,
        closest: Boolean,
        scroll: Boolean,
        target: String,
        offset: Number,
    },

    data: {
        cls: 'uk-active',
        closest: false,
        scroll: false,
        target: 'a[href]:not([role="button"])',
        offset: 0,
    },

    computed: {
        links: {
            get({ target }, $el) {
                return $$(target, $el).filter(getTargetedElement);
            },
            observe: () => '*',
        },

        targets() {
            return this.links.map((el) => getTargetedElement(el));
        },

        elements({ closest }) {
            return this.links.map((el) => el.closest(closest || '*'));
        },
    },

    watch: {
        links(links) {
            if (this.scroll) {
                this.$create('scroll', links, { offset: this.offset });
            }
        },
    },

    observe: [intersection(), scroll()],

    update: [
        {
            read() {
                const { targets } = this;
                const { length } = targets;

                if (!length || !isVisible(this.$el)) {
                    return false;
                }

                const scrollElement = scrollParent(targets, true);
                const { scrollTop, scrollHeight } = scrollElement;
                const viewport = offsetViewport(scrollElement);
                const max = scrollHeight - viewport.height;
                let active = false;

                if (scrollTop >= max) {
                    active = length - 1;
                } else {
                    const offsetBy =
                        this.offset +
                        dimensions(getCoveringElement()).height +
                        viewport.height * 0.1;

                    for (let i = 0; i < targets.length; i++) {
                        if (offset(targets[i]).top - viewport.top - offsetBy > 0) {
                            break;
                        }
                        active = +i;
                    }
                }

                return { active };
            },

            write({ active }) {
                const { elements } = this;
                const changed = active !== false && !hasClass(elements[active], this.cls);

                this.links.forEach((el) => el.blur());
                for (let i = 0; i < elements.length; i++) {
                    toggleClass(elements[i], this.cls, +i === active);
                }

                if (changed) {
                    trigger(this.$el, 'active', [active, elements[active]]);
                }
            },

            events: ['scroll', 'resize'],
        },
    ],
};
