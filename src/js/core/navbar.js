import {
    $$,
    addClass,
    css,
    dimensions,
    hasClass,
    observeResize,
    on,
    parent,
    removeClass,
    replaceClass,
    scrollParent,
} from 'uikit-util';
import { intersection, mutation } from '../api/observables';
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

        dropbarOffset({ dropbarTransparentMode }) {
            return dropbarTransparentMode === 'behind' ? this.navbarContainer.offsetHeight : 0;
        },
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
            handler([{ isIntersecting }]) {
                this._isIntersecting = isIntersecting;
                this.registerColorListener();
            },
            options: { rootMargin: '500px 0px' },
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

            el() {
                return this.dropContainer;
            },

            async handler() {
                await awaitMacroTask();

                if (!this.getActive() && this._transparent) {
                    addClass(this.navbarContainer, clsNavbarTransparent);
                    this._transparent = null;
                }
            },
        },
    ],

    update: {
        read() {
            replaceClass(
                this.navbarContainer,
                'uk-light,uk-dark',
                findNavbarColor(this.navbarContainer) || '',
            );
        },
        events: ['color'],
    },

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

        registerColorListener() {
            const active = this._isIntersecting && !isWithinMixBlendMode(this.navbarContainer);

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

            this._colorListener = registerListener(this.navbarContainer, this.dropContainer, () =>
                this.$emit('color'),
            );
        },
    },
};

function awaitMacroTask() {
    return new Promise((resolve) => setTimeout(resolve));
}

function registerListener(navbarContainer, dropContainerhandler, handler) {
    const parent = scrollParent(navbarContainer, true);
    const scrollEl = parent === document.documentElement ? document : parent;

    const observer = observeResize([navbarContainer, parent], handler);
    const listener = [
        on(scrollEl, 'scroll', handler, { passive: true }),
        on(document, 'itemshown itemhidden', handler, { passive: true }),
        on(
            dropContainerhandler,
            'hide show',
            (e) => observer[e.type === 'show' ? 'observe' : 'unobserve'](e.target),
            { passive: true },
        ),
    ];

    return () => {
        listener.map((off) => off());
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

function findNavbarColor(navbarContainer) {
    if (!hasClass(navbarContainer, clsNavbarTransparent)) {
        return;
    }

    const { left, top, height, width } = dimensions(navbarContainer);

    const elements = navbarContainer.ownerDocument.elementsFromPoint(
        Math.max(0, left) + width / 2,
        Math.max(0, top) + height / 2,
    );

    for (const element of elements) {
        if (navbarContainer.contains(element)) {
            continue;
        }

        const color = css(element, '--uk-navbar-color');
        if (color) {
            return `uk-${color}`;
        }
    }
}
