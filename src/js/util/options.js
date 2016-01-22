import {extend, isArray, hasOwn, unique} from './index';

let strats = {};

// concat strategy
strats.ready =
strats.destroy = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
};

// unique concat strategy
strats.props = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? unique(parentVal.concat(childVal))
            : isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
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
let defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};

export function mergeOptions (parent, child, thisArg) {

    let options = {}, key;

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
};
