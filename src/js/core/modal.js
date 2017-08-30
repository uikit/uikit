import { Class, Modal } from '../mixin/index';
import { $, assign, height, isString, on, promise, trigger } from '../util/index';

export default function (UIkit) {

    UIkit.component('modal', {

        mixins: [Modal],

        defaults: {
            clsPage: 'uk-modal-page',
            clsPanel: 'uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full'
        },

        events: [

            {
                name: 'show',

                self: true,

                handler() {

                    if (this.$hasClass(this.panel, 'uk-margin-auto-vertical')) {
                        this.$addClass('uk-flex');
                    } else {
                        this.$el.css('display', 'block');
                    }

                    height(this.$el); // force reflow
                }
            },

            {
                name: 'hidden',

                self: true,

                handler() {

                    this.$el.css('display', '');
                    this.$removeClass('uk-flex');

                }
            }

        ]

    });

    UIkit.component('overflow-auto', {

        mixins: [Class],

        computed: {

            modal() {
                return this.$el.closest('.uk-modal');
            },

            panel() {
                return this.$el.closest('.uk-modal-dialog');
            }

        },

        connected() {
            this.$el.css('min-height', 150);
        },

        update: {

            write() {
                var current = this.$el.css('max-height');

                this.$el.css('max-height', 150).css('max-height', Math.max(150, 150 + height(this.modal) - this.panel[0].offsetHeight));
                if (current !== this.$el.css('max-height')) {
                    trigger(this.$el, 'resize');
                }
            },

            events: ['load', 'resize']

        }

    });

    UIkit.modal.dialog = function (content, options) {

        var dialog = UIkit.modal(`
            <div class="uk-modal">
                <div class="uk-modal-dialog">${content}</div>
             </div>
        `, options);

        on(dialog.$el, 'hidden', ({target, current}) => {
            if (target === current) {
                dialog.$destroy(true);
            }
        });
        dialog.show();

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(
            resolve => on(UIkit.modal.dialog(`
                <div class="uk-modal-body">${isString(message) ? message : $(message).html()}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el, 'hide', resolve)
        );
    };

    UIkit.modal.confirm = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(
            (resolve, reject) => on(UIkit.modal.dialog(`
                <div class="uk-modal-body">${isString(message) ? message : $(message).html()}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close">${options.labels.cancel}</button>
                    <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el, 'click', '.uk-modal-footer button', ({target}) => $(target).index() === 0 ? reject() : resolve())
        );
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(resolve => {

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

            on(prompt.$el, 'submit', 'form', e => {
                e.preventDefault();
                resolve(input.val());
                resolved = true;
                prompt.hide()
            });
            on(prompt.$el, 'hide', () => {
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
