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

function transformFn(prop, el, stops) {
    let unit = getUnit(stops) || { x: 'px', y: 'px', rotate: 'deg' }[prop] || '';
    let transformFn;

    if (prop === 'x' || prop === 'y') {
        prop = `translate${ucfirst(prop)}`;
        transformFn = (stop) => toFloat(toFloat(stop).toFixed(unit === 'px' ? 0 : 6));
    } else if (prop === 'scale') {
        unit = '';
        transformFn = (stop) =>
            getUnit([stop]) ? toPx(stop, 'width', el, true) / el.offsetWidth : stop;
    }

    if (stops.length === 1) {
        stops.unshift(prop === 'scale' ? 1 : 0);
    }

    stops = parseStops(stops, transformFn);

    return (css, percent) => {
        css.transform += ` ${prop}(${getValue(stops, percent)}${unit})`;
    };
}

function colorFn(prop, el, stops) {
    if (stops.length === 1) {
        stops.unshift(getCssValue(el, prop, ''));
    }

    stops = parseStops(stops, (stop) => parseColor(el, stop));

    return (css, percent) => {
        const [start, end, p] = getStop(stops, percent);
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

function filterFn(prop, el, stops) {
    if (stops.length === 1) {
        stops.unshift(0);
    }

    const unit = getUnit(stops) || { blur: 'px', hue: 'deg' }[prop] || '%';
    prop = { fopacity: 'opacity', hue: 'hue-rotate' }[prop] || prop;
    stops = parseStops(stops);

    return (css, percent) => {
        const value = getValue(stops, percent);
        css.filter += ` ${prop}(${value + unit})`;
    };
}

function cssPropFn(prop, el, stops) {
    if (stops.length === 1) {
        stops.unshift(getCssValue(el, prop, ''));
    }

    stops = parseStops(stops);

    return (css, percent) => {
        css[prop] = getValue(stops, percent);
    };
}

function strokeFn(prop, el, stops) {
    if (stops.length === 1) {
        stops.unshift(0);
    }

    const unit = getUnit(stops);
    const length = getMaxPathLength(el);
    stops = parseStops(stops.reverse(), (stop) => {
        stop = toFloat(stop);
        return unit === '%' ? (stop * length) / 100 : stop;
    });

    if (!stops.some(([value]) => value)) {
        return noop;
    }

    css(el, 'strokeDasharray', length);

    return (css, percent) => {
        css.strokeDashoffset = getValue(stops, percent);
    };
}

function backgroundFn(prop, el, stops) {
    if (stops.length === 1) {
        stops.unshift(0);
    }

    prop = prop.substr(-1);
    const attr = prop === 'y' ? 'height' : 'width';
    stops = parseStops(stops, (stop) => toPx(stop, attr, el));

    const bgPos = getCssValue(el, `background-position-${prop}`, '');

    return getCssValue(el, 'backgroundSize', '') === 'cover'
        ? backgroundCoverFn(prop, el, stops, bgPos, attr)
        : setBackgroundPosFn(prop, stops, bgPos);
}

function backgroundCoverFn(prop, el, stops, bgPos, attr) {
    const dimImage = getBackgroundImageDimensions(el);

    if (!dimImage.width) {
        return noop;
    }

    const values = stops.map(([value]) => value);
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

    const fn = setBackgroundPosFn(prop, stops, `${pos}px`);
    return (css, percent) => {
        fn(css, percent);
        css.backgroundSize = `${dim.width}px ${dim.height}px`;
        css.backgroundRepeat = 'no-repeat';
    };
}

function setBackgroundPosFn(prop, stops, pos) {
    return function (css, percent) {
        css[`background-position-${prop}`] = `calc(${pos} + ${getValue(stops, percent)}px)`;
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

function parseStops(stops, fn = toFloat) {
    const result = [];
    const { length } = stops;
    let nullIndex = 0;
    for (let i = 0; i < length; i++) {
        let [value, percent] = isString(stops[i]) ? stops[i].trim().split(' ') : [stops[i]];
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

function getStop(stops, percent) {
    const index = findIndex(stops.slice(1), ([, targetPercent]) => percent <= targetPercent) + 1;
    return [
        stops[index - 1][0],
        stops[index][0],
        (percent - stops[index - 1][1]) / (stops[index][1] - stops[index - 1][1]),
    ];
}

function getValue(stops, percent) {
    const [start, end, p] = getStop(stops, percent);
    return isNumber(start) ? start + Math.abs(start - end) * p * (start < end ? 1 : -1) : +end;
}

const unitRe = /^-?\d+(\S*)/;
function getUnit(stops, defaultUnit) {
    for (const stop of stops) {
        const match = stop.match?.(unitRe);
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
