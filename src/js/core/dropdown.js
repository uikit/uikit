export default function (UIkit) {

    UIkit.component('dropdown', UIkit.components.drop.extend({

        name: 'dropdown',

        defaults: {

            target: '.uk-dropdown',
            cls: 'uk-dropdown'
        }

    }));

}
