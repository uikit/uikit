import { css } from 'uikit-util';

export default {
    slide: {
        show(dir) {
            return [{ transform: translate(dir * -100) }, { transform: translate() }];
        },

        percent(current) {
            return translated(current);
        },

        translate(percent, dir) {
            return [
                { transform: translate(dir * -100 * percent) },
                { transform: translate(dir * 100 * (1 - percent)) },
            ];
        },
    },
};

export function translated(el) {
    return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
}

export function translate(value = 0, unit = '%') {
    value += value ? unit : '';
    return `translate3d(${value}, 0, 0)`;
}

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}
