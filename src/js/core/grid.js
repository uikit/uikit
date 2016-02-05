import marginMixin from '../mixin/margin';

export default function (UIkit) {

    UIkit.component('grid', {

        mixins: [marginMixin],

        defaults: {
            cls: 'uk-grid-margin',
            rowFirst: 'uk-grid-first'
        }

    });

}
