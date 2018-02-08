import {supports} from './env';
import {filterAttr} from './attr';
import {includes, isString, isUndefined, toNodes} from './lang';

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
    return supports.ClassList && toNodes(element).some(element => element.classList.contains(cls));
}

export function toggleClass(element, ...args) {

    if (!supports.ClassList || !args.length) {
        return;
    }

    args = getArgs(args);

    const force = !isString(args[args.length - 1]) ? args.pop() : []; // in iOS 9.3 force === undefined evaluates to false

    args = args.filter(Boolean);

    toNodes(element).forEach(({classList}) => {
        for (let i = 0; i < args.length; i++) {
            supports.Force
                ? classList.toggle(...[args[i]].concat(force))
                : (classList[(!isUndefined(force) ? force : !classList.contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    });

}

function apply(element, args, fn) {
    args = getArgs(args).filter(Boolean);

    supports.ClassList && args.length && toNodes(element).forEach(({classList}) => {
        supports.Multiple
            ? classList[fn].apply(classList, args)
            : args.forEach(cls => classList[fn](cls));
    });
}

function getArgs(args) {
    return args.reduce((args, arg) =>
        args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg)
        , []);
}

