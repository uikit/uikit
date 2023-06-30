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
