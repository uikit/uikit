import {scale3d} from '../../mixin/internal/slideshow-animations';

export default function (UIkit) {

    const {mixin, util: {assign, css}} = UIkit;

    return assign({}, mixin.slideshow.defaults.Animations, {

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

}
