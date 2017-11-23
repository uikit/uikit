export default function (UIkit) {

    var {css} = UIkit.util;

    var Animations = {

        slide: {

            show(dir) {
                return [
                    {transform: translate(dir * -100)},
                    {transform: translate()}
                ];
            },

            percent(current) {
                return Animations.translated(current);
            },

            translate(percent, dir) {
                return [
                    {transform: translate(dir * -100 * percent)},
                    {transform: translate(dir * 100 * (1 - percent))}
                ];
            }

        },

        translated(el) {
            return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
        }

    };

    return Animations;

}

export function translate(value = 0, unit = '%') {
    return `translate(${value}${value ? unit : ''}, 0)`; // currently not translate3d to support IE, translate3d within translate3d does not work while transitioning
}

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}
