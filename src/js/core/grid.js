import { Class } from '../mixin/index';
import { toggleClass } from '../util/index';

export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            write() {

                toggleClass(this.$el, this.clsStack, this.stacks);

            },

            events: ['load', 'resize']

        }

    }));

}
