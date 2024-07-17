import {
    $,
    addClass,
    assign,
    css,
    hasClass,
    height,
    html,
    isString,
    isTag,
    noop,
    on,
    removeClass,
} from 'uikit-util';
import Modal from '../mixin/modal';

export default {
    install,

    mixins: [Modal],

    data: {
        clsPage: 'uk-modal-page',
        selPanel: '.uk-modal-dialog',
        selClose: '[class*="uk-modal-close"]',
    },

    events: [
        {
            name: 'fullscreenchange webkitendfullscreen',

            capture: true,

            handler(e) {
                if (isTag(e.target, 'video') && this.isToggled() && !document.fullscreenElement) {
                    this.hide();
                }
            },
        },

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
            },
        },

        {
            name: 'hidden',

            self: true,

            handler() {
                css(this.$el, 'display', '');
                removeClass(this.$el, 'uk-flex');
            },
        },
    ],
};

function install({ modal }) {
    modal.dialog = function (content, options) {
        const dialog = modal($(`<div><div class="uk-modal-dialog">${content}</div></div>`), {
            stack: true,
            role: 'alertdialog',
            ...options,
        });

        dialog.show();

        on(
            dialog.$el,
            'hidden',
            async () => {
                await Promise.resolve();
                dialog.$destroy(true);
            },
            { self: true },
        );

        return dialog;
    };

    modal.alert = function (message, options) {
        return openDialog(
            ({ i18n }) => `<div class="uk-modal-body">${
                isString(message) ? message : html(message)
            }</div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-primary uk-modal-close" autofocus>${
                    i18n.ok
                }</button>
            </div>`,
            options,
        );
    };

    modal.confirm = function (message, options) {
        return openDialog(
            ({ i18n }) => `<form>
                <div class="uk-modal-body">${isString(message) ? message : html(message)}</div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">${
                        i18n.cancel
                    }</button>
                    <button class="uk-button uk-button-primary" autofocus>${i18n.ok}</button>
                </div>
            </form>`,
            options,
            () => Promise.reject(),
        );
    };

    modal.prompt = function (message, value, options) {
        const promise = openDialog(
            ({ i18n }) => `<form class="uk-form-stacked">
                <div class="uk-modal-body">
                    <label>${isString(message) ? message : html(message)}</label>
                    <input class="uk-input" autofocus>
                </div>
                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">${
                        i18n.cancel
                    }</button>
                    <button class="uk-button uk-button-primary">${i18n.ok}</button>
                </div>
            </form>`,
            options,
            () => null,
            () => input.value,
        );

        const { $el } = promise.dialog;
        const input = $('input', $el);
        input.value = value || '';
        on($el, 'show', () => input.select());

        return promise;
    };

    modal.i18n = {
        ok: 'Ok',
        cancel: 'Cancel',
    };

    function openDialog(tmpl, options, hideFn = noop, submitFn = noop) {
        options = {
            bgClose: false,
            escClose: true,
            ...options,
            i18n: { ...modal.i18n, ...options?.i18n },
        };

        const dialog = modal.dialog(tmpl(options), options);

        return assign(
            new Promise((resolve) => {
                const off = on(dialog.$el, 'hide', () => resolve(hideFn()));

                on(dialog.$el, 'submit', 'form', (e) => {
                    e.preventDefault();
                    resolve(submitFn(dialog));
                    off();
                    dialog.hide();
                });
            }),
            { dialog },
        );
    }
}
