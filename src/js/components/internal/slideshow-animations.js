import { css } from 'uikit-util';
import Animations, { translate, translated } from '../../mixin/internal/slideshow-animations';

export default {
    ...Animations,
    fade: {
        percent: (current) => 1 - css(current, 'opacity'),
        translate: (percent) => [{ opacity: 1 - percent, zIndex: 0 }, { zIndex: -1 }],
    },

    scale: {
        percent: (current) => 1 - css(current, 'opacity'),

        translate: (percent) => [
            { opacity: 1 - percent, transform: scale3d(1 + 0.5 * percent), zIndex: 0 },
            { zIndex: -1 },
        ],
    },

    pull: {
        percent: (current, next, dir) => (dir < 0 ? 1 - translated(next) : translated(current)),

        translate: (percent, dir) =>
            dir < 0
                ? [
                      { transform: translate(30 * percent), zIndex: -1 },
                      { transform: translate(-100 * (1 - percent)), zIndex: 0 },
                  ]
                : [
                      { transform: translate(-percent * 100), zIndex: 0 },
                      { transform: translate(30 * (1 - percent)), zIndex: -1 },
                  ],
    },

    push: {
        percent: (current, next, dir) => (dir > 0 ? 1 - translated(next) : translated(current)),

        translate: (percent, dir) =>
            dir < 0
                ? [
                      { transform: translate(percent * 100), zIndex: 0 },
                      { transform: translate(-30 * (1 - percent)), zIndex: -1 },
                  ]
                : [
                      { transform: translate(-30 * percent), zIndex: -1 },
                      { transform: translate(100 * (1 - percent)), zIndex: 0 },
                  ],
    },
};

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}
