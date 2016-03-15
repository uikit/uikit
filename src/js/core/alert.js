import {Transition} from '../util/index';

export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [UIkit.mixin.toggle],

        props: {
            animation: Boolean,
            close: String
        },

        defaults: {
            animation: true,
            close: '.uk-alert-close'
        },

        ready() {
            this.$el.on('click', this.close, e => {
                e.preventDefault();
                this.closeAlert();
            });
        },

        methods: {

            closeAlert() {
                this.$el.trigger('close');
                this.toggleState(this.$el).then(() => this.$destroy());
                requestAnimationFrame(() => this.$el.css({
                    opacity: 0,
                    'padding-top': 0,
                    'margin-top': 0
                }))
            }

        },

        destroy() {
            this.$el.off('click');
            this.$el.trigger('closed');
        }

    });

}
