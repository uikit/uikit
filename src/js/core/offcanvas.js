import { Modal } from '../mixin/index';
import { $, docEl, height, isTouch, one, query, transitionend, trigger, width, win } from '../util/index';

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
                        scroll && this.content.scrollTop(scroll.y);
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

                    if (this.mode === 'reveal' && !this.$hasClass(this.panel, this.clsMode)) {
                        this.panel.wrap('<div>');
                        this.$addClass(this.panel.parent(), this.clsMode);
                    }

                    $(docEl).css('overflow-y', (!this.clsContentAnimation || this.flip) && this.scrollbarWidth && this.overlay ? 'scroll' : '');

                    this.$addClass(this.body, `${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`);
                    height(this.body); // force reflow
                    this.$addClass(this.content, this.clsContentAnimation);
                    this.$addClass(this.panel, `${this.clsSidebarAnimation} ${this.mode !== 'reveal' ? this.clsMode : ''}`);
                    this.$addClass(this.clsOverlay);
                    this.$el.css('display', 'block');
                    height(this.$el); // force reflow

                }
            },

            {
                name: 'hide',

                self: true,

                handler() {
                    this.$removeClass(this.content, this.clsContentAnimation);

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

                    this.$removeClass(this.panel, `${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$removeClass(this.clsOverlay);
                    this.$el.css('display', '');
                    this.$removeClass(this.body, `${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`);
                    this.body.scrollTop(scroll.y); // TODO ?

                    $(docEl).css('overflow-y', '');

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
