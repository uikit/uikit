import { Class, Filter, Margin } from '../mixin/index';
import { toggleClass } from '../util/index';

export default function (UIkit) {

    UIkit.component('grid', {

        mixins: [Class, Filter, Margin],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            write({stacks}) {

                toggleClass(this.$el, this.clsStack, stacks);

            },

            events: ['load', 'resize']

        }

    });

}
