import Modal from '../mixin/modal';
import {$, addClass, assign, css, Deferred, hasClass, height, html, isString, on, Promise, removeClass} from 'uikit-util';

export default {

    install,

    mixins: [Modal],

    data: {
        clsPage: 'uk-modal-page',
        selPanel: '.uk-modal-dialog',
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

};

function install({modal}) {

    modal.dialog = function (content, options) {

        const dialog = modal(
            `<div class="uk-modal">
                <div class="uk-modal-dialog">${content}</div>
             </div>`,
            options
        );

        dialog.show();

        on(dialog.$el, 'hidden', () =>
            Promise.resolve().then(() =>
                dialog.$destroy(true)
            ), {self: true}
        );

        return dialog;
    };

    modal.alert = function (message, options) {
        return openDialog(
            ({labels}) => `<div class="uk-modal-body">${isString(message) ? message : html(message)}</div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-primary uk-modal-close" autofocus>${labels.ok}</button>
            </div>`,
            options,
            deferred => deferred.resolve()
        );
    };

    modal.confirm = function (message, options) {
        return openDialog(
            ({labels}) => `<form>
                <div class="uk-modal-body">${isString(message) ? message : html(message)}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">${labels.cancel}</button>
                    <button class="uk-button uk-button-primary" autofocus>${labels.ok}</button>
                </div>
            </form>`,
            options,
            deferred => deferred.reject()
        );
    };

    modal.prompt = function (message, value, options) {
        return openDialog(
            ({labels}) => `<form class="uk-form-stacked">
                <div class="uk-modal-body">
                    <label>${isString(message) ? message : html(message)}</label>
                    <input class="uk-input" value="${value || ''}" autofocus>
                </div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">${labels.cancel}</button>
                    <button class="uk-button uk-button-primary">${labels.ok}</button>
                </div>
            </form>`,
            options,
            deferred => deferred.resolve(null),
            dialog => $('input', dialog.$el).value
        );
    };

    modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    };

    function openDialog(tmpl, options, hideFn, submitFn) {

        options = assign({bgClose: false, escClose: true, labels: modal.labels}, options);

        const dialog = modal.dialog(tmpl(options), options);
        const deferred = new Deferred();

        let resolved = false;

        on(dialog.$el, 'submit', 'form', e => {
            e.preventDefault();
            deferred.resolve(submitFn && submitFn(dialog));
            resolved = true;
            dialog.hide();
        });

        on(dialog.$el, 'hide', () => !resolved && hideFn(deferred));

        deferred.promise.dialog = dialog;

        return deferred.promise;
    }

}
