import { Class, Modal } from '../mixin/index';
import { $, addClass, assign, closest, css, hasClass, height, html, index, isString, on, Promise, removeClass, trigger } from '../util/index';

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

                    if (hasClass(this.panel, 'uk-margin-auto-vertical')) {
                        addClass(this.$el, 'uk-flex');
                    } else {
                        css(this.$el, 'display', 'block');
                    }

                    height(this.$el); // force reflow
                }
            },

            {
                name: 'hidden',

                self: true,

                handler() {

                    css(this.$el, 'display', '');
                    removeClass(this.$el, 'uk-flex');

                }
            }

        ]

    });

    UIkit.component('overflow-auto', {

        mixins: [Class],

        computed: {

            modal(_, $el) {
                return closest($el, '.uk-modal');
            },

            panel(_, $el) {
                return closest($el, '.uk-modal-dialog');
            }

        },

        connected() {
            css(this.$el, 'minHeight', 150);
        },

        update: {

            write() {

                if (!this.panel || !this.modal) {
                    return;
                }

                var current = css(this.$el, 'maxHeight');

                css(css(this.$el, 'maxHeight', 150), 'maxHeight', Math.max(150, 150 + height(this.modal) - this.panel.offsetHeight));
                if (current !== css(this.$el, 'maxHeight')) {
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

        on(dialog.$el, 'hidden', ({target, currentTarget}) => {
            if (target === currentTarget) {
                dialog.$destroy(true);
            }
        });
        dialog.show();

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return new Promise(
            resolve => on(UIkit.modal.dialog(`
                <div class="uk-modal-body">${isString(message) ? message : html(message)}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el, 'hide', resolve)
        );
    };

    UIkit.modal.confirm = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return new Promise(
            (resolve, reject) => on(UIkit.modal.dialog(`
                <div class="uk-modal-body">${isString(message) ? message : html(message)}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close">${options.labels.cancel}</button>
                    <button class="uk-button uk-button-primary uk-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el, 'click', '.uk-modal-footer button', ({target}) => index(target) === 0 ? reject() : resolve())
        );
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return new Promise(resolve => {

            var resolved = false,
                prompt = UIkit.modal.dialog(`
                    <form class="uk-form-stacked">
                        <div class="uk-modal-body">
                            <label>${isString(message) ? message : html(message)}</label>
                            <input class="uk-input" autofocus>
                        </div>
                        <div class="uk-modal-footer uk-text-right">
                            <button class="uk-button uk-button-default uk-modal-close" type="button">${options.labels.cancel}</button>
                            <button class="uk-button uk-button-primary">${options.labels.ok}</button>
                        </div>
                    </form>
                `, options),
                input = $('input', prompt.$el);

            input.value = value;

            on(prompt.$el, 'submit', 'form', e => {
                e.preventDefault();
                resolve(input.value);
                resolved = true;
                prompt.hide();
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
    };

}
