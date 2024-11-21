import { $$, addClass, css, hasClass, offset, parent, removeClass } from 'uikit-util';
import Dropnav from './dropnav';

const clsNavbarTransparent = 'uk-navbar-transparent';

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
        navbarContainer: (_, $el) => $el.closest('.uk-navbar-container'),
    },

    watch: {
        items() {
            const justify = hasClass(this.$el, 'uk-navbar-justify');
            const containers = $$('.uk-navbar-nav, .uk-navbar-left, .uk-navbar-right', this.$el);
            for (const container of containers) {
                const items = justify
                    ? $$('.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle', container)
                          .length
                    : '';
                css(container, 'flexGrow', items);
            }
        },
    },

    events: [
        {
            name: 'show',

            el: ({ dropContainer }) => dropContainer,

            handler({ target }) {
                if (
                    this.getTransparentMode(target) === 'remove' &&
                    hasClass(this.navbarContainer, clsNavbarTransparent)
                ) {
                    removeClass(this.navbarContainer, clsNavbarTransparent);
                    this._transparent = true;
                }
            },
        },
        {
            name: 'hide',

            el: ({ dropContainer }) => dropContainer,

            async handler(e) {
                if (parent(e.target) !== this.dropContainer) {
                    return;
                }

                await awaitMacroTask();

                if (!this.getActive() && this._transparent) {
                    addClass(this.navbarContainer, clsNavbarTransparent);
                    this._transparent = null;
                }
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

            if (drop && hasClass(el, 'uk-dropbar')) {
                return drop.inset ? 'behind' : 'remove';
            }
        },

        getDropbarOffset(offsetTop) {
            const { top, height } = offset(this.navbarContainer);
            return top + (this.dropbarTransparentMode === 'behind' ? 0 : height + offsetTop);
        },
    },
};

function awaitMacroTask() {
    return new Promise((resolve) => setTimeout(resolve));
}
