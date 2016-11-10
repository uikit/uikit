import { Class } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        ready() {

            if (this.margin === 'uk-grid-margin') {

                var size = this.$el.attr('class').match(/\buk-grid-(small|medium|large|collapse)\b/);

                if (size) {
                    this.margin = `uk-grid-margin-${size[1]}`;
                }

            }

        },

        update: {

            handler() {

                this.$el.toggleClass(this.clsStack, !this.$el.children().filter((i, el) => el.offsetHeight).not(`.${this.firstColumn}`).length);

            },

            events: ['load', 'resize', 'orientationchange']

        }

    }));

}
