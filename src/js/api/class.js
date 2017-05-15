import { isString, isUndefined, toNode } from '../util/index';

var supportsMultiple, supportsForce;

export default function (UIkit) {

    UIkit.prototype.$addClass = function (...args) {
        var el = getEl(args, this.$el);

        if (~args[0].indexOf(' ')) {
            args = args[0].split(' ').concat(args.slice(1));
        }

        supportsMultiple
            ? el.classList.add.apply(el.classList, args)
            : args.forEach(cls => args[0].classList.add(cls));
    };

    UIkit.prototype.$removeClass = function (...args) {
        var el = getEl(args, this.$el);

        if (~args[0].indexOf(' ')) {
            args = args[0].split(' ').concat(args.slice(1));
        }

        supportsMultiple
            ? el.classList.remove.apply(el.classList, args)
            : args.forEach(cls => el.classList.remove(cls));
    };

    UIkit.prototype.$hasClass = function (...args) {
        return getEl(args, this.$el).classList.contains(args[0]);
    };

    UIkit.prototype.$toggleClass = function (...args) {
        var el = getEl(args, this.$el);
        supportsForce
            ? el.classList.toggle(args[0], args[1])
            : (el.classList[(!isUndefined(args[1]) ? args[1] : !el.classList.contains(args[0])) ? 'add' : 'remove'](args[0]));
    };

}

function getEl(args, el) {
    return toNode(isString(args[0]) ? el : args.shift());
}

(function() {

    var el = document.createElement('_');
    el.classList.add('c1', 'c2');
    supportsMultiple = el.classList.contains('c2');
    el.classList.toggle('c3', false);
    supportsForce = el.classList.contains('c3')
    el = null;

})();
