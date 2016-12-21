import { extend, isArray, hasOwn } from './index';

var strats = {};

// concat strategy
strats.created =
strats.init =
strats.ready =
strats.update =
strats.connected =
strats.disconnected =
strats.destroy = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
};

// events strategy
strats.events = function (parentVal, childVal) {

    if (!childVal) {
        return parentVal;
    }

    if (!parentVal) {
        return childVal;
    }

    var ret = extend({}, parentVal);

    for (var key in childVal) {
        var parent = ret[key], child = childVal[key];

        if (parent && !isArray(parent)) {
            parent = [parent]
        }

        ret[key] = parent
            ? parent.concat(child)
            : [child]
    }

    return ret;
};

// property strategy
strats.props = function (parentVal, childVal) {

    if (isArray(childVal)) {
        var ret = {};
        childVal.forEach(val => {
            ret[val] = String;
        });
        childVal = ret;
    }

    return strats.methods(parentVal, childVal);
};

// extend strategy
strats.defaults =
strats.methods = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? extend({}, parentVal, childVal)
            : childVal
        : parentVal;
};

// default strategy
var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};

export function mergeOptions (parent, child, thisArg) {

    var options = {}, key;

    if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], thisArg);
        }
    }

    for (key in parent) {
        mergeKey(key);
    }

    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeKey(key);
        }
    }

    function mergeKey (key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], thisArg, key);
    }

    return options;
}
