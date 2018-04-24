import {css} from 'uikit-util';

export default {

    slide: {

        show(dir) {
            return [
                {transform: translate(dir * -100)},
                {transform: translate()}
            ];
        },

        percent(current) {
            return translated(current);
        },

        translate(percent, dir) {
            return [
                {transform: translate(dir * -100 * percent)},
                {transform: translate(dir * 100 * (1 - percent))}
            ];
        }

    }

};

export function translated(el) {
    return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
}

export function translate(value = 0, unit = '%') {
    return `translateX(${value}${value ? unit : ''})`; // currently not translate3d to support IE, translate3d within translate3d does not work while transitioning
}

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}
