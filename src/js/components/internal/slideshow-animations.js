import {scale3d, translate3d} from '../../mixin/internal/slideshow-animations';

export default function (UIkit) {

    var {mixin} = UIkit;
    var {assign, css} = UIkit.util;

    var Animations = assign({}, mixin.slideshow.defaults.Animations, {

        fade: {

            show() {
                return [
                    {opacity: 0, zIndex: 0},
                    {zIndex: -1}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent, zIndex: 0},
                    {zIndex: -1}
                ];
            }

        },

        scale: {

            show() {
                return [
                    {opacity: 0, transform: scale3d(1 + .5), zIndex: 0},
                    {zIndex: -1}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent, transform: scale3d(1 + .5 * percent), zIndex: 0},
                    {zIndex: -1}
                ];
            }

        },

        pull: {

            show(dir) {
                return dir < 0
                    ? [
                        {transform: translate3d(100), zIndex: 0},
                        {transform: translate3d(), zIndex: -1},
                    ]
                    : [
                        {transform: translate3d(-100), zIndex: 0},
                        {transform: translate3d(), zIndex: -1}
                    ];
            },

            percent(current) {
                return Animations.translated(current);
            },

            translate(percent, dir) {
                return dir < 0
                    ? [
                        {transform: translate3d(percent * 100), zIndex: 0},
                        {transform: translate3d(-30 * (1 - percent)), zIndex: -1},
                    ]
                    : [
                        {transform: translate3d(-percent * 100), zIndex: 0},
                        {transform: translate3d(30 * (1 - percent)), zIndex: -1}
                    ];
            }

        },

        push: {

            show(dir) {

                return dir < 0
                    ? [
                        {transform: translate3d(30), zIndex: -1},
                        {transform: translate3d(), zIndex: 0},
                    ]
                    : [
                        {transform: translate3d(-30), zIndex: -1},
                        {transform: translate3d(), zIndex: 0}
                    ];
            },

            percent(current, next) {
                return 1 - Animations.translated(next);
            },

            translate(percent, dir) {
                return dir < 0
                    ? [
                        {transform: translate3d(30 * percent), zIndex: -1},
                        {transform: translate3d(-100 * (1 - percent)), zIndex: 0},
                    ]
                    : [
                        {transform: translate3d(-30 * percent), zIndex: -1},
                        {transform: translate3d(100 * (1 - percent)), zIndex: 0}
                    ];
            }

        }

    });

    return Animations;

}
