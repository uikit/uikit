import { Class, Toggable } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [Class, Toggable],

        props: {
            animation: Boolean,
            close: String
        },

        defaults: {
            animation: true,
            close: '.uk-alert-close',
            duration: 150
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
                requestAnimationFrame(() => this.$el.css('opacity', 0));
            }

        }

    });

}
