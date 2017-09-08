import { getCssVar, query } from './index';
import promiseFn from './promise';

export function bind(fn, context) {
    return function (a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
    };
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

export const Promise = 'Promise' in window ? window.Promise : promiseFn;

const classifyRe = /(?:^|[-_\/])(\w)/g;

export function classify(str) {
    return str.replace(classifyRe, (_, c) => c ? c.toUpperCase() : '');
}

const hyphenateRe = /([a-z\d])([A-Z])/g;

export function hyphenate(str) {
    return str
        .replace(hyphenateRe, '$1-$2')
        .toLowerCase()
}

const camelizeRE = /-(\w)/g;

export function camelize(str) {
    return str.replace(camelizeRE, toUpper)
}

function toUpper(_, c) {
    return c ? c.toUpperCase() : ''
}

export function ucfirst(str) {
    return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
}

var strPrototype = String.prototype;
var startsWithFn = strPrototype.startsWith || function (search) { return this.lastIndexOf(search, 0) === 0; };

export function startsWith(str, search) {
    return startsWithFn.call(str, search);
}

var endsWithFn = strPrototype.endsWith || function (search) { return this.substr(-1 * search.length) === search; };

export function endsWith(str, search) {
    return endsWithFn.call(str, search);
}

var includesFn = function (search) { return ~this.indexOf(search); };
var includesStr = strPrototype.includes || includesFn;
var includesArray = Array.prototype.includes || includesFn;

export function includes(obj, search) {
    return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
}

export const isArray = Array.isArray;

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

export function isWindow(obj) {
    return isObject(obj) && obj === obj.window;
}

export function isDocument(obj) {
    return isObject(obj) && obj.nodeType === 9;
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
    var number = Number(value);
    return !isNaN(number) ? number : false;
}

export function toFloat(value) {
    return parseFloat(value) || 0;
}

export function toList(value) {
    return isArray(value)
        ? value
        : isString(value)
            ? value.split(',').map(value => isNumeric(value)
                ? toNumber(value)
                : toBoolean(value.trim()))
            : [value];
}

var vars = {};

export function toMedia(value) {

    if (isString(value)) {
        if (value[0] === '@') {
            var name = `media-${value.substr(1)}`;
            value = vars[name] || (vars[name] = toFloat(getCssVar(name)));
        } else if (isNaN(value)) {
            return value;
        }
    }

    return value && !isNaN(value) ? `(min-width: ${value}px)` : false;
}

export function coerce(type, value, context) {

    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'query') {
        return query(value, context);
    } else if (type === 'list') {
        return toList(value);
    } else if (type === 'media') {
        return toMedia(value);
    }

    return type ? type(value) : value;
}

export function toMs(time) {
    return !time
        ? 0
        : endsWith(time, 'ms')
            ? toFloat(time)
            : toFloat(time) * 1000;
}

export function swap(value, a, b) {
    return value.replace(new RegExp(`${a}|${b}`, 'mg'), function (match) {
        return match === a ? b : a
    });
}

export const assign = Object.assign || function (target, ...args) {
    target = Object(target);
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        if (source !== null) {
            for (var key in source) {
                if (hasOwn(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
};

export function each(obj, cb) {
    for (var key in obj) {
        if (cb.call(obj[key], obj[key], key) === false) {
            break;
        }
    }
}

export function clamp(number, min = 0, max = 1) {
    return Math.min(Math.max(number, min), max);
}

export function noop() {}

export function intersectRect(r1, r2) {
    return r1.left <= r2.right &&
        r2.left <= r1.right &&
        r1.top <= r2.bottom &&
        r2.top <= r1.bottom;
}

export function pointInRect(point, rect) {
    return intersectRect({top: point.y, bottom: point.y, left: point.x, right: point.x}, rect)
}

export function ajax(url, options) {
    return new Promise((resolve, reject) => {

        var env = assign({
            url: url,
            data: null,
            method: 'GET',
            headers: {},
            xhr: new XMLHttpRequest(),
            beforeSend: noop,
            responseType: ''
        }, options);

        env.beforeSend(env);

        env.xhr.open(env.method, env.url);
        env.xhr.responseType = env.responseType;

        env.xhr.onload = function() {
            if (this.status === 0 || this.status >= 200 && this.status < 300 || this.status === 304) {
                resolve(this);
            }
            else {
                reject(assign(Error(this.statusText), {
                    xhr: this,
                    status: this.status
                }));
            }
        };

        env.xhr.onerror = function() {
            reject(assign(Error('Network Error'), {xhr: this}));
        };

        env.xhr.ontimeout = function() {
            reject(assign(Error('Network Timeout'), {xhr: this}));
        };

        env.xhr.send(env.data);
    })
}