import { Modal } from '../mixin/index';
import { docElement, transitionend } from '../util/index';

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
            clsPage: 'uk-offcanvas-container',
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
            }

        },

        update: {

            write() {

                if (this.isActive()) {
                    this.body.width(window.innerWidth - this.scrollbarWidth);
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: [

            {
                name: 'beforeshow',

                self: true,

                handler() {
                    docElement.addClass(`${this.clsFlip} ${this.clsOverlay}`);
                    this.body.addClass(`${this.clsContent} ${this.clsContentAnimation}`);
                    this.panel.addClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.addClass(this.clsOverlay).css('display', 'block').height();
                }
            },

            {
                name: 'beforehide',

                self: true,

                handler() {
                    this.body.removeClass(this.clsContentAnimation);

                    if (this.mode === 'none' || this.getActive() && this.getActive() !== this) {
                        this.panel.trigger(transitionend);
                    }
                }
            },

            {
                name: 'hidden',

                self: true,

                handler() {
                    docElement.removeClass(`${this.clsFlip} ${this.clsOverlay}`);
                    this.body.removeClass(this.clsContent).width('');
                    this.panel.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.removeClass(this.clsOverlay).css('display', '');
                }
            },

            {
                name: 'show hide',

                self: true,

                filter() {
                    return this.mode === 'reveal';
                },

                handler() {
                    this.panel.children().wrapAll('<div>');
                }

            },

            {
                name: 'shown hidden',

                self: true,

                filter() {
                    return this.mode === 'reveal';
                },

                handler() {
                    this.panel.children().first().children().unwrap();
                }

            }

        ]

    });

}
