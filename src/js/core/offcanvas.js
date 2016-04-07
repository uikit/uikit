import {transitionend} from '../util/index';

export default function (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [UIkit.mixin.modal],

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

        ready() {

            this.clsFlip = this.flip ? this.clsFlip : '';
            this.clsOverlay = this.overlay ? this.clsOverlay : '';
            this.clsPageOverlay = this.overlay ? this.clsPageOverlay : '';
            this.clsMode = `${this.clsMode}-${this.mode}`;

            if (this.mode === 'noeffect' || this.mode === 'reveal') {
                this.clsSidebarAnimation = '';
            }

            if (this.mode !== 'push' && this.mode !== 'reveal') {
                this.clsPageAnimation = '';
            }

        },

        update: {

            handler() {

                if (this.isActive()) {
                    this.page.width(window.innerWidth - this.getScrollbarWidth());
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            beforeshow() {

                this.page.addClass(`${this.clsPage} ${this.clsFlip} ${this.clsPageAnimation} ${this.clsPageOverlay}`);
                this.panel.addClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                this.$el.addClass(this.clsOverlay).css('display', 'block').height();

            },

            beforehide() {

                this.panel.one(transitionend, () => {
                    this.page.removeClass(`${this.clsPage} ${this.clsFlip} ${this.clsPageOverlay}`).width('');
                    this.panel.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.removeClass(this.clsOverlay).css('display', '');
                });

                this.page.removeClass(this.clsPageAnimation).css('margin-left', '');

                if (this.mode === 'noeffect' || this.getActive() && this.getActive() !== this) {
                    this.panel.trigger(transitionend);
                }

            }

        }

    });

}
