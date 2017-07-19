import { isString, isUndefined, toNode } from '../util/index';

var supportsMultiple, supportsForce;

export default function (UIkit) {

    UIkit.prototype.$addClass = function (...args) {
        apply(this.$options.el, args, 'add');
    };

    UIkit.prototype.$removeClass = function (...args) {
        apply(this.$options.el, args, 'remove');
    };

    UIkit.prototype.$hasClass = function (...args) {
        return (args = getArgs(args, this.$options.el)) && args[0].contains(args[1]);
    };

    UIkit.prototype.$toggleClass = function (...args) {
        args = getArgs(args, this.$options.el);

        var force = args && !isString(args[args.length - 1]) ? args.pop() : undefined;

        for (var i = 1; i < (args && args.length); i++) {
            args[0] && supportsForce
                ? args[0].toggle(args[i], force)
                : (args[0][(!isUndefined(force) ? force : !args[0].contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    };

    function apply(el, args, fn) {
        (args = getArgs(args, el)) && (supportsMultiple
            ? args[0][fn].apply(args[0], args.slice(1))
            : args.slice(1).forEach(cls => args[0][fn](cls)));
    }

    function getArgs(args, el) {

        isString(args[0]) && args.unshift(el);
        args[0] = (toNode(args[0]) || {}).classList;

        args.forEach((arg, i) =>
            i > 0 && isString(arg) && ~arg.indexOf(' ') && Array.prototype.splice.apply(args, [i, 1].concat(args[i].split(' ')))
        );

        return args[0] && args[1] && args.length > 1 && args;
    }

};

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
