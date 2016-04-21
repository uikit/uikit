export default function (UIkit) {

    UIkit.component('icon', UIkit.components.svg.extend({

        name: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class']}

    }));

}
