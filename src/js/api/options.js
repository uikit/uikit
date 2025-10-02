import {
    hasOwn,
    includes,
    isArray,
    isFunction,
    isNumeric,
    isString,
    isUndefined,
    sortBy,
    startsWith,
    toBoolean,
    toNumber,
} from 'uikit-util';

const strats = {};

strats.events =
    strats.watch =
    strats.observe =
    strats.created =
    strats.beforeConnect =
    strats.connected =
    strats.beforeDisconnect =
    strats.disconnected =
    strats.destroy =
        concatStrat;

// args strategy
strats.args = function (parentVal, childVal) {
    return childVal !== false && concatStrat(childVal || parentVal);
};

// update strategy
strats.update = function (parentVal, childVal) {
    return sortBy(
        concatStrat(parentVal, isFunction(childVal) ? { read: childVal } : childVal),
        'order',
    );
};

// property strategy
strats.props = function (parentVal, childVal) {
    if (isArray(childVal)) {
        const value = {};
        for (const key of childVal) {
            value[key] = String;
        }
        childVal = value;
    }

    return strats.methods(parentVal, childVal);
};

// extend strategy
strats.computed = strats.methods = function (parentVal, childVal) {
    return childVal ? (parentVal ? { ...parentVal, ...childVal } : childVal) : parentVal;
};

// data strategy
strats.i18n = strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
        if (!childVal) {
            return parentVal;
        }

        if (!parentVal) {
            return childVal;
        }

        return function (vm) {
            return mergeFnData(parentVal, childVal, vm);
        };
    }

    return mergeFnData(parentVal, childVal, vm);
};

function mergeFnData(parentVal, childVal, vm) {
    return strats.computed(
        isFunction(parentVal) ? parentVal.call(vm, vm) : parentVal,
        isFunction(childVal) ? childVal.call(vm, vm) : childVal,
    );
}

// concat strategy
function concatStrat(parentVal, childVal) {
    parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;

    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
              ? childVal
              : [childVal]
        : parentVal;
}

// default strategy
function defaultStrat(parentVal, childVal) {
    return isUndefined(childVal) ? parentVal : childVal;
}

export function mergeOptions(parent, child, vm) {
    const options = {};

    if (isFunction(child)) {
        child = child.options;
    }

    if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
    }

    if (child.mixins) {
        for (const mixin of child.mixins) {
            parent = mergeOptions(parent, mixin, vm);
        }
    }

    for (const key in parent) {
        mergeKey(key);
    }

    for (const key in child) {
        if (!hasOwn(parent, key)) {
            mergeKey(key);
        }
    }

    function mergeKey(key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], vm);
    }

    return options;
}

export function parseOptions(options, args = []) {
    try {
        return options
            ? startsWith(options, '{')
                ? JSON.parse(options)
                : args.length && !includes(options, ':')
                  ? { [args[0]]: options }
                  : options.split(';').reduce((options, option) => {
                        const [key, value] = option.split(/:(.*)/);
                        if (key && !isUndefined(value)) {
                            options[key.trim()] = value.trim();
                        }
                        return options;
                    }, {})
            : {};
    } catch {
        return {};
    }
}

export function coerce(type, value) {
    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'list') {
        return toList(value);
    } else if (type === Object && isString(value)) {
        return parseOptions(value);
    }

    return type ? type(value) : value;
}

const listRe = /,(?![^(]*\))/;
function toList(value) {
    return isArray(value)
        ? value
        : isString(value)
          ? value
                .split(listRe)
                .map((value) => (isNumeric(value) ? toNumber(value) : toBoolean(value.trim())))
          : [value];
}
