import $ from 'jquery';
import {isWithin, toJQuery, transitionend} from '../util/index';

export default function (UIkit) {

    var active = false;

    UIkit.component('offcanvas', {

        props: {
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            mode: 'overlay',
            flip: false,
            overlay: false,
            clsActive: 'uk-active',
            clsInactive: 'uk-inactive',
            clsPage: 'uk-offcanvas-page',
            clsSidebar: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsPageAnimation: 'uk-offcanvas-page-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            clsClose: 'uk-offcanvas-close'
        },

        ready() {
            this.page = $('html');
            this.body = $('body');
            this.sidebar = toJQuery(`.${this.clsSidebar}`, this.$el);
            this.clsFlip = this.flip ? this.clsFlip : '';
            this.clsOverlay = this.overlay ? this.clsOverlay : '';
            this.clsMode = `${this.clsMode}-${this.mode}`;

            if (!this.sidebar) {
                return;
            }

            if (this.mode === 'noeffect' || this.mode === 'reveal') {
                this.clsSidebarAnimation = '';
            }

            if (this.mode !== 'push' && this.mode !== 'reveal') {
                this.clsPageAnimation = '';
            }

            this.body.on('click', (e) => {
                if (active === this && !e.isDefaultPrevented() && !isWithin(e.target, this.sidebar)) {
                    this.hide();
                }
            });
        },

        update: {

            handler() {

                if (active === this) {
                    this.page.width(window.innerWidth - this.scrollbarWidth);
                }

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            isActive() {
                return this.$el.hasClass(this.clsActive);
            },
            
            doToggle() {
                this[this.isActive() ? 'hide' : 'show']();
            },

            show() {

                if (this.isActive()) {
                    return;
                }

                if (active && active !== this) {
                    active.hide(null, false);
                }

                active = this;
                
                this.scrollbarWidth = window.innerWidth - this.page.width();

                if (this.scrollbarWidth && this.overlay) {
                    this.body.css('overflow-y', 'scroll');
                    this.scrollbarWidth = 0;
                }

                this.page.width(window.innerWidth - this.scrollbarWidth).addClass(`${this.clsPage} ${this.clsFlip} ${this.clsPageAnimation} ${this.clsOverlay}`);
                this.sidebar.addClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                this.$el.css('display', 'block').height();
                this.$el.addClass(this.clsActive);

                this.$update(null, this.$el);
            },

            hide(toggle, animate) {

                if (!this.isActive()) {
                    return;
                }

                active = false;
                
                this.sidebar.one(transitionend, () => {
                    this.page.removeClass(`${this.clsPage} ${this.clsFlip} ${this.clsOverlay}`).width('');
                    this.sidebar.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.$el.css('display', '');
                    this.body.css('overflow-y', '');
                });

                if (this.mode === 'noeffect' || animate === false) {
                    this.sidebar.trigger(transitionend);
                }

                this.$el.removeClass(this.clsActive);
                this.page.removeClass(this.clsPageAnimation).css('margin-left', '');
            }

        }

    });

}
