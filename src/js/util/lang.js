export {each, extend, map, merge, isArray, isFunction, isPlainObject} from 'jquery';

export const debounce = require('lodash.debounce');
export const throttle = require('lodash.throttle');

export const Observer = window.MutationObserver || window.WebKitMutationObserver;

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

var classifyRE = /(?:^|[-_\/])(\w)/g
export function classify(str) {
    return str.replace(classifyRE, (_, c) => c ? c.toUpperCase() : '');
}

export function toBoolean(value) {
    return typeof value === 'boolean'
        ? value
        : value === 'true' || value == '1'
            ? true
            : value === 'false' || value == '0'
                ? false
                : value;
}

export function coerce(type, value) {

    if (type === Boolean) {
        value = toBoolean(value);
    }

    return type ? type(value) : value;
}
