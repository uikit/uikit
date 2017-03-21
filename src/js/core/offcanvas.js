import { Modal } from '../mixin/index';
import { docElement, query, transitionend } from '../util/index';

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
            content: 'body > div:first',
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
                return query(this.$props.content, this.$el);
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

                if (this.isActive()) {
                    this.content.width(window.innerWidth - this.scrollbarWidth);
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: [

            {
                name: 'beforeshow',

                self: true,

                handler() {

                    if (this.mode === 'reveal' && !this.panel.parent().hasClass(this.clsMode)) {
                        this.panel.wrap('<div>').parent().addClass(this.clsMode);
                    }

                    this.scroll = {x: window.pageXOffset, y: window.pageYOffset};

                    this.body.addClass(`${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`);
                    this.content.addClass(`${this.clsContent} ${this.clsContentAnimation}`)/*.css('marginTop', -1 * this.scroll.y)*/;
                    this.panel.addClass(`${this.clsSidebarAnimation} ${this.mode !== 'reveal' ? this.clsMode : ''}`);
                    this.$el.addClass(this.clsOverlay).css('display', 'block');

                    this.content[0].scrollTop = this.scroll.y;
                    this.content.on(`scroll.${this._uid}`, () => this.scroll = {x: this.content[0].scrollLeft, y: this.content[0].scrollTop})
                }
            },

            {
                name: 'beforehide',

                self: true,

                handler() {
                    this.content.removeClass(this.clsContentAnimation);

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

                    this.body.removeClass(`${this.clsContainer} ${this.clsFlip} ${this.clsOverlay}`).scrollTop(this.scroll.y);
                    this.content.removeClass(this.clsContent).off(`scroll.${this._uid}`);
                    this.panel.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.removeClass(this.clsOverlay).css('display', '');
                    window.scrollTo(this.scroll.x, this.scroll.y);

                    if (!this.getActive()) {
                        this.content.width('');
                    }

                }
            }

        ]

    });

}
