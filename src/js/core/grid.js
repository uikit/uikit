import marginMixin from '../mixin/margin';

export default function (UIkit) {

    UIkit.component('grid', {

        mixins: [marginMixin],

        defaults: {
            margin: 'uk-grid-margin',
            rowFirst: 'uk-grid-first'
        }

    });

}
