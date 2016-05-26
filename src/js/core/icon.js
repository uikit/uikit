export default function (UIkit) {

    UIkit.component('icon', UIkit.components.svg.extend({

        mixins: [UIkit.mixin.class],

        name: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class']}

    }));

}
