import { Class, Masonry } from '../mixin/index';
import { toggleClass } from '../util/index';

export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class, Masonry],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            write(data) {
                toggleClass(this.$el, this.clsStack, data.stacks);
            },

            events: ['load', 'resize']

        }

    }));

}
