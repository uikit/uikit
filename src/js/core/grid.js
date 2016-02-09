export default function (UIkit) {

    UIkit.component('grid', UIkit.components.marginWrap.extend({

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            rowFirst: 'uk-grid-first'
        }

    }));

}
