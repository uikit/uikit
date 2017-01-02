import { Class } from '../mixin/index';
import { fastdom } from '../util/index';

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

                fastdom.clear(this._mutateGrid);
                this._mutateGrid = fastdom.mutate(() => this.$el.toggleClass(this.clsStack, this.stacks));

            },

            events: ['load', 'resize', 'orientationchange']

        }

    }));

}
