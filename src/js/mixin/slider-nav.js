import {
    $,
    $$,
    append,
    attr,
    children,
    closest,
    data,
    empty,
    isNumeric,
    matches,
    toFloat,
    toggleClass,
    toNumber,
} from 'uikit-util';
import { keyMap } from '../util/keys';
import { generateId } from '../api/instance';

export default {
    i18n: {
        next: 'Next slide',
        previous: 'Previous slide',
        slideX: 'Slide %s',
        slideLabel: '%s of %s',
        role: 'String',
    },

    data: {
        selNav: false,
        role: 'region',
    },

    computed: {
        nav({ selNav }, $el) {
            return $(selNav, $el);
        },

        navChildren() {
            return children(this.nav);
        },

        selNavItem({ attrItem }) {
            return `[${attrItem}],[data-${attrItem}]`;
        },

        navItems(_, $el) {
            return $$(this.selNavItem, $el);
        },
    },

    watch: {
        nav(nav, prev) {
            attr(nav, 'role', 'tablist');

            if (prev) {
                this.$emit();
            }
        },

        list(list) {
            attr(list, 'role', 'presentation');
        },

        navChildren(children) {
            attr(children, 'role', 'presentation');
        },

        navItems(items) {
            for (const el of items) {
                const cmd = data(el, this.attrItem);
                const button = $('a,button', el) || el;

                let ariaLabel;
                let ariaControls = null;
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

                    attr(button, 'role', 'tab');
                } else {
                    if (this.list) {
                        if (!this.list.id) {
                            this.list.id = generateId(this, this.list, '-items');
                        }

                        ariaControls = this.list.id;
                    }

                    ariaLabel = this.t(cmd);
                }

                attr(button, {
                    'aria-controls': ariaControls,
                    'aria-label': attr(button, 'aria-label') || ariaLabel,
                });
            }
        },

        slides(slides) {
            slides.forEach((slide, i) =>
                attr(slide, {
                    role: this.nav ? 'tabpanel' : 'group',
                    'aria-label': this.t('slideLabel', i + 1, this.length),
                    'aria-roledescription': this.nav ? null : 'slide',
                })
            );
        },

        length(length) {
            const navLength = this.navChildren.length;
            if (this.nav && length !== navLength) {
                empty(this.nav);
                for (let i = 0; i < length; i++) {
                    append(this.nav, `<li ${this.attrItem}="${i}"><a href></a></li>`);
                }
            }
        },
    },

    connected() {
        attr(this.$el, {
            role: this.role,
            ariaRoleDescription: 'carousel',
        });
    },

    update: [
        {
            write() {
                this.navItems.concat(this.nav).forEach((el) => el && (el.hidden = !this.maxIndex));
                this.updateNav();
            },

            events: ['resize'],
        },
    ],

    events: [
        {
            name: 'click keydown',

            delegate() {
                return this.selNavItem;
            },

            handler(e) {
                if (
                    closest(e.target, 'a,button') &&
                    (e.type === 'click' || e.keyCode === keyMap.SPACE)
                ) {
                    e.preventDefault();
                    this.show(data(e.current, this.attrItem));
                }
            },
        },

        {
            name: 'itemshow',
            handler: 'updateNav',
        },

        {
            name: 'keydown',

            delegate() {
                return this.selNavItem;
            },

            handler(e) {
                const { current, keyCode } = e;
                const cmd = data(current, this.attrItem);

                if (!isNumeric(cmd)) {
                    return;
                }

                let i =
                    keyCode === keyMap.HOME
                        ? 0
                        : keyCode === keyMap.END
                        ? 'last'
                        : keyCode === keyMap.LEFT
                        ? 'previous'
                        : keyCode === keyMap.RIGHT
                        ? 'next'
                        : -1;

                if (~i) {
                    e.preventDefault();
                    this.show(i);
                }
            },
        },
    ],

    methods: {
        updateNav() {
            const index = this.getValidIndex();
            let focus;
            let focusEl;
            for (const el of this.navItems) {
                const cmd = data(el, this.attrItem);
                const button = $('a,button', el) || el;

                if (isNumeric(cmd)) {
                    const item = toNumber(cmd);
                    const active = item === index;

                    toggleClass(el, this.clsActive, active);

                    attr(button, {
                        'aria-selected': active,
                        tabindex: active ? null : -1,
                    });

                    if (active) {
                        focusEl = button;
                    }

                    focus = focus || matches(button, ':focus');
                } else {
                    toggleClass(
                        el,
                        'uk-invisible',
                        this.finite &&
                            ((cmd === 'previous' && index === 0) ||
                                (cmd === 'next' && index >= this.maxIndex))
                    );
                }

                if (focus && focusEl) {
                    focusEl.focus();
                }
            }
        },
    },
};
