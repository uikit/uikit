import $ from 'jquery';
import {isWithin, toJQuery, transitionend} from '../util/index';

export default function (UIkit) {

    var active = false;

    UIkit.component('offcanvas', {

        props: {
            mode: String,
            href: 'jQuery',
            target: 'jQuery',
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            mode: 'overlay',
            href: false,
            target: false,
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

        init() {
            this.page = $('html');
            this.body = $('body');
            this.offcanvas = this.target || this.href;
            this.sidebar = toJQuery(`.${this.clsSidebar}`, this.offcanvas);
            this.clsFlip = this.flip ? this.clsFlip : '';
            this.clsOverlay = this.overlay ? this.clsOverlay : '';
            this.clsMode = `${this.clsMode}-${this.mode}`;

            if (!this.offcanvas || !this.sidebar) {
                return;
            }

            if (this.mode === 'noeffect' || this.mode === 'reveal') {
                this.clsSidebarAnimation = '';
            }

            if (this.mode !== 'push' && this.mode !== 'reveal') {
                this.clsPageAnimation = '';
            }

            this.offcanvas.on('click', `.${this.clsClose}`, (e) => {
                e.preventDefault();
                this.toggle(false);
            });

            this.body.on('click', (e) => {
                if (active === this && !e.isDefaultPrevented() && !isWithin(e.target, this.sidebar)) {
                    this.toggle(false);
                }
            });
        },

        ready() {
            this.$el.on('click', e => {
                if (!active) {
                    e.preventDefault();
                    this.toggle()
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
                return this.offcanvas.hasClass(this.clsActive);
            },
            
            toggle(show) {

                var state = this.isActive();

                show = show === undefined && !state || show;

                if (!show && !state || show && state) {
                    return;
                }

                if (active && active !== this && show) {
                    active.toggle(false);
                }

                this[show ? 'show' : 'hide']();
            },

            show() {

                if (this.isActive()) {
                    return;
                }

                active = this;
                
                this.scrollbarWidth = window.innerWidth - this.page.width();

                if (this.scrollbarWidth && this.overlay) {
                    this.body.css('overflow-y', 'scroll');
                    this.scrollbarWidth = 0;
                }

                this.page.width(window.innerWidth - this.scrollbarWidth).addClass(`${this.clsPage} ${this.clsFlip} ${this.clsPageAnimation} ${this.clsOverlay}`);
                this.sidebar.addClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                this.offcanvas.css('display', 'block').height();
                this.offcanvas.addClass(this.clsActive);

                this.$update(null, this.offcanvas);
            },

            hide() {

                if (!this.isActive()) {
                    return;
                }

                active = false;
                
                this.sidebar.one(transitionend, () => {
                    this.page.removeClass(`${this.clsPage} ${this.clsFlip} ${this.clsOverlay}`).width('');
                    this.sidebar.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                    this.offcanvas.css('display', '');
                    this.body.css('overflow-y', '');
                });

                if (this.mode === 'noeffect') {
                    this.sidebar.trigger(transitionend);
                }

                this.offcanvas.removeClass(this.clsActive);
                this.page.removeClass(this.clsPageAnimation).css('margin-left', '');
            }

        }

    });

}
