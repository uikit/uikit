import $ from 'jquery';

export {$, each, extend, map, merge, isArray, isFunction, isPlainObject} from 'jquery';

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

var classifyRE = /(?:^|[-_\/])(\w)/g;
export function classify(str) {
    return str.replace(classifyRE, (_, c) => c ? c.toUpperCase() : '');
}

var hyphenateRE = /([a-z\d])([A-Z])/g;
export function hyphenate (str) {
    return str
        .replace(hyphenateRE, '$1-$2')
        .toLowerCase()
}

var camelizeRE = /-(\w)/g;
export function camelize (str) {
    return str.replace(camelizeRE, toUpper)
}

function toUpper (_, c) {
    return c ? c.toUpperCase() : ''
}

export function isString(value) {
    return typeof value === 'string';
}

export function toBoolean(value) {
    return typeof value === 'boolean'
        ? value
        : value === 'true' || value == '1' || value === ''
            ? true
            : value === 'false' || value == '0'
                ? false
                : value;
}

export function toNumber(value) {
    var number = Number(value);
    return !isNaN(number) ? number : false;
}

export function toJQuery(element, context) {
    if (element === true) {
        return null;
    }

    try {
        element = $(element, context);
    } catch (e) {
        return null;
    }

    return element.length ? element : null;
}

export function coerce(type, value) {

    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'jQuery') {
        return toJQuery(value);
    }

    return type ? type(value) : value;
}
