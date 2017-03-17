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
            }

        },

        update: {

            write() {

                if (this.isActive()) {
                    docElement.width(window.innerWidth - this.scrollbarWidth);
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: [

            {
                name: 'beforeshow',

                self: true,

                handler() {
                    docElement.addClass(`${this.clsFlip} ${this.clsPageAnimation} ${this.clsPageOverlay}`);
                    this.panel.addClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
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
                    docElement.removeClass(`${this.clsFlip} ${this.clsPageOverlay}`).width('');
                    this.panel.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.removeClass(this.clsOverlay).css('display', '');
                }
            }

        ]

    });

}
