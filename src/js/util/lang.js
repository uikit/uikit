import $, { isArray } from 'jquery';
import { getCssVar, hasPromise, isJQuery, query } from './index';

export { $ };
export { ajax, contains, each, Event, extend, map, merge, isArray, isNumeric, isFunction, isPlainObject } from 'jquery';

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

export function promise(executor) {

    if (hasPromise) {
        return new Promise(executor);
    }

    var def = $.Deferred();

    executor(def.resolve, def.reject);

    return def;
}

promise.resolve = function (value) {
    return promise(function (resolve) {
        resolve(value);
    });
};

promise.reject = function (value) {
    return promise(function (_, reject) {
        reject(value);
    });
};

promise.all = function (iterable) {
    return hasPromise
        ? Promise.all(iterable)
        : $.when.apply($, iterable);
};

export function classify(str) {
    return str.replace(/(?:^|[-_\/])(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

export function hyphenate(str) {
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

const camelizeRE = /-(\w)/g;
export function camelize(str) {
    return str.replace(camelizeRE, toUpper)
}

function toUpper(_, c) {
    return c ? c.toUpperCase() : ''
}

export function isString(value) {
    return typeof value === 'string';
}

export function isNumber(value) {
    return typeof value === 'number';
}

export function isUndefined(value) {
    return value === undefined;
}

export function isContextSelector(selector) {
    return isString(selector) && selector.match(/^[!>+-]/);
}

export function getContextSelectors(selector) {
    return isContextSelector(selector) && selector.split(/(?=\s[!>+-])/g).map(value => value.trim());
}

const contextSelectors = {'!': 'closest', '+': 'nextAll', '-': 'prevAll'};
export function toJQuery(element, context) {

    if (element === true) {
        return null;
    }

    try {

        if (context && isContextSelector(element) && element[0] !== '>') {

            var fn = contextSelectors[element[0]], selector = element.substr(1);

            context = $(context);

            if (fn === 'closest') {
                context = context.parent();
                selector = selector || '*';
            }

            element = context[fn](selector);

        } else {
            element = $(element, context);
        }

    } catch (e) {
        return null;
    }

    return element.length ? element : null;
}

export function toNode(element) {
    return element && (isJQuery(element) ? element[0] : element);
}

export function toBoolean(value) {
    return typeof value === 'boolean'
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

export function toList(value) {
    return isArray(value)
        ? value
        : isString(value)
            ? value.split(',').map(value => toBoolean(value.trim()))
            : [value];
}

var vars = {};
export function toMedia(value) {

    if (isString(value)) {
        if (value[0] === '@') {
            var name = `media-${value.substr(1)}`;
            value = vars[name] || (vars[name] = parseFloat(getCssVar(name)));
        } else if (value.match(/^\(min-width:/)) {
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
    } else if (type === 'jQuery') {
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
        : time.substr(-2) === 'ms'
            ? parseFloat(time)
            : parseFloat(time) * 1000;
}

export function swap(value, a, b) {
    return value.replace(new RegExp(`${a}|${b}`, 'mg'), function (match) {
        return match === a ? b : a
    });
}
