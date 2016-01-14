export {extend} from 'jquery';

export const isArray = Array.isArray;

export function bind (fn, thisArg) {
    return function (a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(thisArg, arguments) : fn.call(thisArg, a) : fn.call(thisArg);
    };
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
};

var classifyRE = /(?:^|[-_\/])(\w)/g
export function classify (str) {
    return str.replace(classifyRE, (_, c) => c ? c.toUpperCase() : '');
}
