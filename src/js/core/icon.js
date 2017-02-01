import { Class } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('icon', UIkit.components.svg.extend({

        mixins: [Class],

        name: 'icon',

        args: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class', 'src']},

        init() {
            this.$el.addClass('uk-icon');
        }

    }));

    [
        'close',
        'navbar-toggle-icon',
        'overlay-icon',
        'pagination-previous',
        'pagination-next',
        'search-icon',
        'totop'
    ].forEach(name => UIkit.component(name, UIkit.components.icon.extend({name})));

    [
        'slidenav-previous',
        'slidenav-next'
    ].forEach(name => UIkit.component(name, UIkit.components.icon.extend({

        name,

        init() {
            this.$el.addClass('uk-slidenav');
        }

    })));

}
