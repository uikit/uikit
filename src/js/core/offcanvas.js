import Modal from '../mixin/modal';
import { swipe } from '../api/observables';
import {
    $,
    addClass,
    append,
    css,
    endsWith,
    hasClass,
    height,
    isVisible,
    parent,
    removeClass,
    unwrap,
    wrapAll,
} from 'uikit-util';

export default {
    mixins: [Modal],

    args: 'mode',

    props: {
        mode: String,
        flip: Boolean,
        overlay: Boolean,
        swiping: Boolean,
    },

    data: {
        mode: 'slide',
        flip: false,
        overlay: false,
        clsPage: 'uk-offcanvas-page',
        clsContainer: 'uk-offcanvas-container',
        selPanel: '.uk-offcanvas-bar',
        clsFlip: 'uk-offcanvas-flip',
        clsContainerAnimation: 'uk-offcanvas-container-animation',
        clsSidebarAnimation: 'uk-offcanvas-bar-animation',
        clsMode: 'uk-offcanvas',
        clsOverlay: 'uk-offcanvas-overlay',
        selClose: '.uk-offcanvas-close',
        container: false,
        swiping: true,
    },

    computed: {
        clsFlip({ flip, clsFlip }) {
            return flip ? clsFlip : '';
        },

        clsOverlay({ overlay, clsOverlay }) {
            return overlay ? clsOverlay : '';
        },

        clsMode({ mode, clsMode }) {
            return `${clsMode}-${mode}`;
        },

        clsSidebarAnimation({ mode, clsSidebarAnimation }) {
            return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },

        clsContainerAnimation({ mode, clsContainerAnimation }) {
            return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
        },

        transitionElement({ mode }) {
            return mode === 'reveal' ? parent(this.panel) : this.panel;
        },
    },

    observe: swipe({ filter: ({ swiping }) => swiping }),

    update: {
        read() {
            if (this.isToggled() && !isVisible(this.$el)) {
                this.hide();
            }
        },

        events: ['resize'],
    },

    events: [
        {
            name: 'touchmove',

            self: true,
            passive: false,

            filter() {
                return this.overlay;
            },

            handler(e) {
                e.cancelable && e.preventDefault();
            },
        },

        {
            name: 'show',

            self: true,

            handler() {
                if (this.mode === 'reveal' && !hasClass(parent(this.panel), this.clsMode)) {
                    wrapAll(this.panel, '<div>');
                    addClass(parent(this.panel), this.clsMode);
                }

                const { body, scrollingElement } = document;

                addClass(body, this.clsContainer, this.clsFlip);
                css(body, 'touch-action', 'pan-y pinch-zoom');
                css(this.$el, 'display', 'block');
                css(this.panel, 'maxWidth', scrollingElement.clientWidth);
                addClass(this.$el, this.clsOverlay);
                addClass(
                    this.panel,
                    this.clsSidebarAnimation,
                    this.mode === 'reveal' ? '' : this.clsMode
                );

                height(body); // force reflow
                addClass(body, this.clsContainerAnimation);

                this.clsContainerAnimation && suppressUserScale();
            },
        },

        {
            name: 'hide',

            self: true,

            handler() {
                removeClass(document.body, this.clsContainerAnimation);
                css(document.body, 'touch-action', '');
            },
        },

        {
            name: 'hidden',

            self: true,

            handler() {
                this.clsContainerAnimation && resumeUserScale();

                if (this.mode === 'reveal') {
                    unwrap(this.panel);
                }

                removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
                removeClass(this.$el, this.clsOverlay);
                css(this.$el, 'display', '');
                css(this.panel, 'maxWidth', '');
                removeClass(document.body, this.clsContainer, this.clsFlip);
            },
        },

        {
            name: 'swipeLeft swipeRight',

            handler(e) {
                if (this.isToggled() && endsWith(e.type, 'Left') ^ this.flip) {
                    this.hide();
                }
            },
        },
    ],
};

// Chrome in responsive mode zooms page upon opening offcanvas
function suppressUserScale() {
    getViewport().content += ',user-scalable=0';
}

function resumeUserScale() {
    const viewport = getViewport();
    viewport.content = viewport.content.replace(/,user-scalable=0$/, '');
}

function getViewport() {
    return (
        $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">')
    );
}
