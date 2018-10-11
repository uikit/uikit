import Media from '../mixin/media';
import {css, Dimensions, each, includes, isNumber, isUndefined, toFloat} from 'uikit-util';

const props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

export default {

    mixins: [Media],

    props: props.reduce((props, prop) => {
        props[prop] = 'list';
        return props;
    }, {}),

    data: props.reduce((data, prop) => {
        data[prop] = undefined;
        return data;
    }, {}),

    computed: {

        props(properties, $el) {

            return props.reduce((props, prop) => {

                if (isUndefined(properties[prop])) {
                    return props;
                }

                const isColor = prop.match(/color/i);
                const isCssProp = isColor || prop === 'opacity';

                let pos, bgPos, diff;
                let steps = properties[prop].slice(0);

                if (isCssProp) {
                    css($el, prop, '');
                }

                if (steps.length < 2) {
                    steps.unshift((prop === 'scale'
                        ? 1
                        : isCssProp
                            ? css($el, prop)
                            : 0) || 0);
                }

                const unit = includes(steps.join(''), '%') ? '%' : 'px';

                if (isColor) {

                    const {color} = $el.style;
                    steps = steps.map(step => parseColor($el, step));
                    $el.style.color = color;

                } else {

                    steps = steps.map(toFloat);

                }

                if (prop.match(/^bg/)) {

                    css($el, `background-position-${prop[2]}`, '');
                    bgPos = css($el, 'backgroundPosition').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

                    if (this.covers) {

                        const min = Math.min(...steps);
                        const max = Math.max(...steps);
                        const down = steps.indexOf(min) < steps.indexOf(max);

                        diff = max - min;

                        steps = steps.map(step => step - (down ? min : max));
                        pos = `${down ? -diff : 0}px`;

                    } else {

                        pos = bgPos;

                    }
                }

                props[prop] = {steps, unit, pos, bgPos, diff};

                return props;

            }, {});

        },

        bgProps() {
            return ['bgx', 'bgy'].filter(bg => bg in this.props);
        },

        covers(_, $el) {
            return covers($el);
        }

    },

    disconnected() {
        delete this._image;
    },

    update: {

        read(data) {

            data.active = this.matchMedia;

            if (!data.active) {
                return;
            }

            if (!data.image && this.covers && this.bgProps.length) {
                const src = css(this.$el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

                if (src) {
                    const img = new Image();
                    img.src = src;
                    data.image = img;

                    if (!img.naturalWidth) {
                        img.onload = () => this.$emit();
                    }
                }

            }

            const {image} = data;

            if (!image || !image.naturalWidth) {
                return;
            }

            const dimEl = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            };
            const dimImage = {
                width: image.naturalWidth,
                height: image.naturalHeight
            };

            let dim = Dimensions.cover(dimImage, dimEl);

            this.bgProps.forEach(prop => {

                const {diff, bgPos, steps} = this.props[prop];
                const attr = prop === 'bgy' ? 'height' : 'width';
                const span = dim[attr] - dimEl[attr];

                if (!bgPos.match(/%$|0px/)) {
                    return;
                }

                if (span < diff) {
                    dimEl[attr] = dim[attr] + diff - span;
                } else if (span > diff) {

                    const bgPosFloat = parseFloat(bgPos);

                    if (bgPosFloat) {
                        this.props[prop].steps = steps.map(step => step - (span - diff) / (100 / bgPosFloat));
                    }
                }

                dim = Dimensions.cover(dimImage, dimEl);
            });

            data.dim = dim;
        },

        write({dim, active}) {

            if (!active) {
                css(this.$el, {backgroundSize: '', backgroundRepeat: ''});
                return;
            }

            dim && css(this.$el, {
                backgroundSize: `${dim.width}px ${dim.height}px`,
                backgroundRepeat: 'no-repeat'
            });

        },

        events: ['load', 'resize']

    },

    methods: {

        reset() {
            each(this.getCss(0), (_, prop) => css(this.$el, prop, ''));
        },

        getCss(percent) {

            const {props} = this;
            let translated = false;

            return Object.keys(props).reduce((css, prop) => {

                const {steps, unit, pos} = props[prop];
                const value = getValue(steps, percent);

                switch (prop) {

                    // transforms
                    case 'x':
                    case 'y':

                        if (translated) {
                            break;
                        }

                        const [x, y] = ['x', 'y'].map(dir => prop === dir
                            ? toFloat(value).toFixed(0) + unit
                            : props[dir]
                                ? getValue(props[dir].steps, percent, 0) + props[dir].unit
                                : 0
                        );

                        translated = css.transform += ` translate3d(${x}, ${y}, 0)`;
                        break;
                    case 'rotate':
                        css.transform += ` rotate(${value}deg)`;
                        break;
                    case 'scale':
                        css.transform += ` scale(${value})`;
                        break;

                    // bg image
                    case 'bgy':
                    case 'bgx':
                        css[`background-position-${prop[2]}`] = `calc(${pos} + ${value + unit})`;
                        break;

                    // color
                    case 'color':
                    case 'backgroundColor':
                    case 'borderColor':

                        const [start, end, p] = getStep(steps, percent);

                        css[prop] = `rgba(${
                            start.map((value, i) => {
                                value = value + p * (end[i] - value);
                                return i === 3 ? toFloat(value) : parseInt(value, 10);
                            }).join(',')
                            })`;
                        break;

                    // CSS Filter
                    case 'blur':
                        css.filter += ` blur(${value}px)`;
                        break;
                    case 'hue':
                        css.filter += ` hue-rotate(${value}deg)`;
                        break;
                    case 'fopacity':
                        css.filter += ` opacity(${value}%)`;
                        break;
                    case 'grayscale':
                    case 'invert':
                    case 'saturate':
                    case 'sepia':
                        css.filter += ` ${prop}(${value}%)`;
                        break;

                    default:
                        css[prop] = value;
                }

                return css;

            }, {transform: '', filter: ''});

        }

    }

};

function parseColor(el, color) {
    return css(css(el, 'color', color), 'color').split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(n => toFloat(n));
}

function getStep(steps, percent) {
    const count = steps.length - 1;
    const index = Math.min(Math.floor(count * percent), count - 1);
    const step = steps.slice(index, index + 2);

    step.push(percent === 1 ? 1 : percent % (1 / count) * count);

    return step;
}

function getValue(steps, percent, digits = 2) {
    const [start, end, p] = getStep(steps, percent);
    return (isNumber(start)
            ? start + Math.abs(start - end) * p * (start < end ? 1 : -1)
            : +end
    ).toFixed(digits);
}

function covers(el) {
    const {backgroundSize} = el.style;
    const covers = css(css(el, 'backgroundSize', ''), 'backgroundSize') === 'cover';
    el.style.backgroundSize = backgroundSize;
    return covers;
}
