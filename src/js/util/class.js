import { isString, isUndefined, toNode } from './index';

var supportsMultiple, supportsForce;

export function addClass(element, ...args) {
    apply(element, args, 'add');
}

export function removeClass(element, ...args) {
    apply(element, args, 'remove');
}

export function replaceClass(element, ...args) {
    removeClass(element, args[0]);
    addClass(element, args[1]);
}

export function hasClass(element, ...args) {
    return (args = getArgs(element, args)) && args[0].contains(args[1]);
}

export function toggleClass (element, ...args) {
    args = getArgs(element, args);

    var force = args && !isString(args[args.length - 1]) ? args.pop() : undefined;

    for (var i = 1; i < (args && args.length); i++) {
        args[0] && supportsForce
            ? args[0].toggle(args[i], force)
            : (args[0][(!isUndefined(force) ? force : !args[0].contains(args[i])) ? 'add' : 'remove'](args[i]));
    }
}

function apply(element, args, fn) {
    (args = getArgs(element, args)) && (supportsMultiple
        ? args[0][fn].apply(args[0], args.slice(1))
        : args.slice(1).forEach(cls => args[0][fn](cls)));
}

function getArgs(element, args) {

    args.unshift(element);
    args[0] = (toNode(args[0]) || {}).classList;

    args.forEach((arg, i) =>
        i > 0 && isString(arg) && ~arg.indexOf(' ') && Array.prototype.splice.apply(args, [i, 1].concat(args[i].split(' ')))
    );

    return args[0] && args[1] && args.length > 1 && args;
}

(function() {

    var list = document.createElement('_').classList;
    if (list) {
        list.add('a', 'b');
        list.toggle('c', false);
        supportsMultiple = list.contains('b');
        supportsForce = !list.contains('c');
    }
    list = null;

})();
