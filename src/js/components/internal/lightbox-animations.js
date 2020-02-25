import Animations, {scale3d} from '../../mixin/internal/slideshow-animations';
import {assign, css} from 'uikit-util';

export default assign({}, Animations, {

    fade: {

        show() {
            return [
                {opacity: 0},
                {opacity: 1}
            ];
        },

        percent(current) {
            return 1 - css(current, 'opacity');
        },

        translate(percent) {
            return [
                {opacity: 1 - percent},
                {opacity: percent}
            ];
        }

    },

    scale: {

        show() {
            return [
                {opacity: 0, transform: scale3d(1 - .2)},
                {opacity: 1, transform: scale3d(1)}
            ];
        },

        percent(current) {
            return 1 - css(current, 'opacity');
        },

        translate(percent) {
            return [
                {opacity: 1 - percent, transform: scale3d(1 - .2 * percent)},
                {opacity: percent, transform: scale3d(1 - .2 + .2 * percent)}
            ];
        }

    }

});
