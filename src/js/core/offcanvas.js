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
            mode: 'overlay',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsPanel: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsPageAnimation: 'uk-offcanvas-page-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            clsClose: 'uk-offcanvas-close'
        },

        ready() {
            this.clsFlip = this.flip ? this.clsFlip : '';
            this.clsOverlay = this.overlay ? this.clsOverlay : '';
            this.clsMode = `${this.clsMode}-${this.mode}`;

            if (this.mode === 'noeffect' || this.mode === 'reveal') {
                this.clsSidebarAnimation = '';
            }

            if (this.mode !== 'push' && this.mode !== 'reveal') {
                this.clsPageAnimation = '';
            }

            this.$el.on('beforeshow', () => {

                this.scrollbarWidth = window.innerWidth - this.page.width();

                if (this.scrollbarWidth && this.overlay) {
                    this.body.css('overflow-y', 'scroll');
                    this.scrollbarWidth = 0;
                }

                this.page.width(window.innerWidth - this.scrollbarWidth).addClass(`${this.clsPage} ${this.clsFlip} ${this.clsPageAnimation} ${this.clsOverlay}`);
                this.panel.addClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                this.$el.css('display', 'block').height();

            });

            this.$el.on('beforehide', () => {

                this.panel.one(transitionend, () => {
                    this.page.removeClass(`${this.clsPage} ${this.clsFlip} ${this.clsOverlay}`).width('');
                    this.panel.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.css('display', '');
                    this.body.css('overflow-y', '');
                });

                if (this.mode === 'noeffect' || this.getActive() && this.getActive() !== this) {
                    this.panel.trigger(transitionend);
                }

                this.page.removeClass(this.clsPageAnimation).css('margin-left', '');

            });

        },

        update: {

            handler() {

                if (this.isActive()) {
                    this.page.width(window.innerWidth - this.scrollbarWidth);
                }

            },

            events: ['resize', 'orientationchange']

        }

    });

}
