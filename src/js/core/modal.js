import {toJQuery, transitionend} from '../util/index';

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
                    this.$el.removeClass('uk-flex uk-flex-center uk-flex-middle').css('display', 'block');
                    this.$el.toggleClass('uk-flex-middle', window.innerHeight > this.panel.outerHeight(true));
                    this.$el.addClass('uk-flex uk-flex-center').css('display', '');
                }

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            beforeshow() {

                this.page.addClass(this.clsPage);
                this.$el.css('display', 'block');
                this.$el.height();

            },

            beforehide() {

                this.panel.one(transitionend, () => {
                    this.page.removeClass(this.clsPage);
                    this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
                });

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

}
