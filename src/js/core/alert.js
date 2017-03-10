import { Class, Toggable } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [Class, Toggable],

        args: 'animation',

        props: {
            close: String
        },

        defaults: {
            animation: [true],
            close: '.uk-alert-close',
            duration: 150,
            hideProps: {opacity: 0}
        },

        events: [

            {

                name: 'click',

                delegate() {
                    return this.close;
                },

                handler(e) {
                    e.preventDefault();
                    this.closeAlert();
                }

            }

        ],

        methods: {

            closeAlert() {
                this.toggleElement(this.$el).then(() => this.$destroy(true));
            }

        }

    });

}
