import { Modal } from '../mixin/index';
import { $, docElement, isTouch, query, transitionend } from '../util/index';

var scroll;

export default function (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [Modal],

        args: 'mode',

        props: {
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            mode: 'slide',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsPanel: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsPageAnimation: 'uk-offcanvas-page-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            clsPageOverlay: 'uk-offcanvas-page-overlay',
            selClose: '.uk-offcanvas-close'
        },

        computed: {

            clsFlip() {
                return this.flip ? this.$props.clsFlip : '';
            },

            clsOverlay() {
                return this.overlay ? this.$props.clsOverlay : '';
            },

            clsPageOverlay() {
                return this.overlay ? this.$props.clsPageOverlay : '';
            },

            clsMode() {
                return `${this.$props.clsMode}-${this.mode}`;
            },

            clsSidebarAnimation() {
                return this.mode === 'none' || this.mode === 'reveal' ? '' : this.$props.clsSidebarAnimation;
            },

            clsPageAnimation() {
                return this.mode !== 'push' && this.mode !== 'reveal' ? '' : this.$props.clsPageAnimation
            },

            transitionElement() {
                return this.mode === 'reveal' ? this.panel.parent() : this.panel;
            }
        },

        update: {

            write() {

                if (this.isToggled()) {

                    if (this.clsPageAnimation || this.overlay) {
                        this.body.width(window.innerWidth - (this.overlay ? this.scrollbarWidth : 0));
                    }

                    if (this.overlay) {
                        this.body.height(window.innerHeight);
                        docElement.css('marginTop', -1 * scroll.y);
                    }

                }

            },

            events: ['resize', 'orientationchange']

        },

        events: [

            {
                name: 'beforeshow',

                self: true,

                handler() {

                    scroll = scroll || {x: window.pageXOffset, y: window.pageYOffset};

                    if (this.mode === 'reveal' && !this.panel.parent().hasClass(this.clsMode)) {
                        this.panel.wrap('<div>').parent().addClass(this.clsMode);
                    }

                    docElement.addClass(`${this.clsFlip} ${this.clsPageAnimation} ${this.clsPageOverlay}`).height();
                    this.panel.addClass(`${this.clsSidebarAnimation} ${this.mode !== 'reveal' ? this.clsMode : ''}`);
                    this.$el.addClass(this.clsOverlay).css('display', 'block').height();

                }
            },

            {
                name: 'beforehide',

                self: true,

                handler() {
                    docElement.removeClass(this.clsPageAnimation);

                    if (this.mode === 'none' || this.getActive() && this.getActive() !== this) {
                        this.panel.trigger(transitionend);
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

                    this.$el.removeClass(this.clsOverlay).css('display', '');
                    this.panel.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.body.width('').height('');
                    docElement.removeClass(`${this.clsFlip} ${this.clsPageOverlay}`).css('marginTop', '');

                    if (this.overlay) {
                        window.scrollTo(scroll.x, scroll.y);
                    }

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
