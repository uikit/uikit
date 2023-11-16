import {
    $$,
    addClass,
    css,
    hasClass,
    observeResize,
    offset,
    on,
    parent,
    pointInRect,
    removeClass,
    replaceClass,
    scrollParent,
} from 'uikit-util';
import { intersection, mutation } from '../api/observables';
import Dropnav from './dropnav';

export default {
    extends: Dropnav,

    props: {
        dropbarTransparentMode: Boolean,
    },

    data: {
        clsDrop: 'uk-navbar-dropdown',
        selNavItem:
            '.uk-navbar-nav > li > a,a.uk-navbar-item,button.uk-navbar-item,.uk-navbar-item a,.uk-navbar-item button,.uk-navbar-toggle', // Simplify with :where() selector once browser target is Safari 14+
        selTransparentTarget: '[class*="uk-section"]',
        dropbarTransparentMode: false,
    },

    computed: {
        navbarContainer: (_, $el) => $el.closest('.uk-navbar-container'),

        dropbarOffset: ({ dropbarTransparentMode }, $el) =>
            dropbarTransparentMode === 'behind' ? $el.offsetHeight : 0,
    },

    watch: {
        items() {
            const justify = hasClass(this.$el, 'uk-navbar-justify');
            for (const container of $$(
                '.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right',
                this.$el,
            )) {
                css(
                    container,
                    'flexGrow',
                    justify
                        ? $$(
                              '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
                              container,
                          ).length
                        : '',
                );
            }
        },
    },

    disconnect() {
        this._colorListener?.();
    },

    observe: [
        mutation({
            target: ({ navbarContainer }) => navbarContainer,
            handler: 'registerColorListener',
            options: { attributes: true, attributeFilter: ['class'], attributeOldValue: true },
        }),
        intersection({
            handler(records) {
                this._isIntersecting = records[0].isIntersecting;
                this.registerColorListener();
            },
            args: { intersecting: false },
        }),
    ],

    events: [
        {
            name: 'show',

            el() {
                return this.dropContainer;
            },

            handler({ target }) {
                const transparentMode = this.getTransparentMode(target);

                if (!transparentMode || this._mode) {
                    return;
                }

                const storePrevColor = () =>
                    (this._mode = removeClasses(this.navbarContainer, 'uk-light', 'uk-dark'));

                if (transparentMode === 'behind') {
                    const mode = getDropbarBehindColor(this.$el);
                    if (mode) {
                        storePrevColor();
                        addClass(this.navbarContainer, `uk-${mode}`);
                    }
                }

                if (transparentMode === 'remove') {
                    storePrevColor();
                    removeClass(this.navbarContainer, 'uk-navbar-transparent');
                }
            },
        },
        {
            name: 'hide',

            el() {
                return this.dropContainer;
            },

            async handler({ target }) {
                const transparentMode = this.getTransparentMode(target);

                if (!transparentMode || !this._mode) {
                    return;
                }

                await awaitMacroTask();

                if (this.getActive()) {
                    return;
                }

                if (transparentMode === 'behind') {
                    const mode = getDropbarBehindColor(this.$el);
                    if (mode) {
                        removeClass(this.navbarContainer, `uk-${mode}`);
                    }
                }

                addClass(this.navbarContainer, this._mode);

                if (transparentMode === 'remove') {
                    addClass(this.navbarContainer, 'uk-navbar-transparent');
                }

                this._mode = null;
            },
        },
    ],

    methods: {
        getTransparentMode(el) {
            if (!this.navbarContainer) {
                return;
            }

            if (this.dropbar && this.isDropbarDrop(el)) {
                return this.dropbarTransparentMode;
            }

            const drop = this.getDropdown(el);

            if (!drop || !hasClass(el, 'uk-dropbar')) {
                return;
            }

            return drop.inset ? 'behind' : 'remove';
        },

        registerColorListener() {
            const active =
                this._isIntersecting &&
                hasClass(this.navbarContainer, 'uk-navbar-transparent') &&
                !isWithinMixBlendMode(this.navbarContainer) &&
                !$$('.uk-drop', this.dropContainer)
                    .map(this.getDropdown)
                    .some(
                        (drop) =>
                            drop.isToggled() &&
                            (drop.inset || this.getTransparentMode(drop.$el) === 'behind'),
                    );

            if (this._colorListener) {
                if (!active) {
                    this._colorListener();
                    this._colorListener = null;
                }
                return;
            }

            if (!active) {
                return;
            }

            this._colorListener = listenForPositionChange(this.navbarContainer, () => {
                const { left, top, height } = offset(this.navbarContainer);
                const startPoint = { x: left, y: Math.max(0, top) + height / 2 };
                const target = $$(this.selTransparentTarget).find((target) =>
                    pointInRect(startPoint, offset(target)),
                );
                const color = css(target, '--uk-navbar-color');
                if (color) {
                    replaceClass(this.navbarContainer, 'uk-light,uk-dark', `uk-${color}`);
                }
            });
        },
    },
};

function removeClasses(el, ...classes) {
    for (const cls of classes) {
        if (hasClass(el, cls)) {
            removeClass(el, cls);
            return cls;
        }
    }
}

async function awaitMacroTask() {
    return new Promise((resolve) => setTimeout(resolve));
}

function getDropbarBehindColor(el) {
    return css(el, '--uk-navbar-dropbar-behind-color');
}

function listenForPositionChange(el, handler) {
    const parent = scrollParent(el, true);
    const scrollEl = parent === document.documentElement ? document : parent;

    const off = on(scrollEl, 'scroll', handler, { passive: true });
    const observer = observeResize([el, parent], handler);

    return () => {
        off();
        observer.disconnect();
    };
}

function isWithinMixBlendMode(el) {
    do {
        if (css(el, 'mixBlendMode') !== 'normal') {
            return true;
        }
    } while ((el = parent(el)));
}
