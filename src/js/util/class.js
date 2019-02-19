import {isIE} from './env';
import {attr} from './attr';
import {includes, isArray, isString, toNodes} from './lang';

export function addClass(element, ...args) {
    apply(element, args, 'add');
}

export function removeClass(element, ...args) {
    apply(element, args, 'remove');
}

export function removeClasses(element, cls) {
    attr(element, 'class', value => (value || '').replace(new RegExp(`\\b${cls}\\b`, 'g'), ''));
}

export function replaceClass(element, ...args) {
    args[0] && removeClass(element, args[0]);
    args[1] && addClass(element, args[1]);
}

export function hasClass(element, cls) {
    return cls && toNodes(element).some(element => element.classList.contains(cls.split(' ')[0]));
}

export function toggleClass(element, ...args) {

    if (!args.length) {
        return;
    }

    args = getArgs(args);

    const force = !isString(args[args.length - 1]) ? args.pop() : []; // in iOS 9.3 force === undefined evaluates to false

    args = args.filter(Boolean);

    toNodes(element).forEach(element => {
        for (let i = 0; i < args.length; i++) {
            !isIE
                ? element.classList.toggle(...[args[i]].concat(force))
                : classList.toggle(element, args[i], force);
        }
    });

}

function apply(element, args, fn) {
    args = getArgs(args).filter(Boolean);

    args.length && toNodes(element).forEach(element => {
        !isIE
            ? element.classList[fn](...args)
            : classList[fn](element, args);
    });
}

function getArgs(args) {
    return args.reduce((args, arg) =>
        args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg)
        , []);
}

// IE 11 shim (SVG elements do not support `classList` in IE 11)
const classList = {

    add(element, classNames) {
        classNames.forEach(name => !this.contains(element, name) && attr(element, 'class', `${attr(element, 'class')} ${name}`));
    },

    remove(element, classNames) {
        classNames.forEach(name => attr(element, 'class', (attr(element, 'class') || '').replace(new RegExp(name, 'g'), ' ').trim()));
    },

    toggle(element, className, force) {
        this[
            (!isArray(force)
                ? force
                : !this.contains(element, className)
            ) ? 'add' : 'remove'
        ](element, [className]);
    },

    contains(element, name) {
        return (attr(element, 'class') || '').match(new RegExp(name));
    }

};
