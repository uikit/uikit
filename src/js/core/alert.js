import {Class, Togglable} from '../mixin/index';
import {assign} from '../util/index';

export default function (UIkit) {

    UIkit.component('alert', {

        attrs: true,

        mixins: [Class, Togglable],

        args: 'animation',

        props: {
            close: String
        },

        defaults: {
            animation: [true],
            selClose: '.uk-alert-close',
            duration: 150,
            hideProps: assign({opacity: 0}, Togglable.defaults.hideProps)
        },

        events: [

            {

                name: 'click',

                delegate() {
                    return this.selClose;
                },

                handler(e) {
                    e.preventDefault();
                    this.close();
                }

            }

        ],

        methods: {

            close() {
                this.toggleElement(this.$el).then(() => this.$destroy(true));
            }

        }

    });

}
