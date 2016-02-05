import marginMixin from '../mixin/margin';

export default function (UIkit) {

    UIkit.component('margin-wrap', {

        mixins: [marginMixin],

        defaults: {
            cls: 'uk-margin-small-top',
            rowFirst: false
        }

    });

}
