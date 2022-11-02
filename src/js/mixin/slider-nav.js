import {
    $,
    $$,
    attr,
    closest,
    data,
    html,
    isNumeric,
    toFloat,
    toggleClass,
    toNumber,
} from 'uikit-util';
import { generateId } from './utils';

export default {
    i18n: {
        next: 'Next slide',
        previous: 'Previous slide',
        slideX: 'Slide %s',
    },

    data: {
        selNav: false,
    },

    computed: {
        nav({ selNav }, $el) {
            return $(selNav, $el);
        },

        selNavItem({ attrItem }) {
            return `[${attrItem}],[data-${attrItem}]`;
        },

        navItems: {
            get(_, $el) {
                return $$(this.selNavItem, $el);
            },

            watch() {
                this.$emit();
            },
        },
    },

    update: {
        write() {
            if (this.nav && this.length !== this.nav.children.length) {
                html(
                    this.nav,
                    this.slides
                        .map((_, i) => `<li ${this.attrItem}="${i}"><a href></a></li>`)
                        .join('')
                );
            }

            this.navItems.concat(this.nav).forEach((el) => el && (el.hidden = !this.maxIndex));

            this.updateNav();
        },

        events: ['resize'],
    },

    events: [
        {
            name: 'click',

            delegate() {
                return this.selNavItem;
            },

            handler(e) {
                if (closest(e.target, 'a,button')) {
                    e.preventDefault();
                    this.show(data(e.current, this.attrItem));
                }
            },
        },

        {
            name: 'itemshow',
            handler: 'updateNav',
        },
    ],

    methods: {
        updateNav() {
            const index = this.getValidIndex();
            for (const el of this.navItems) {
                const cmd = data(el, this.attrItem);
                const button = $('a,button', el) || el;

                let ariaLabel;
                let ariaControls;
                if (isNumeric(cmd)) {
                    const item = toNumber(cmd);
                    const slide = this.slides[item];

                    if (slide) {
                        if (!slide.id) {
                            slide.id = generateId(this, slide, `-item-${cmd}`);
                        }
                        ariaControls = slide.id;
                    }

                    ariaLabel = this.t('slideX', toFloat(cmd) + 1);

                    const active = item === index;

                    toggleClass(el, this.clsActive, active);

                    attr(button, {
                        role: 'tab',
                        'aria-selected': active,
                    });
                } else {
                    if (this.list) {
                        if (!this.list.id) {
                            this.list.id = generateId(this, this.list, '-items');
                        }

                        ariaControls = this.list.id;
                    }

                    ariaLabel = this.t(cmd);

                    toggleClass(
                        el,
                        'uk-invisible',
                        this.finite &&
                            ((cmd === 'previous' && index === 0) ||
                                (cmd === 'next' && index >= this.maxIndex))
                    );
                }

                attr(button, {
                    'aria-controls': ariaControls,
                    'aria-label': attr(button, 'aria-label') || ariaLabel,
                });
            }
        },
    },
};
