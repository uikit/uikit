import Dropnav from './dropnav';
import { $$, addClass, closest, css, hasClass, removeClass } from 'uikit-util';

export default {
    extends: Dropnav,

    props: {
        dropbarTransparentMode: Boolean,
    },

    data: {
        clsDrop: 'uk-navbar-dropdown',
        selNavItem:
            '.uk-navbar-nav > li > a,a.uk-navbar-item,button.uk-navbar-item,.uk-navbar-item a,.uk-navbar-item button,.uk-navbar-toggle', // Simplify with :where() selector once browser target is Safari 14+
        dropbarTransparentMode: false,
    },

    computed: {
        dropbarOffset() {
            return this.dropbarTransparentMode === 'behind' ? this.$el.offsetHeight : 0;
        },

        navbarContainer() {
            return closest(this.$el, '.uk-navbar-container');
        },
    },

    watch: {
        items() {
            const justify = hasClass(this.$el, 'uk-navbar-justify');
            for (const container of $$(
                '.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right',
                this.$el
            )) {
                css(
                    container,
                    'flexGrow',
                    justify
                        ? $$(
                              '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle',
                              container
                          ).length
                        : ''
                );
            }
        },
    },

    events: [
        {
            name: 'show',

            el() {
                return this.dropContainer;
            },

            filter() {
                return this.dropbar;
            },

            handler({ target }) {
                if (!this.isDropbarDrop(target) || !this.navbarContainer) {
                    return;
                }

                this._transparent = null;

                if (this.dropbarTransparentMode) {
                    this._transparent = removeClasses(this.navbarContainer, 'uk-light', 'uk-dark');
                }

                if (this.dropbarTransparentMode === 'behind') {
                    addClass(this.dropbar, 'uk-position-z-index');
                }

                if (this.dropbarTransparentMode === 'remove') {
                    removeClass(this.navbarContainer, 'uk-navbar-transparent');
                }
            },
        },
        {
            name: 'hidden',

            el() {
                return this.dropContainer;
            },

            filter() {
                return this.dropbar;
            },

            handler({ target }) {
                if (!this.isDropbarDrop(target) || !this.navbarContainer) {
                    return;
                }

                if (
                    this.dropbarTransparentMode === 'behind' &&
                    hasClass(this.navbarContainer, 'uk-navbar-transparent') &&
                    this._transparent
                ) {
                    addClass(this.navbarContainer, this._transparent);
                }

                if (this.dropbarTransparentMode === 'remove' && this._transparent) {
                    addClass(this.navbarContainer, this._transparent, 'uk-navbar-transparent');
                }
            },
        },
    ],
};

function removeClasses(el, ...classes) {
    for (const cls of classes) {
        if (hasClass(el, cls)) {
            removeClass(el, cls);
            return cls;
        }
    }
}
