import $ from 'jquery';
import {isWithin, toJQuery, transitionend} from '../util/index';

export default function (UIkit) {

    var active = false;

    UIkit.component('modal', {

        props: {
            href: 'jQuery',
            target: 'jQuery',
            center: Boolean
        },

        defaults: {
            href: false,
            target: false,
            center: false,
            clsPage: 'uk-modal-page',
            clsDialog: 'uk-modal-dialog',
            clsActive: 'uk-open',
            clsClose: 'uk-modal-close',
            clsOverflow: 'uk-overflow-container'
        },

        ready() {

            this.page = $('html');
            this.body = $('body');
            this.dialog = toJQuery(`.${this.clsDialog}`, this.$el);

            if (!this.dialog) {
                return;
            }

            this.$el.on('click', `.${this.clsClose}`, (e) => {
                e.preventDefault();
                this.hide();
            });

            this.body.on('click', (e) => {
                if (!e.isDefaultPrevented() && !isWithin(e.target, this.dialog)) {
                    this.hide();
                }
            });

        },

        update: {

            handler() {

                if (active === this && this.center) {
                    this.$el.removeClass('uk-flex uk-flex-center').css('display', 'block');
                    this.$el.toggleClass('uk-flex-middle', window.innerHeight > this.dialog.outerHeight(true));
                    this.$el.addClass('uk-flex uk-flex-center').css('display', '');
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
                    active.hide();
                }

                active = this;

                this.page.addClass(this.clsPage);
                this.$el.css('display', 'block');
                this._callUpdate();
                this.$el.height();
                this.$el.addClass(this.clsActive);

                this.$update();
            },

            hide() {

                if (!this.isActive()) {
                    return;
                }

                active = false;

                this.dialog.one(transitionend, () => {
                    this.page.removeClass(this.clsPage);
                    this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
                });

                this.$el.removeClass(this.clsActive);
            }

        }

    });

    UIkit.component('overflow-auto', {

        ready() {
            this.dialog = toJQuery(this.$el.closest('.uk-modal-dialog'));
            this.$el.css('min-height', 150);
        },

        update: {

            handler() {
                var current = this.$el.css('max-height');
                this.$el.css('max-height', '').css('max-height', this.$el.height() - (this.dialog.outerHeight(true) - window.innerHeight));
                if (current !== this.$el.css('max-height')) {
                    UIkit.update();
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
