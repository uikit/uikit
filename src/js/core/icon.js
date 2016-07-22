export default function (UIkit) {

    UIkit.component('icon', UIkit.components.svg.extend({

        mixins: [UIkit.mixin.class],

        name: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class']},

        init() {
            this.$el.addClass('uk-icon');
        }

    }));

    [
        'close',
        'navbar-toggle-icon',
        'overlay-icon',
        'slidenav',
        'spinner',
        'search-icon',
        'search-toggle',
        'totop'
    ].forEach(name => UIkit.component(name, UIkit.components.icon.extend({name})));

}
