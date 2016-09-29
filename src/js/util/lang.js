import $ from 'jquery';
import { getCssVar } from './index';

export {$};
export {ajax, each, extend, map, merge, isArray, isFunction, isPlainObject} from 'jquery';

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

export function isNumber(value) {
    return typeof value === 'number';
}

export function isContextSelector(selector) {
    return isString(selector) && selector.match(/^(!|>|\+|-)/);
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

var contextSelectors = { '!': 'closest', '>': 'find', '+': 'nextAll', '-': 'prevAll'};
export function toJQuery(element, context) {

    if (element === true) {
        return null;
    }

    try {

        if (context && isContextSelector(element)) {
            element = $(context)[contextSelectors[element[0]]](element.substr(1));
        } else {
            element = $(element, context);
        }

    } catch (e) {
        return null;
    }

    return element.length ? element : null;
}

var vars = {};
export function toMedia(value) {
    if (isString(value) && value[0] == '@') {
        var name = `media-${value.substr(1)}`;
        value = vars[name] || (vars[name] = parseFloat(getCssVar(name)));
    }

    return value && !isNaN(value) ? `(min-width: ${value}px)` : false;
}

export function coerce(type, value, context) {

    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'jQuery') {
        return toJQuery(value, isContextSelector(value) ? context : undefined);
    } else if (type === 'media') {
        return toMedia(value);
    }

    return type ? type(value) : value;
}
