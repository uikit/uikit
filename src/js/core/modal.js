import $ from 'jquery';
import {extend, isFunction, isString, toJQuery} from '../util/index';

export default function (UIkit) {

    UIkit.component('modal', {

        mixins: [UIkit.mixin.modal],

        props: {
            center: Boolean
        },

        defaults: {
            center: false,
            clsPage: 'uk-modal-page',
            clsPanel: 'uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full',
            clsOverflow: 'uk-overflow-container'
        },

        update: {

            handler() {

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

        events: {

            beforeshow(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                this.page.addClass(this.clsPage);
                this.$el.css('display', 'block');
                this.$el.height();
            },

            hide(e) {

                if (!this.$el.is(e.target)) {
                    return;
                }

                if (!this.getActive()) {
                    this.page.removeClass(this.clsPage);
                }

                this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
            }

        }

    });

    UIkit.component('overflow-auto', {

        ready() {
            this.panel = toJQuery(this.$el.closest('.uk-modal-dialog'));
            this.$el.css('min-height', 150);
        },

        update: {

            handler() {
                var current = this.$el.css('max-height');
                this.$el.css('max-height', '').css('max-height', this.$el.height() - (this.panel.outerHeight(true) - window.innerHeight));
                if (current !== this.$el.css('max-height')) {
                    UIkit.update();
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

    UIkit.modal.dialog = function (content, options) {

        var dialog = UIkit.modal($(
            `<div class="uk-modal">
                <div class="uk-modal-dialog">
                </div>
             </div>`
        ).appendTo('body'), options)[0];

        dialog.$el.on('hide', () => dialog.$destroy(true));
        dialog.panel.append(content);
        dialog.show();

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        var deferred = $.Deferred();

        UIkit.modal.dialog(`
            <div class="uk-modal-body">${isString(message) ? message : $(message).html()}</div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-primary uk-modal-close">${options.labels.ok}</button>
            </div>
        `, options).$el
            .on('hide', () => deferred.resolve())
            .find('button:first').focus();

        return deferred.promise();
    };

    UIkit.modal.confirm = function (message, options) {

        options = extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        var deferred = $.Deferred();

        UIkit.modal.dialog(`
            <div class="uk-modal-body">${isString(message) ? message : $(message).html()}</div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close">${options.labels.cancel}</button>
                <button class="uk-button uk-button-primary uk-modal-close">${options.labels.ok}</button>
            </div>
        `, options).$el
            .on('click', '.uk-modal-footer button', e => deferred[$(e.target).index() === 0 ? 'reject' : 'resolve']())
            .find('button:last').focus();

        return deferred.promise();
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = extend({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        var deferred = $.Deferred(),
            prompt = UIkit.modal.dialog(`
                <form class="uk-form-stacked">
                    <div class="uk-modal-body">
                        <label>${isString(message) ? message : $(message).html()}</label>
                        <input class="uk-input uk-width-1-1" type="text" autofocus>
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
                deferred.resolve(input.val());
                prompt.hide()
            })
            .on('hide', () => {
                if (deferred.state() === 'pending') {
                    deferred.resolve(null);
                }
            });

        return deferred.promise();
    };

    UIkit.modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    }

}
