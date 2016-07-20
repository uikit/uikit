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

    UIkit.component('close', UIkit.components.icon.extend({

        name: 'close',

        defaults: {icon: 'close_icon'}

    }));

    UIkit.component('navbar-toggle-icon', UIkit.components.icon.extend({

        name: 'navbar-toggle-icon',

        defaults: {icon: 'navbar_toggle_icon'}

    }));

    UIkit.component('overlay-icon', UIkit.components.icon.extend({

        name: 'overlay-icon',

        defaults: {icon: 'overlay_icon'}

    }));

    UIkit.component('slidenav', UIkit.components.icon.extend({

        name: 'slidenav',

        init() {
            this.icon = `slidenav_${this.icon}`;
        }

    }));

    UIkit.component('totop', UIkit.components.icon.extend({

        name: 'totop',

        defaults: {icon: 'totop_icon'}

    }));

}
