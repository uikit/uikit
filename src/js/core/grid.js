import { Class } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            handler() {

                this.$el.toggleClass(this.clsStack, !this.$el.children().filter((i, el) => el.offsetHeight).not(`.${this.firstColumn}`).length);

            },

            events: ['load', 'resize', 'orientationchange']

        }

    }));

}
