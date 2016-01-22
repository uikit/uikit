export {each, extend, map, merge, type, isArray, isFunction, unique} from 'jquery';

export function bind (fn, thisArg) {
    return function (a) {
        let l = arguments.length;
        return l ? l > 1 ? fn.apply(thisArg, arguments) : fn.call(thisArg, a) : fn.call(thisArg);
    };
}

let hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
}

let classifyRE = /(?:^|[-_\/])(\w)/g
export function classify (str) {
    return str.replace(classifyRE, (_, c) => c ? c.toUpperCase() : '');
}

export function uuid() {

    let rs = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return [rs(),rs(),rs(),rs(),rs(),rs(),rs(),rs()].join('-');
}

export function str2json(str) {
    try {
        return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
    } catch(e) { return {}; }
}

export function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
