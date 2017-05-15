import { isString, isUndefined, toNode } from '../util/index';

var supportsMultiple, supportsForce;

export default function (UIkit) {

    UIkit.prototype.$addClass = function (...args) {
        apply(this.$el, args, 'add');
    };

    UIkit.prototype.$removeClass = function (...args) {
        apply(this.$el, args, 'remove');
    };

    UIkit.prototype.$hasClass = function (...args) {
        return (args = getArgs(args, this.$el)) && args[0].contains(args[1]);
    };

    UIkit.prototype.$toggleClass = function (...args) {
        args = getArgs(args, this.$el);

        var force = args && !isString(args[args.length - 1]) ? args.pop() : undefined;

        for (var i = 1; i < args.length; i++) {
            args[0] && supportsForce
                ? args[0].toggle(args[i], force)
                : (args[0][(!isUndefined(force) ? force : !args[0].contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    };

}

function apply(el, args, fn) {
    (args = getArgs(args, el)) && (supportsMultiple
        ? args[0][fn].apply(args[0], args.slice(1))
        : args.slice(1).forEach(cls => args[0][fn](cls)));
}

function getArgs(args, el) {

    isString(args[0]) && args.unshift(el);
    args[0] = toNode(args[0]).classList;

    if (args[1] && ~args[1].indexOf(' ')) {
        args = [args[0]].concat(args[1].split(' '), args.slice(2));
    }

    return args[1] && args.length > 1 ? args : false;
}

(function() {

    var el = document.createElement('_');
    el.classList.add('c1', 'c2');
    supportsMultiple = el.classList.contains('c2');
    el.classList.toggle('c3', false);
    supportsForce = el.classList.contains('c3');
    el = null;

})();
