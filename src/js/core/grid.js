export default function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        name: 'grid',

        mixins: [UIkit.mixin.class],

        defaults: {margin: 'uk-grid-margin'}

    }));

}
