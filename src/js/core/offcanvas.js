import $ from 'jquery';
import {isWithin, toJQuery, transitionend} from '../util/index';

export default function (UIkit) {

    var active = false;

    UIkit.component('offcanvas', {

        props: {
            mode: String,
            href: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            mode: 'overlay',
            href: false,
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
            clsOverlay: 'uk-offcanvas-overlay'
        },

        ready() {

            this.page = $('html');
            this.body = $('body');
            this.offcanvas = toJQuery(this.href);
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

            this.$el.on('click', e => {
                if (!active) {
                    e.preventDefault();
                    this.toggle()
                }
            });

            this.body.on('click', (e) => {
                if (!e.isDefaultPrevented() && !isWithin(e.target, this.sidebar)) {
                    this.toggle(false);
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

            toggle(show) {

                if (show === false && active !== this) {
                    return;
                }

                show = show === undefined && active !== this || show;

                if (show) {

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

                } else {

                    this.sidebar.one(transitionend, () => {
                        this.page.removeClass(`${this.clsPage} ${this.clsFlip} ${this.clsOverlay}`).width('');
                        this.sidebar.removeClass(`${this.clsSidebarAnimation} ${this.clsMode}`);
                        this.offcanvas.css('display', '');
                        this.body.css('overflow-y', '');

                        active = false;
                    });

                    if (this.mode === 'noeffect') {
                        this.sidebar.trigger(transitionend);
                    }

                    this.offcanvas.removeClass(this.clsActive);
                    this.page.removeClass(this.clsPageAnimation).css('margin-left', '');

                }

            }

        }

    });

}
