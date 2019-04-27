import Modal from '../mixin/modal';
import {$, addClass, append, css, endsWith, hasClass, height, removeClass, trigger, unwrap, wrapAll} from 'uikit-util';

export default {

    mixins: [Modal],

    args: 'mode',

    props: {
        mode: String,
        flip: Boolean,
        overlay: Boolean
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
        selClose: '.uk-offcanvas-close'
    },

    computed: {

        clsFlip({flip, clsFlip}) {
            return flip ? clsFlip : '';
        },

        clsOverlay({overlay, clsOverlay}) {
            return overlay ? clsOverlay : '';
        },

        clsMode({mode, clsMode}) {
            return `${clsMode}-${mode}`;
        },

        clsSidebarAnimation({mode, clsSidebarAnimation}) {
            return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },

        clsContainerAnimation({mode, clsContainerAnimation}) {
            return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
        },

        transitionElement({mode}) {
            return mode === 'reveal' ? this.panel.parentNode : this.panel;
        }

    },

    events: [

        {

            name: 'click',

            delegate() {
                return 'a[href^="#"]';
            },

            handler({current}) {
                if (current.hash && $(current.hash, document.body)) {
                    this.hide();
                }
            }

        },

        {
            name: 'touchstart',

            passive: true,

            el() {
                return this.panel;
            },

            handler({targetTouches}) {

                if (targetTouches.length === 1) {
                    this.clientY = targetTouches[0].clientY;
                }

            }

        },

        {
            name: 'touchmove',

            self: true,
            passive: false,

            filter() {
                return this.overlay;
            },

            handler(e) {
                if (e.cancelable)
                    e.preventDefault();
            }

        },

        {
            name: 'touchmove',

            passive: false,

            el() {
                return this.panel;
            },

            handler(e) {

                if (e.targetTouches.length !== 1 || !e.cancelable) {
                    return;
                }

                const clientY = event.targetTouches[0].clientY - this.clientY;
                const {scrollTop, scrollHeight, clientHeight} = this.panel;

                if (clientHeight >= scrollHeight
                    || scrollTop === 0 && clientY > 0
                    || scrollHeight - scrollTop <= clientHeight && clientY < 0
                ) {
                    e.preventDefault();
                }

            }

        },

        {
            name: 'show',

            self: true,

            handler() {

                if (this.mode === 'reveal' && !hasClass(this.panel.parentNode, this.clsMode)) {
                    wrapAll(this.panel, '<div>');
                    addClass(this.panel.parentNode, this.clsMode);
                }

                css(document.documentElement, 'overflowY', this.overlay ? 'hidden' : '');
                addClass(document.body, this.clsContainer, this.clsFlip);
                css(this.$el, 'display', 'block');
                addClass(this.$el, this.clsOverlay);
                addClass(this.panel, this.clsSidebarAnimation, this.mode !== 'reveal' ? this.clsMode : '');

                height(document.body); // force reflow
                addClass(document.body, this.clsContainerAnimation);

                this.clsContainerAnimation && suppressUserScale();

            }
        },

        {
            name: 'hide',

            self: true,

            handler() {
                removeClass(document.body, this.clsContainerAnimation);

                const active = this.getActive();
                if (this.mode === 'none' || active && active !== this && active !== this.prev) {
                    trigger(this.panel, 'transitionend');
                }
            }
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
                removeClass(document.body, this.clsContainer, this.clsFlip);

                css(document.documentElement, 'overflowY', '');

            }
        },

        {
            name: 'swipeLeft swipeRight',

            handler(e) {

                if (this.isToggled() && endsWith(e.type, 'Left') ^ this.flip) {
                    this.hide();
                }

            }
        }

    ]

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
    return $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">');
}
