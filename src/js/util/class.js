import { doc, filterAttr, includes, isString, isUndefined, toNodes } from './index';

var supportsClassList, supportsMultiple, supportsForce;

export function addClass(element, ...args) {
    apply(element, args, 'add');
}

export function removeClass(element, ...args) {
    apply(element, args, 'remove');
}

export function removeClasses(element, cls) {
    filterAttr(element, 'class', new RegExp(`(^|\\s)${cls}(?!\\S)`, 'g'), '');
}

export function replaceClass(element, ...args) {
    args[0] && removeClass(element, args[0]);
    args[1] && addClass(element, args[1]);
}

export function hasClass(element, cls) {
    return supportsClassList && toNodes(element).some(element => element.classList.contains(cls));
}

export function toggleClass(element, ...args) {

    if (!supportsClassList || !args.length) {
        return;
    }

    args = getArgs(args);

    var force = !isString(args[args.length - 1]) ? args.pop()  : undefined;

    toNodes(element).forEach(({classList}) => {
        for (var i = 0; i < args.length; i++) {
            supportsForce
                ? classList.toggle(args[i], force)
                : (classList[(!isUndefined(force) ? force : !classList.contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    });

}

function apply(element, args, fn) {
    args = getArgs(args).filter(arg => arg);

    supportsClassList && args.length && toNodes(element).forEach(({classList}) => {
        supportsMultiple
            ? classList[fn].apply(classList, args)
            : args.forEach(cls => classList[fn](cls));
    });
}

function getArgs(args) {
    return args.reduce((args, arg) => {
        args.push.apply(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : [arg]);
        return args;
    }, []);
}

(function () {

    var list = doc.createElement('_').classList;
    if (list) {
        list.add('a', 'b');
        list.toggle('c', false);
        supportsMultiple = list.contains('b');
        supportsForce = !list.contains('c');
        supportsClassList = true;
    }
    list = null;

})();
