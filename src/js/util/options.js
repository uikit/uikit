import {extend, isArray, hasOwn} from './index';

var strats = {};

// hook strategy
strats.init = function (parentVal, childVal) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
};

// extend strategy
strats.props =
strats.methods = function (parentVal, childVal) {

    if (!childVal) {
        return parentVal;
    }

    if (!parentVal) {
        return childVal;
    }

    var val = {};

    extend(val, parentVal);
    extend(val, childVal);

    return val;
};

// default strategy
var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};

export function mergeOptions (parent, child, thisArg) {

    var options = {}, key;

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
