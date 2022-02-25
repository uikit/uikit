import Media from '../mixin/media';
import { getMaxPathLength } from '../core/svg';
import {
    css,
    Dimensions,
    each,
    findIndex,
    isNumber,
    isString,
    isUndefined,
    noop,
    toFloat,
    toPx,
    trigger,
    ucfirst,
} from 'uikit-util';

const props = {
    x: transformFn,
    y: transformFn,
    rotate: transformFn,
    scale: transformFn,
    color: colorFn,
    backgroundColor: colorFn,
    borderColor: colorFn,
    blur: filterFn,
    hue: filterFn,
    fopacity: filterFn,
    grayscale: filterFn,
    invert: filterFn,
    saturate: filterFn,
    sepia: filterFn,
    opacity: cssPropFn,
    stroke: strokeFn,
    bgx: backgroundFn,
    bgy: backgroundFn,
};

const { keys } = Object;

export default {
    mixins: [Media],

    props: fillObject(keys(props), 'list'),

    data: fillObject(keys(props), undefined),

    computed: {
        props(properties, $el) {
            return keys(props).reduce((result, prop) => {
                if (!isUndefined(properties[prop])) {
                    result[prop] = props[prop](prop, $el, properties[prop].slice());
                }
                return result;
            }, {});
        },
    },

    events: {
        bgimageload() {
            this.$emit();
        },
    },

    methods: {
        reset() {
            each(this.getCss(0), (_, prop) => css(this.$el, prop, ''));
        },

        getCss(percent) {
            return keys(this.props).reduce(
                (css, prop) => {
                    this.props[prop](css, percent);
                    return css;
                },
                { transform: '', filter: '' }
            );
        },
    },
};

function transformFn(prop, el, steps) {
    const unit = getUnit(steps) || { x: 'px', y: 'px', rotate: 'deg' }[prop] || '';
    let transformFn;

    if (prop === 'x' || prop === 'y') {
        prop = `translate${ucfirst(prop)}`;
        transformFn = (step) => toFloat(toFloat(step).toFixed(unit === 'px' ? 0 : 6));
    }

    if (steps.length === 1) {
        steps.unshift(prop === 'scale' ? 1 : 0);
    }

    steps = parseSteps(steps, transformFn);

    return (css, percent) => {
        css.transform += ` ${prop}(${getValue(steps, percent)}${unit})`;
    };
}

function colorFn(prop, el, steps) {
    if (steps.length === 1) {
        steps.unshift(getCssValue(el, prop, ''));
    }

    steps = parseSteps(steps, (step) => parseColor(el, step));

    return (css, percent) => {
        const [start, end, p] = getStep(steps, percent);
        const value = start
            .map((value, i) => {
                value += p * (end[i] - value);
                return i === 3 ? toFloat(value) : parseInt(value, 10);
            })
            .join(',');
        css[prop] = `rgba(${value})`;
    };
}

function parseColor(el, color) {
    return getCssValue(el, 'color', color)
        .split(/[(),]/g)
        .slice(1, -1)
        .concat(1)
        .slice(0, 4)
        .map(toFloat);
}

function filterFn(prop, el, steps) {
    if (steps.length === 1) {
        steps.unshift(0);
    }

    const unit = getUnit(steps) || { blur: 'px', hue: 'deg' }[prop] || '%';
    prop = { fopacity: 'opacity', hue: 'hue-rotate' }[prop] || prop;
    steps = parseSteps(steps);

    return (css, percent) => {
        const value = getValue(steps, percent);
        css.filter += ` ${prop}(${value + unit})`;
    };
}

function cssPropFn(prop, el, steps) {
    if (steps.length === 1) {
        steps.unshift(getCssValue(el, prop, ''));
    }

    steps = parseSteps(steps);

    return (css, percent) => {
        css[prop] = getValue(steps, percent);
    };
}

function strokeFn(prop, el, steps) {
    if (steps.length === 1) {
        steps.unshift(0);
    }

    const unit = getUnit(steps);
    const length = getMaxPathLength(el);
    steps = parseSteps(steps.reverse(), (step) => {
        step = toFloat(step);
        return unit === '%' ? (step * length) / 100 : step;
    });

    if (!steps.some(([value]) => value)) {
        return noop;
    }

    css(el, 'strokeDasharray', length);

    return (css, percent) => {
        css.strokeDashoffset = getValue(steps, percent);
    };
}

function backgroundFn(prop, el, steps) {
    if (steps.length === 1) {
        steps.unshift(0);
    }

    prop = prop.substr(-1);
    const attr = prop === 'y' ? 'height' : 'width';
    steps = parseSteps(steps, (step) => toPx(step, attr, el));

    const bgPos = getCssValue(el, `background-position-${prop}`, '');

    return getCssValue(el, 'backgroundSize', '') === 'cover'
        ? backgroundCoverFn(prop, el, steps, bgPos, attr)
        : setBackgroundPosFn(prop, steps, bgPos);
}

function backgroundCoverFn(prop, el, steps, bgPos, attr) {
    const dimImage = getBackgroundImageDimensions(el);

    if (!dimImage.width) {
        return noop;
    }

    const values = steps.map(([value]) => value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const down = values.indexOf(min) < values.indexOf(max);

    const diff = max - min;
    let pos = (down ? -diff : 0) - (down ? min : max);

    const dimEl = {
        width: el.offsetWidth,
        height: el.offsetHeight,
    };

    const baseDim = Dimensions.cover(dimImage, dimEl);
    const span = baseDim[attr] - dimEl[attr];

    if (span < diff) {
        dimEl[attr] = baseDim[attr] + diff - span;
    } else if (span > diff) {
        const posPercentage = dimEl[attr] / toPx(bgPos, attr, el, true);

        if (posPercentage) {
            pos -= (span - diff) / posPercentage;
        }
    }

    const dim = Dimensions.cover(dimImage, dimEl);

    const fn = setBackgroundPosFn(prop, steps, `${pos}px`);
    return (css, percent) => {
        fn(css, percent);
        css.backgroundSize = `${dim.width}px ${dim.height}px`;
        css.backgroundRepeat = 'no-repeat';
    };
}

function setBackgroundPosFn(prop, steps, pos) {
    return function (css, percent) {
        css[`background-position-${prop}`] = `calc(${pos} + ${getValue(steps, percent)}px)`;
    };
}

const dimensions = {};
function getBackgroundImageDimensions(el) {
    const src = css(el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

    if (dimensions[src]) {
        return dimensions[src];
    }

    const image = new Image();
    if (src) {
        image.src = src;

        if (!image.naturalWidth) {
            image.onload = () => {
                dimensions[src] = toDimensions(image);
                trigger(el, 'bgimageload');
            };
        }
    }

    return (dimensions[src] = toDimensions(image));
}

function toDimensions(image) {
    return {
        width: image.naturalWidth,
        height: image.naturalHeight,
    };
}

function parseSteps(steps, fn = toFloat) {
    const result = [];
    for (const step of steps) {
        const [value, percent] = isString(step) ? step.trim().split(' ') : [step];
        result.push([fn(value), percent ? toFloat(percent) / 100 : null]);
    }

    const { length } = result;
    result[0][1] = 0;
    result[length - 1][1] = 1;
    for (let i = 1; i < length - 1; i++) {
        if (result[i] === null) {
            const nextIndex = findIndex(result.slice(i + 1), ([, percent]) => percent !== null) + 1;
            const percent = (result[i + nextIndex] - result[i - 1][1]) / (nextIndex + 1);
            for (let j = 0; j < nextIndex; j++) {
                result[i + j][1] = percent * j + 1;
            }
        }
    }

    return result;
}

function getStep(steps, percent) {
    const index = findIndex(steps.slice(1), ([, targetPercent]) => percent <= targetPercent) + 1;
    return [
        steps[index - 1][0],
        steps[index][0],
        (percent - steps[index - 1][1]) / (steps[index][1] - steps[index - 1][1]),
    ];
}

function getValue(steps, percent) {
    const [start, end, p] = getStep(steps, percent);
    return isNumber(start) ? start + Math.abs(start - end) * p * (start < end ? 1 : -1) : +end;
}

function getUnit(steps, defaultUnit) {
    return (
        steps.reduce(
            (unit, step) => unit || (isString(step) && step.replace(/[\d-]/g, '').trim()),
            ''
        ) || defaultUnit
    );
}

function getCssValue(el, prop, value) {
    const prev = el.style[prop];
    const val = css(css(el, prop, value), prop);
    el.style[prop] = prev;
    return val;
}

function fillObject(keys, value) {
    return keys.reduce((data, prop) => {
        data[prop] = value;
        return data;
    }, {});
}
