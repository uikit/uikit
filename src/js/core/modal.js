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
            this.modal = this.target || this.href;
            this.dialog = toJQuery(`.${this.clsDialog}`, this.modal);

            if (!this.modal || !this.dialog) {
                return;
            }

            this.$el.on('click', e => {
                e.preventDefault();
                this.toggle()
            });

            this.modal.on('click', `.${this.clsClose}`, (e) => {
                e.preventDefault();
                this.toggle(false);
            });

            this.body.on('click', (e) => {
                if (!e.isDefaultPrevented() && !isWithin(e.target, this.dialog)) {
                    this.toggle(false);
                }
            });

        },

        update: {

            handler() {

                if (active === this && this.center) {
                    this.modal.removeClass('uk-flex uk-flex-center').css('display', 'block');
                    this.modal.toggleClass('uk-flex-middle', window.innerHeight > this.dialog.outerHeight(true));
                    this.modal.addClass('uk-flex uk-flex-center').css('display', '');
                }

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            isActive() {
                return this.modal.hasClass(this.clsActive);
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

                this.page.addClass(this.clsPage);
                this.modal.css('display', 'block');
                this._callUpdate();
                this.modal.height();
                this.modal.addClass(this.clsActive);

                this.$update(null, this.modal);
            },

            hide() {

                if (!this.isActive()) {
                    return;
                }

                active = false;

                this.dialog.one(transitionend, () => {
                    this.page.removeClass(this.clsPage);
                    this.modal.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
                });

                this.modal.removeClass(this.clsActive);
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
                this.$el.css('max-height', '').css('max-height', this.$el.height() - (this.dialog.outerHeight(true) - window.innerHeight))
                if (current !== this.$el.css('max-height')) {
                    UIkit.update();
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
