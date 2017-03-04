import { Class, Modal } from '../mixin/index';
import { $, extend, isFunction, isString, promise, query, toJQuery } from '../util/index';

export default function (UIkit) {

    UIkit.component('modal', {

        mixins: [Modal],

        props: {
            center: Boolean,
            container: Boolean
        },

        defaults: {
            center: false,
            clsPage: 'uk-modal-page',
            clsPanel: 'uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full',
            container: true
        },

        init() {

            this.container = this.container === true && UIkit.container || this.container && toJQuery(this.container);

            if (this.container && !this.$el.parent().is(this.container)) {
                this.$el.appendTo(this.container);
            }

        },

        update: {

            write() {

                if (this.$el.css('display') === 'block' && this.center) {
                    this.$el
                        .removeClass('uk-flex uk-flex-center uk-flex-middle')
                        .css('display', 'block')
                        .toggleClass('uk-flex uk-flex-center uk-flex-middle', window.innerHeight > this.panel.outerHeight(true))
                        .css('display', this.$el.hasClass('uk-flex') ? '' : 'block');
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: [

            {
                name: 'beforeshow',

                self: true,

                handler() {
                    this.$el.css('display', 'block').height();
                }
            },

            {
                name: 'hide',

                self: true,

                handler() {
                    this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
                }
            }

        ]

    });

    UIkit.component('overflow-auto', {

        mixins: [Class],

        ready() {
            this.panel = query('!.uk-modal-dialog', this.$el);
            this.$el.css('min-height', 150);
        },

        update: {

            write() {
                var current = this.$el.css('max-height');
                this.$el.css('max-height', 150).css('max-height', Math.max(150, 150 - (this.panel.outerHeight(true) - window.innerHeight)));
                if (current !== this.$el.css('max-height')) {
                    this.$el.trigger('resize');
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

    UIkit.modal.dialog = function (content, options) {

        var dialog = UIkit.modal(
            `<div class="uk-modal">
                <div class="uk-modal-dialog">${content}</div>
             </div>`
        , options);

        dialog.$el.on('hide', () => dialog.$destroy(true));
        dialog.show();

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(
            resolve => UIkit.modal.dialog(`
                <div class="uk-modal-body">${isString(message) ? message : $(message).html()}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el.on('hide', resolve)
        );
    };

    UIkit.modal.confirm = function (message, options) {

        options = extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(
            (resolve, reject) => UIkit.modal.dialog(`
                <div class="uk-modal-body">${isString(message) ? message : $(message).html()}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close">${options.labels.cancel}</button>
                    <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el.on('click', '.uk-modal-footer button', e => $(e.target).index() === 0 ? reject() : resolve())
        );
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise((resolve, reject) => {

            var resolved = false,
                prompt = UIkit.modal.dialog(`
                <form class="uk-form-stacked">
                    <div class="uk-modal-body">
                        <label>${isString(message) ? message : $(message).html()}</label>
                        <input class="uk-input" type="text" autofocus>
                    </div>
                    <div class="uk-modal-footer uk-text-right">
                        <button class="uk-button uk-button-default uk-modal-close" type="button">${options.labels.cancel}</button>
                        <button class="uk-button uk-button-primary" type="submit">${options.labels.ok}</button>
                    </div>
                </form>
            `, options),
                input = prompt.$el.find('input').val(value);

            prompt.$el
                .on('submit', 'form', e => {
                    e.preventDefault();
                    resolve(input.val());
                    resolved = true;
                    prompt.hide()
                })
                .on('hide', () => {
                    if (!resolved) {
                        resolve(null);
                    }
                });

        });
    };

    UIkit.modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    }

}
