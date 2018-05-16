import Modal from '../mixin/modal';
import {$, addClass, css, hasClass, height, isTouch, once, removeClass, trigger, unwrap, width, wrapAll} from 'uikit-util';

let scroll;

export default {

    mixins: [Modal],

    args: 'mode',

    props: {
        content: String,
        mode: String,
        flip: Boolean,
        overlay: Boolean
    },

    data: {
        content: '.uk-offcanvas-content',
        mode: 'slide',
        flip: false,
        overlay: false,
        clsPage: 'uk-offcanvas-page',
        clsContainer: 'uk-offcanvas-container',
        selPanel: '.uk-offcanvas-bar',
        clsFlip: 'uk-offcanvas-flip',
        clsContent: 'uk-offcanvas-content',
        clsContentAnimation: 'uk-offcanvas-content-animation',
        clsSidebarAnimation: 'uk-offcanvas-bar-animation',
        clsMode: 'uk-offcanvas',
        clsOverlay: 'uk-offcanvas-overlay',
        selClose: '.uk-offcanvas-close'
    },

    computed: {

        content({content}) {
            return $(content) || document.body;
        },

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

        clsContentAnimation({mode, clsContentAnimation}) {
            return mode !== 'push' && mode !== 'reveal' ? '' : clsContentAnimation;
        },

        transitionElement({mode}) {
            return mode === 'reveal' ? this.panel.parentNode : this.panel;
        }

    },

    update: {

        write() {

            if (this.getActive() === this) {

                if (this.overlay || this.clsContentAnimation) {
                    width(this.content, width(window) - this.scrollbarWidth);
                }

                if (this.overlay) {
                    height(this.content, height(window));
                    if (scroll) {
                        this.content.scrollTop = scroll.y;
                    }
                }

            }

        },

        events: ['resize']

    },

    events: [

        {

            name: 'click',

            delegate() {
                return 'a[href^="#"]';
            },

            handler({current}) {
                if (current.hash && $(current.hash, this.content)) {
                    scroll = null;
                    this.hide();
                }
            }

        },

        {

            name: 'beforescroll',

            filter() {
                return this.overlay;
            },

            handler(e, scroll, target) {
                if (scroll && target && this.isToggled() && $(target, this.content)) {
                    once(this.$el, 'hidden', () => scroll.scrollTo(target));
                    e.preventDefault();
                }
            }

        },

        {
            name: 'show',

            self: true,

            handler() {

                scroll = scroll || {x: window.pageXOffset, y: window.pageYOffset};

                if (this.mode === 'reveal' && !hasClass(this.panel, this.clsMode)) {
                    wrapAll(this.panel, '<div>');
                    addClass(this.panel.parentNode, this.clsMode);
                }

                css(document.documentElement, 'overflowY', (!this.clsContentAnimation || this.flip) && this.scrollbarWidth && this.overlay ? 'scroll' : '');
                addClass(document.body, this.clsContainer, this.clsFlip, this.clsOverlay);
                height(document.body); // force reflow
                addClass(this.content, this.clsContentAnimation);
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
                removeClass(this.content, this.clsContentAnimation);

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

                if (!this.overlay) {
                    scroll = {x: window.pageXOffset, y: window.pageYOffset};
                } else if (!scroll) {
                    const {scrollLeft: x, scrollTop: y} = this.content;
                    scroll = {x, y};
                }

                removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
                removeClass(this.$el, this.clsOverlay);
                css(this.$el, 'display', '');
                removeClass(document.body, this.clsContainer, this.clsFlip, this.clsOverlay);
                document.body.scrollTop = scroll.y;

                css(document.documentElement, 'overflowY', '');

                width(this.content, '');
                height(this.content, '');

                window.scroll(scroll.x, scroll.y);

                scroll = null;

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
