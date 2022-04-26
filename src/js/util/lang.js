const { hasOwnProperty, toString } = Object.prototype;

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

const hyphenateRe = /\B([A-Z])/g;

export const hyphenate = memoize((str) => str.replace(hyphenateRe, '-$1').toLowerCase());

const camelizeRe = /-(\w)/g;

export const camelize = memoize((str) => str.replace(camelizeRe, toUpper));

export const ucfirst = memoize((str) =>
    str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : ''
);

function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
}

export function startsWith(str, search) {
    return str?.startsWith?.(search);
}

export function endsWith(str, search) {
    return str?.endsWith?.(search);
}

export function includes(obj, search) {
    return obj?.includes?.(search);
}

export function findIndex(array, predicate) {
    return array?.findIndex?.(predicate);
}

export const { isArray, from: toArray } = Array;
export const { assign } = Object;

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}

export function isWindow(obj) {
    return isObject(obj) && obj === obj.window;
}

export function isDocument(obj) {
    return nodeType(obj) === 9;
}

export function isNode(obj) {
    return nodeType(obj) >= 1;
}

export function isElement(obj) {
    return nodeType(obj) === 1;
}

function nodeType(obj) {
    return !isWindow(obj) && isObject(obj) && obj.nodeType;
}

export function isBoolean(value) {
    return typeof value === 'boolean';
}

export function isString(value) {
    return typeof value === 'string';
}

export function isNumber(value) {
    return typeof value === 'number';
}

export function isNumeric(value) {
    return isNumber(value) || (isString(value) && !isNaN(value - parseFloat(value)));
}

export function isEmpty(obj) {
    return !(isArray(obj) ? obj.length : isObject(obj) ? Object.keys(obj).length : false);
}

export function isUndefined(value) {
    return value === void 0;
}

export function toBoolean(value) {
    return isBoolean(value)
        ? value
        : value === 'true' || value === '1' || value === ''
        ? true
        : value === 'false' || value === '0'
        ? false
        : value;
}

export function toNumber(value) {
    const number = Number(value);
    return isNaN(number) ? false : number;
}

export function toFloat(value) {
    return parseFloat(value) || 0;
}

export function toNode(element) {
    return toNodes(element)[0];
}

export function toNodes(element) {
    return (element && (isNode(element) ? [element] : Array.from(element).filter(isNode))) || [];
}

export function toWindow(element) {
    if (isWindow(element)) {
        return element;
    }

    element = toNode(element);
    const document = isDocument(element) ? element : element?.ownerDocument;

    return document?.defaultView || window;
}

export function isEqual(value, other) {
    return (
        value === other ||
        (isObject(value) &&
            isObject(other) &&
            Object.keys(value).length === Object.keys(other).length &&
            each(value, (val, key) => val === other[key]))
    );
}

export function swap(value, a, b) {
    return value.replace(new RegExp(`${a}|${b}`, 'g'), (match) => (match === a ? b : a));
}

export function last(array) {
    return array[array.length - 1];
}

export function each(obj, cb) {
    for (const key in obj) {
        if (false === cb(obj[key], key)) {
            return false;
        }
    }
    return true;
}

export function sortBy(array, prop) {
    return array
        .slice()
        .sort(({ [prop]: propA = 0 }, { [prop]: propB = 0 }) =>
            propA > propB ? 1 : propB > propA ? -1 : 0
        );
}

export function uniqueBy(array, prop) {
    const seen = new Set();
    return array.filter(({ [prop]: check }) => (seen.has(check) ? false : seen.add(check)));
}

export function clamp(number, min = 0, max = 1) {
    return Math.min(Math.max(toNumber(number) || 0, min), max);
}

export function noop() {}

export function intersectRect(...rects) {
    return [
        ['bottom', 'top'],
        ['right', 'left'],
    ].every(
        ([minProp, maxProp]) =>
            Math.min(...rects.map(({ [minProp]: min }) => min)) -
                Math.max(...rects.map(({ [maxProp]: max }) => max)) >
            0
    );
}

export function pointInRect(point, rect) {
    return (
        point.x <= rect.right &&
        point.x >= rect.left &&
        point.y <= rect.bottom &&
        point.y >= rect.top
    );
}

function ratio(dimensions, prop, value) {
    const aProp = prop === 'width' ? 'height' : 'width';

    return {
        [aProp]: dimensions[prop]
            ? Math.round((value * dimensions[aProp]) / dimensions[prop])
            : dimensions[aProp],
        [prop]: value,
    };
}

function contain(dimensions, maxDimensions) {
    dimensions = { ...dimensions };

    for (const prop in dimensions) {
        dimensions =
            dimensions[prop] > maxDimensions[prop]
                ? ratio(dimensions, prop, maxDimensions[prop])
                : dimensions;
    }

    return dimensions;
}

function cover(dimensions, maxDimensions) {
    dimensions = contain(dimensions, maxDimensions);

    for (const prop in dimensions) {
        dimensions =
            dimensions[prop] < maxDimensions[prop]
                ? ratio(dimensions, prop, maxDimensions[prop])
                : dimensions;
    }

    return dimensions;
}

export const Dimensions = { ratio, contain, cover };

export function getIndex(i, elements, current = 0, finite = false) {
    elements = toNodes(elements);

    const { length } = elements;

    if (!length) {
        return -1;
    }

    i = isNumeric(i)
        ? toNumber(i)
        : i === 'next'
        ? current + 1
        : i === 'previous'
        ? current - 1
        : elements.indexOf(toNode(i));

    if (finite) {
        return clamp(i, 0, length - 1);
    }

    i %= length;

    return i < 0 ? i + length : i;
}

export function memoize(fn) {
    const cache = Object.create(null);
    return (key) => cache[key] || (cache[key] = fn(key));
}

export class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
