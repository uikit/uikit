import Media from '../mixin/media';
import {getMaxPathLength} from '../core/svg';
import {css, Dimensions, each, isNumber, isString, isUndefined, noop, startsWith, toFloat, toPx, ucfirst} from 'uikit-util';

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
    bgy: backgroundFn
};

const {keys} = Object;

export default {

    mixins: [Media],

    props: fillObject(keys(props), 'list'),

    data: fillObject(keys(props), undefined),

    computed: {

        props(properties, $el) {
            return keys(props).reduce((result, prop) => {
                if (!isUndefined(properties[prop])) {
                    result[prop] = props[prop].call(this, prop, $el, properties[prop].slice());
                }
                return result;
            }, {});
        }

    },

    methods: {

        reset() {
            each(this.getCss(0), (_, prop) => css(this.$el, prop, ''));
        },

        getCss(percent) {
            return keys(this.props).reduce((css, prop) => {
                this.props[prop](css, percent);
                return css;
            }, {transform: '', filter: ''});
        }

    }

};

function transformFn(prop, el, steps) {

    const unit = getUnit(steps) || {x: 'px', y: 'px', rotate: 'deg'}[prop] || '';

    if (prop === 'x' || prop === 'y') {
        prop = `translate${ucfirst(prop)}`;
    }

    steps = steps.map(toFloat);

    if (steps.length === 1) {
        steps.unshift(prop === 'scale' ? 1 : 0);
    }

    return (css, percent) => {
        let value = getValue(steps, percent);

        if (startsWith(prop, 'translate')) {
            value = toFloat(value).toFixed(unit === 'px' ? 0 : 6);
        }

        css.transform += ` ${prop}(${value}${unit})`;
    };
}

function colorFn(prop, el, steps) {

    if (steps.length === 1) {
        steps.unshift(getCssValue(el, prop, ''));
    }

    steps = steps.map(step => parseColor(el, step));

    return (css, percent) => {

        const [start, end, p] = getStep(steps, percent);
        const value = start.map((value, i) => {
            value += p * (end[i] - value);
            return i === 3 ? toFloat(value) : parseInt(value, 10);
        }).join(',');
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

    const unit = getUnit(steps) || {blur: 'px', hue: 'deg'}[prop] || '%';
    prop = {fopacity: 'opacity', hue: 'hue-rotate'}[prop] || prop;
    steps = steps.map(toFloat);

    return (css, percent) => {
        const value = getValue(steps, percent);
        css.filter += ` ${prop}(${value + unit})`;
    };
}

function cssPropFn(prop, el, steps) {

    if (steps.length === 1) {
        steps.unshift(getCssValue(el, prop, ''));
    }

    steps = steps.map(toFloat);

    return (css, percent) => {
        css[prop] = getValue(steps, percent);
    };
}

function strokeFn(prop, el, steps) {

    if (steps.length === 1) {
        steps.unshift(0);
    }

    const unit = getUnit(steps);
    steps = steps.map(toFloat);

    if (!steps.some(step => step)) {
        return noop;
    }

    const length = getMaxPathLength(el);
    css(el, 'strokeDasharray', length);

    if (unit === '%') {
        steps = steps.map(step => step * length / 100);
    }

    steps = steps.reverse();

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
    steps = steps.map(step => toPx(step, attr, el));

    css(el, `background-position-${prop}`, '');
    const bgPos = css(el, 'backgroundPosition').split(' ')[prop === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

    return getCssValue(el, 'backgroundSize', '') === 'cover'
        ? backgroundCoverFn.call(this, prop, el, steps, bgPos, attr)
        : setBackgroundPosFn(prop, steps, bgPos);
}

function backgroundCoverFn(prop, el, steps, bgPos, attr) {

    const image = getBackgroundImage.call(this, el);

    if (!image.naturalWidth) {
        return noop;
    }

    const min = Math.min(...steps);
    const max = Math.max(...steps);
    const down = steps.indexOf(min) < steps.indexOf(max);

    const diff = max - min;
    let pos = (down ? -diff : 0) - (down ? min : max);

    const dimEl = {
        width: el.offsetWidth,
        height: el.offsetHeight
    };

    const dimImage = {
        width: image.naturalWidth,
        height: image.naturalHeight
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

function getBackgroundImage(el) {
    const src = css(el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

    const data = this._data;

    if (data[src]) {
        return data[src];
    }

    if (src) {
        const img = new Image();
        img.src = src;
        if (!img.naturalWidth) {
            img.onload = () => this.$update();
        }

        return data[src] = img;
    }
}

function getStep(steps, percent) {
    const count = steps.length - 1;
    const index = Math.min(Math.floor(count * percent), count - 1);

    return steps
        .slice(index, index + 2)
        .concat(percent === 1 ? 1 : percent % (1 / count) * count);
}

function getValue(steps, percent) {
    const [start, end, p] = getStep(steps, percent);
    return isNumber(start)
        ? start + Math.abs(start - end) * p * (start < end ? 1 : -1)
        : +end;
}

function getUnit(steps, defaultUnit) {
    return steps.reduce((unit, step) => unit || isString(step) && step.replace(/[\d-]/g, '').trim(), '') || defaultUnit;
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
