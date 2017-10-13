export default function (UIkit) {

    var {css} = UIkit.util;

    var Animations = {

        slide: {

            show(dir) {
                return [
                    {transform: translate3d(dir * -100)},
                    {transform: translate3d()}
                ];
            },

            percent(current) {
                return Animations.translated(current);
            },

            translate(percent, dir) {
                return [
                    {transform: translate3d(dir * -100 * percent)},
                    {transform: translate3d(dir * 100 * (1 - percent))}
                ];
            }

        },

        translated(el) {
            return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth)
        }

    };

    return Animations;

};

export function translate3d(value = 0) {
    return `translate3d(${value}${value ? '%' : ''}, 0, 0)`;
}

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}
