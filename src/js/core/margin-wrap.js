import marginMixin from '../mixin/margin';

export default function (UIkit) {

    UIkit.component('margin-wrap', {

        mixins: [marginMixin],

        defaults: {
            margin: 'uk-margin-small-top',
            rowfirst: false
        }

    });

}
