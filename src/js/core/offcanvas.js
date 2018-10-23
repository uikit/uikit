import Modal from '../mixin/modal';
import {$, addClass, css, hasClass, height, isTouch, removeClass, trigger, unwrap, wrapAll} from 'uikit-util';

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

            filter() {
                return this.overlay;
            },

            passive: false,

            handler(e) {
                e.preventDefault();
            }

        },

        {
            name: 'touchmove',

            el() {
                return this.panel;
            },

            passive: false,

            handler(e) {

                if (e.targetTouches.length !== 1) {
                    return;
                }

                const clientY = event.targetTouches[0].clientY - this.clientY;
                const {scrollTop, scrollHeight, clientHeight} = this.panel;

                if (scrollTop === 0 && clientY > 0
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

                if (this.mode === 'reveal' && !hasClass(this.panel, this.clsMode)) {
                    wrapAll(this.panel, '<div>');
                    addClass(this.panel.parentNode, this.clsMode);
                }

                css(document.documentElement, 'overflowY', this.overlay ? 'hidden' : '');
                addClass(document.body, this.clsContainer, this.clsFlip);
                height(document.body); // force reflow
                addClass(document.body, this.clsContainerAnimation);
                addClass(this.panel, this.clsSidebarAnimation, this.mode !== 'reveal' ? this.clsMode : '');
                addClass(this.$el, this.clsOverlay);
                css(this.$el, 'display', 'block');
                height(this.$el); // force reflow

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

                if (this.isToggled() && isTouch(e) && (e.type === 'swipeLeft' && !this.flip || e.type === 'swipeRight' && this.flip)) {
                    this.hide();
                }

            }
        }

    ]

};
