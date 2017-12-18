import { Margin } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('margin', {
        mixins: [Margin]
    });

}
