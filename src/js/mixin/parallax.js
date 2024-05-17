import {
    clamp,
    createEvent,
    css,
    Dimensions,
    findIndex,
    isString,
    isUndefined,
    noop,
    once,
    propName,
    toFloat,
    toPx,
    trigger,
    ucfirst,
} from 'uikit-util';
import Media from '../mixin/media';
import { getMaxPathLength } from '../util/svg';

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
            const stops = {};
            for (const prop in properties) {
                if (prop in props && !isUndefined(properties[prop])) {
                    stops[prop] = properties[prop].slice();
                }
            }
            const result = {};
            for (const prop in stops) {
                result[prop] = props[prop](prop, $el, stops[prop], stops);
            }
            return result;
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
            const css = {};
            for (const prop in this.props) {
                this.props[prop](css, clamp(percent));
            }
            css.willChange = Object.keys(css).map(propName).join(',');
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
            getUnit([stop])
                ? toPx(stop, 'width', el, true) /
                  el[`offset${stop.endsWith?.('vh') ? 'Height' : 'Width'}`]
                : toFloat(stop);
    }

    if (stops.length === 1) {
        stops.unshift(prop === 'scale' ? 1 : 0);
    }

    stops = parseStops(stops, transformFn);

    return (css, percent) => {
        css.transform = `${css.transform || ''} ${prop}(${getValue(stops, percent)}${unit})`;
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
        css.filter = `${css.filter || ''} ${prop}(${value + unit})`;
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

function backgroundFn(prop, el, stops, props) {
    if (stops.length === 1) {
        stops.unshift(0);
    }

    const attr = prop === 'bgy' ? 'height' : 'width';
    props[prop] = parseStops(stops, (stop) => toPx(stop, attr, el));

    const bgProps = ['bgx', 'bgy'].filter((prop) => prop in props);
    if (bgProps.length === 2 && prop === 'bgx') {
        return noop;
    }

    if (getCssValue(el, 'backgroundSize', '') === 'cover') {
        return backgroundCoverFn(prop, el, stops, props);
    }

    const positions = {};
    for (const prop of bgProps) {
        positions[prop] = getBackgroundPos(el, prop);
    }

    return setBackgroundPosFn(bgProps, positions, props);
}

function backgroundCoverFn(prop, el, stops, props) {
    const dimImage = getBackgroundImageDimensions(el);

    if (!dimImage.width) {
        return noop;
    }

    const dimEl = {
        width: el.offsetWidth,
        height: el.offsetHeight,
    };

    const bgProps = ['bgx', 'bgy'].filter((prop) => prop in props);

    const positions = {};
    for (const prop of bgProps) {
        const values = props[prop].map(([value]) => value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const down = values.indexOf(min) < values.indexOf(max);
        const diff = max - min;

        positions[prop] = `${(down ? -diff : 0) - (down ? min : max)}px`;
        dimEl[prop === 'bgy' ? 'height' : 'width'] += diff;
    }

    const dim = Dimensions.cover(dimImage, dimEl);

    for (const prop of bgProps) {
        const attr = prop === 'bgy' ? 'height' : 'width';
        const overflow = dim[attr] - dimEl[attr];
        positions[prop] = `max(${getBackgroundPos(el, prop)},-${overflow}px) + ${positions[prop]}`;
    }

    const fn = setBackgroundPosFn(bgProps, positions, props);
    return (css, percent) => {
        fn(css, percent);
        css.backgroundSize = `${dim.width}px ${dim.height}px`;
        css.backgroundRepeat = 'no-repeat';
    };
}

function getBackgroundPos(el, prop) {
    return getCssValue(el, `background-position-${prop.slice(-1)}`, '');
}

function setBackgroundPosFn(bgProps, positions, props) {
    return function (css, percent) {
        for (const prop of bgProps) {
            const value = getValue(props[prop], percent);
            css[`background-position-${prop.slice(-1)}`] = `calc(${positions[prop]} + ${value}px)`;
        }
    };
}

const loading = {};
const dimensions = {};
function getBackgroundImageDimensions(el) {
    const src = css(el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

    if (dimensions[src]) {
        return dimensions[src];
    }

    const image = new Image();
    if (src) {
        image.src = src;

        if (!image.naturalWidth && !loading[src]) {
            once(image, 'error load', () => {
                dimensions[src] = toDimensions(image);
                trigger(el, createEvent('load', false));
            });
            loading[src] = true;

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
        let [value, percent] = isString(stops[i])
            ? stops[i].trim().split(/ (?![^(]*\))/)
            : [stops[i]];
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
    return start + Math.abs(start - end) * p * (start < end ? 1 : -1);
}

const unitRe = /^-?\d+(?:\.\d+)?(\S+)?/;
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

/*
 * Inspired by https://gist.github.com/gre/1650294?permalink_comment_id=3477425#gistcomment-3477425
 *
 * linear: 0
 * easeInSine: 0.5
 * easeOutSine: -0.5
 * easeInQuad: 1
 * easeOutQuad: -1
 * easeInCubic: 2
 * easeOutCubic: -2
 * easeInQuart: 3
 * easeOutQuart: -3
 * easeInQuint: 4
 * easeOutQuint: -4
 */
export function ease(percent, easing) {
    return easing >= 0 ? Math.pow(percent, easing + 1) : 1 - Math.pow(1 - percent, 1 - easing);
}
