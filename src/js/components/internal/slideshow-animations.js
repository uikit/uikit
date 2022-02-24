import Animations, {
    scale3d,
    translate,
    translated,
} from '../../mixin/internal/slideshow-animations';
import { css } from 'uikit-util';

export default {
    ...Animations,
    fade: {
        show() {
            return [{ opacity: 0, zIndex: 0 }, { zIndex: -1 }];
        },

        percent(current) {
            return 1 - css(current, 'opacity');
        },

        translate(percent) {
            return [{ opacity: 1 - percent, zIndex: 0 }, { zIndex: -1 }];
        },
    },

    scale: {
        show() {
            return [{ opacity: 0, transform: scale3d(1 + 0.5), zIndex: 0 }, { zIndex: -1 }];
        },

        percent(current) {
            return 1 - css(current, 'opacity');
        },

        translate(percent) {
            return [
                { opacity: 1 - percent, transform: scale3d(1 + 0.5 * percent), zIndex: 0 },
                { zIndex: -1 },
            ];
        },
    },

    pull: {
        show(dir) {
            return dir < 0
                ? [
                      { transform: translate(30), zIndex: -1 },
                      { transform: translate(), zIndex: 0 },
                  ]
                : [
                      { transform: translate(-100), zIndex: 0 },
                      { transform: translate(), zIndex: -1 },
                  ];
        },

        percent(current, next, dir) {
            return dir < 0 ? 1 - translated(next) : translated(current);
        },

        translate(percent, dir) {
            return dir < 0
                ? [
                      { transform: translate(30 * percent), zIndex: -1 },
                      { transform: translate(-100 * (1 - percent)), zIndex: 0 },
                  ]
                : [
                      { transform: translate(-percent * 100), zIndex: 0 },
                      { transform: translate(30 * (1 - percent)), zIndex: -1 },
                  ];
        },
    },

    push: {
        show(dir) {
            return dir < 0
                ? [
                      { transform: translate(100), zIndex: 0 },
                      { transform: translate(), zIndex: -1 },
                  ]
                : [
                      { transform: translate(-30), zIndex: -1 },
                      { transform: translate(), zIndex: 0 },
                  ];
        },

        percent(current, next, dir) {
            return dir > 0 ? 1 - translated(next) : translated(current);
        },

        translate(percent, dir) {
            return dir < 0
                ? [
                      { transform: translate(percent * 100), zIndex: 0 },
                      { transform: translate(-30 * (1 - percent)), zIndex: -1 },
                  ]
                : [
                      { transform: translate(-30 * percent), zIndex: -1 },
                      { transform: translate(100 * (1 - percent)), zIndex: 0 },
                  ];
        },
    },
};
