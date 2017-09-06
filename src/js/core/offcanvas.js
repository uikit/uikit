import { Modal } from '../mixin/index';
import { $, addClass, css, docEl, hasClass, height, isTouch, one, query, removeClass, transitionend, trigger, width, win } from '../util/index';

var scroll;

export default function (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [Modal],

        args: 'mode',

        props: {
            content: String,
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            content: '.uk-offcanvas-content:first',
            mode: 'slide',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsContainer: 'uk-offcanvas-container',
            clsPanel: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsContent: 'uk-offcanvas-content',
            clsContentAnimation: 'uk-offcanvas-content-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            selClose: '.uk-offcanvas-close'
        },

        computed: {

            content() {
                return $(query(this.$props.content, this.$el));
            },

            clsFlip() {
                return this.flip ? this.$props.clsFlip : '';
            },

            clsOverlay() {
                return this.overlay ? this.$props.clsOverlay : '';
            },

            clsMode() {
                return `${this.$props.clsMode}-${this.mode}`;
            },

            clsSidebarAnimation() {
                return this.mode === 'none' || this.mode === 'reveal' ? '' : this.$props.clsSidebarAnimation;
            },

            clsContentAnimation() {
                return this.mode !== 'push' && this.mode !== 'reveal' ? '' : this.$props.clsContentAnimation
            },

            transitionElement() {
                return this.mode === 'reveal' ? this.panel.parent() : this.panel;
            }

        },

        update: {

            write() {

                if (this.isToggled()) {

                    if (this.overlay || this.clsContentAnimation) {
                        width(this.content, width(win) - this.scrollbarWidth);
                    }

                    if (this.overlay) {
                        height(this.content, height(win));
                        if (scroll) {
                            this.content[0].scrollTop = scroll.y;
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
                    if (current.hash && this.content.find(current.hash).length) {
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
                    if (scroll && target && this.isToggled() && this.content.find(target).length) {
                        one(this.$el, 'hidden', () => scroll.scrollTo(target));
                        e.preventDefault();
                    }
                }

            },

            {
                name: 'show',

                self: true,

                handler() {

                    scroll = scroll || {x: win.pageXOffset, y: win.pageYOffset};

                    if (this.mode === 'reveal' && !hasClass(this.panel, this.clsMode)) {
                        this.panel.wrap('<div>');
                        addClass(this.panel.parent(), this.clsMode);
                    }

                    css(docEl, 'overflowY', (!this.clsContentAnimation || this.flip) && this.scrollbarWidth && this.overlay ? 'scroll' : '');
                    addClass(this.body, `${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`);
                    height(this.body); // force reflow
                    addClass(this.content, this.clsContentAnimation);
                    addClass(this.panel, `${this.clsSidebarAnimation} ${this.mode !== 'reveal' ? this.clsMode : ''}`);
                    addClass(this.clsOverlay);
                    css(this.$el, 'display', 'block');
                    height(this.$el); // force reflow

                }
            },

            {
                name: 'hide',

                self: true,

                handler() {
                    removeClass(this.content, this.clsContentAnimation);

                    if (this.mode === 'none' || this.getActive() && this.getActive() !== this) {
                        trigger(this.panel, transitionend);
                    }
                }
            },

            {
                name: 'hidden',

                self: true,

                handler() {

                    if (this.mode === 'reveal') {
                        this.panel.unwrap();
                    }

                    if (!this.overlay) {
                        scroll = {x: win.pageXOffset, y: win.pageYOffset}
                    } else if (!scroll) {
                        var {scrollLeft: x, scrollTop: y} = this.content[0];
                        scroll = {x, y};
                    }

                    removeClass(this.panel, `${this.clsSidebarAnimation} ${this.clsMode}`);
                    removeClass(this.$el, this.clsOverlay);
                    css(this.$el, 'display', '');
                    removeClass(this.body, `${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`);
                    this.body[0].scrollTop = scroll.y;

                    css(docEl, 'overflow-y', '');

                    width(this.content, '');
                    height(this.content, '');

                    win.scrollTo(scroll.x, scroll.y);

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

    });

}
