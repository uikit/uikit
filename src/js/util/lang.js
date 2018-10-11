export function bind(fn, context) {
    return function (a) {
        const l = arguments.length;
        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
    };
}

const objPrototype = Object.prototype;
const {hasOwnProperty} = objPrototype;

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

const hyphenateCache = {};
const hyphenateRe = /([a-z\d])([A-Z])/g;

export function hyphenate(str) {

    if (!(str in hyphenateCache)) {
        hyphenateCache[str] = str
            .replace(hyphenateRe, '$1-$2')
            .toLowerCase();
    }

    return hyphenateCache[str];
}

const camelizeRe = /-(\w)/g;

export function camelize(str) {
    return str.replace(camelizeRe, toUpper);
}

function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
}

export function ucfirst(str) {
    return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
}

const strPrototype = String.prototype;
const startsWithFn = strPrototype.startsWith || function (search) { return this.lastIndexOf(search, 0) === 0; };

export function startsWith(str, search) {
    return startsWithFn.call(str, search);
}

const endsWithFn = strPrototype.endsWith || function (search) { return this.substr(-search.length) === search; };

export function endsWith(str, search) {
    return endsWithFn.call(str, search);
}

const includesFn = function (search) { return ~this.indexOf(search); };
const includesStr = strPrototype.includes || includesFn;
const includesArray = Array.prototype.includes || includesFn;

export function includes(obj, search) {
    return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
}

export const {isArray} = Array;

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) === objPrototype;
}

export function isWindow(obj) {
    return isObject(obj) && obj === obj.window;
}

export function isDocument(obj) {
    return isObject(obj) && obj.nodeType === 9;
}

export function isJQuery(obj) {
    return isObject(obj) && !!obj.jquery;
}

export function isNode(obj) {
    return obj instanceof Node || isObject(obj) && obj.nodeType >= 1;
}

const {toString} = objPrototype;
export function isNodeCollection(obj) {
    return toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
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
    return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
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
    return !isNaN(number) ? number : false;
}

export function toFloat(value) {
    return parseFloat(value) || 0;
}

export function toNode(element) {
    return isNode(element) || isWindow(element) || isDocument(element)
        ? element
        : isNodeCollection(element) || isJQuery(element)
            ? element[0]
            : isArray(element)
                ? toNode(element[0])
                : null;
}

const arrayProto = Array.prototype;
export function toNodes(element) {
    return isNode(element)
        ? [element]
        : isNodeCollection(element)
            ? arrayProto.slice.call(element)
            : isArray(element)
                ? element.map(toNode).filter(Boolean)
                : isJQuery(element)
                    ? element.toArray()
                    : [];
}

export function toList(value) {
    return isArray(value)
        ? value
        : isString(value)
            ? value.split(/,(?![^(]*\))/).map(value => isNumeric(value)
                ? toNumber(value)
                : toBoolean(value.trim()))
            : [value];
}

export function toMs(time) {
    return !time
        ? 0
        : endsWith(time, 'ms')
            ? toFloat(time)
            : toFloat(time) * 1000;
}

export function swap(value, a, b) {
    return value.replace(new RegExp(`${a}|${b}`, 'mg'), match => {
        return match === a ? b : a;
    });
}

export const assign = Object.assign || function (target, ...args) {
    target = Object(target);
    for (let i = 0; i < args.length; i++) {
        const source = args[i];
        if (source !== null) {
            for (const key in source) {
                if (hasOwn(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
};

export function each(obj, cb) {
    for (const key in obj) {
        cb.call(obj[key], obj[key], key);
    }
}

export function sortBy(collection, prop) {
    return collection.sort(({[prop]: propA = 0}, {[prop]: propB = 0}) =>
        propA > propB
            ? 1
            : propB > propA
                ? -1
                : 0
    );
}

export function clamp(number, min = 0, max = 1) {
    return Math.min(Math.max(toNumber(number) || 0, min), max);
}

export function noop() {}

export function intersectRect(r1, r2) {
    return r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top;
}

export function pointInRect(point, rect) {
    return point.x <= rect.right &&
        point.x >= rect.left &&
        point.y <= rect.bottom &&
        point.y >= rect.top;
}

export const Dimensions = {

    ratio(dimensions, prop, value) {

        const aProp = prop === 'width' ? 'height' : 'width';

        return {
            [aProp]: dimensions[prop] ? Math.round(value * dimensions[aProp] / dimensions[prop]) : dimensions[aProp],
            [prop]: value
        };
    },

    contain(dimensions, maxDimensions) {
        dimensions = assign({}, dimensions);

        each(dimensions, (_, prop) => dimensions = dimensions[prop] > maxDimensions[prop]
            ? this.ratio(dimensions, prop, maxDimensions[prop])
            : dimensions
        );

        return dimensions;
    },

    cover(dimensions, maxDimensions) {
        dimensions = this.contain(dimensions, maxDimensions);

        each(dimensions, (_, prop) => dimensions = dimensions[prop] < maxDimensions[prop]
            ? this.ratio(dimensions, prop, maxDimensions[prop])
            : dimensions
        );

        return dimensions;
    }

};
