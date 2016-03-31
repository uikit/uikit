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
            clsClose: 'uk-modal-close',
            clsOverflow: 'uk-overflow-container'
        },

        ready() {

            this.$el.on('show', () => {
                this.page.addClass(this.clsPage);
                this.$el.css('display', 'block');
                this._callUpdate();
                this.$el.height();
                this.$el.addClass(this.clsOpen);
            });

            this.$el.on('hide', () => {

                this.panel.one(transitionend, () => {
                    this.page.removeClass(this.clsPage);
                    this.$el.css('display', '').removeClass('uk-flex uk-flex-center uk-flex-middle');
                });

                this.$el.removeClass(this.clsOpen);
            });

        },

        update: {

            handler() {

                if (this.$el.css('display') === 'block' && this.center) {
                    this.$el.removeClass('uk-flex uk-flex-center').css('display', 'block');
                    this.$el.toggleClass('uk-flex-middle', window.innerHeight > this.panel.outerHeight(true));
                    this.$el.addClass('uk-flex uk-flex-center').css('display', '');
                }

            },

            events: ['resize', 'orientationchange']

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
