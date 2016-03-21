import $ from 'jquery';
import {isWithin, toJQuery, transitionend} from '../util/index';

export default function (UIkit) {

    var active = false;

    UIkit.component('offcanvas', {

        props: {
            mode: String,
            href: String,
            flip: Boolean
        },

        defaults: {
            mode: 'overlay',
            href: false,
            flip: false,
            clsActive: 'uk-active',
            clsInactive: 'uk-inactive',
            clsPrefix: 'uk-offcanvas',
            clsPage: 'page',
            clsSidebar: 'bar',
            clsAnimation: 'animation'
        },

        ready() {

            this.clsPage = `${this.clsPrefix}-${this.clsPage}`;
            this.clsSidebar = `${this.clsPrefix}-${this.clsSidebar}`;
            this.clsMode = `${this.clsPrefix}-${this.mode}`;
            this.clsPageAnimation = `${this.clsPage}-${this.clsAnimation}`;
            this.clsSidebarAnimation = `${this.clsSidebar}-${this.clsAnimation}`;

            this.page = $('html');
            this.body = $('body');
            this.offcanvas = toJQuery(this.href);
            this.sidebar = toJQuery(`.${this.clsSidebar}`, this.offcanvas);

            if (!this.offcanvas || !this.sidebar) {
                return;
            }

            if (this.flip) {
                this.clsSidebar += '-flip';
                this.clsPageAnimation += '-flip';
            }

            if (this.mode === 'noeffect' || this.mode === 'reveal') {
                this.clsSidebarAnimation = '';
            }

            if (this.mode !== 'push' && this.mode !== 'reveal') {
                this.clsPageAnimation = '';
            }

            this.$el.on('click', e => {
                e.preventDefault();
                this.toggle()
            });

            this.offcanvas.on('click', ({target}) => {
                if (!isWithin(target, this.sidebar)) {
                    this.toggle(false);
                }
            });

        },

        methods: {

            toggle(show) {

                if (show === false && active !== this) {
                    return;
                }

                show = show === undefined && !this.sidebar.hasClass(this.clsActive) || show;

                if (show) {

                    active = this;

                    var scrollbarWidth = window.innerWidth - this.page.width();
                    this.page.css('width', (window.innerWidth - scrollbarWidth));

                    this.page.addClass(this.clsPage);
                    this.sidebar.addClass(`${this.clsSidebar} ${this.clsMode}`);
                    this.offcanvas.addClass(this.clsActive);

                    if (this.flip) {
                        this.page.css('margin-left', -this.sidebar.outerWidth() + scrollbarWidth);
                    }

                    // frame needs to be rendered for browser to apply display:none;
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            this.sidebar.addClass(`${this.clsSidebarAnimation} ${this.clsActive}`);
                            this.page.addClass(this.clsPageAnimation);
                        });
                    });

                } else {

                    this.sidebar.one(transitionend, () => {
                        this.page.removeClass(this.clsPage);
                        this.offcanvas.removeClass(this.clsActive);
                        this.page.width('');
                        this.sidebar.removeClass(`${this.clsSidebar} ${this.clsSidebarAnimation} ${this.clsMode}`);
                    });

                    if (this.mode === 'noeffect') {
                        this.sidebar.trigger(transitionend);
                    }

                    this.sidebar.removeClass(this.clsActive);
                    this.page.removeClass(this.clsPageAnimation).css('margin-left', '');

                }

            }

        }

    });

}
