export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [UIkit.mixin.class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            handler() {

                var children = this.$el.children().filter((i, el) => el.offsetHeight > 0);

                this.$el.toggleClass(this.clsStack, children.length === children.filter(`.${this.firstColumn}`).length);

            },

            events: ['load', 'resize', 'orientationchange']

        }

    }));

}
