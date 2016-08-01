import { Class } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        props: {
            target: 'jQuery'
        },

        defaults: {
            target: false
        },

        ready() {
            this.input = this.$el.find(':input:first');
            this.target = this.target || this.input.next();
        },

        events: {

            change() {
                this.target[this.target.is(':input') ? 'val' : 'text'](this.input.is('select')
                    ? this.input.find('option:selected').text()
                    : this.input.val()
                );
            }

        }

    });

}
