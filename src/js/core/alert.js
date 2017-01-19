import { Class, Toggable } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [Class, Toggable],

        args: 'animation',

        props: {
            animation: Boolean,
            close: String
        },

        defaults: {
            animation: true,
            close: '.uk-alert-close',
            duration: 150,
            hideProps: {opacity: 0}
        },

        ready() {
            this.$el.on('click', this.close, e => {
                e.preventDefault();
                this.closeAlert();
            });
        },

        methods: {

            closeAlert() {
                this.toggleElement(this.$el).then(() => this.$destroy(true));
            }

        }

    });

}
