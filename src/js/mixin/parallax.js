import Media from '../mixin/media';
import { getMaxPathLength } from '../core/svg';
import {
    createEvent,
    css,
    Dimensions,
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
        load() {
            this.$emit();
        },
    },

    methods: {
        reset() {
            for (const prop in this.getCss(0)) {
                css(this.$el, prop, '');
            }
        },

        getCss(percent) {
            const css = { transform: '', filter: '' };
            for (const prop in this.props) {
                this.props[prop](css, percent);
            }
            return css;
        },
    },
};

function transformFn(prop, el, steps) {
    let unit = getUnit(steps) || { x: 'px', y: 'px', rotate: 'deg' }[prop] || '';
    let transformFn;

    if (prop === 'x' || prop === 'y') {
        prop = `translate${ucfirst(prop)}`;
        transformFn = (step) => toFloat(toFloat(step).toFixed(unit === 'px' ? 0 : 6));
    } else if (prop === 'scale') {
        unit = '';
        transformFn = (step) =>
            getUnit([step]) ? toPx(step, 'width', el, true) / el.offsetWidth : step;
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
                trigger(el, createEvent('load', false));
            };
            return toDimensions(image);
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
    const { length } = steps;
    let nullIndex = 0;
    for (let i = 0; i < length; i++) {
        let [value, percent] = isString(steps[i]) ? steps[i].trim().split(' ') : [steps[i]];
        value = fn(value);
        percent = percent ? toFloat(percent) / 100 : null;

        if (i === 0) {
            if (percent === null) {
                percent = 0;
            } else if (percent) {
                result.push([value, 0]);
            }
        } else if (i === length - 1) {
            if (percent === null) {
                percent = 1;
            } else if (percent !== 1) {
                result.push([value, percent]);
                percent = 1;
            }
        }

        result.push([value, percent]);

        if (percent === null) {
            nullIndex++;
        } else if (nullIndex) {
            const leftPercent = result[i - nullIndex - 1][1];
            const p = (percent - leftPercent) / (nullIndex + 1);
            for (let j = nullIndex; j > 0; j--) {
                result[i - j][1] = leftPercent + p * (nullIndex - j + 1);
            }

            nullIndex = 0;
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

const unitRe = /^-?\d+(\S*)/;
function getUnit(steps, defaultUnit) {
    for (const step of steps) {
        const match = step.match?.(unitRe);
        if (match) {
            return match[1];
        }
    }
    return defaultUnit;
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
