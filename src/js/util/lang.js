export {each, extend, map, merge, type, isArray, isFunction, isPlainObject} from 'jquery';

export const Observer = window.MutationObserver || window.WebKitMutationObserver;

export function bind (fn, context) {
    return function (a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
    };
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
}

var classifyRE = /(?:^|[-_\/])(\w)/g
export function classify (str) {
    return str.replace(classifyRE, (_, c) => c ? c.toUpperCase() : '');
}

export function str2json(str) {
    try {
        return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
    } catch(e) { return {}; }
}

export function debounce(fn, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) fn.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(context, args);
    };
}
