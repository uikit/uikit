import {attr} from './attr';
import {hasOwn, includes, isString, isUndefined, toNodes} from './lang';

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

    args.length && toNodes(element).forEach(({classList}) => {
        supports.Multiple
            ? classList[fn](...args)
            : args.forEach(cls => classList[fn](cls));
    });
}

function getArgs(args) {
    return args.reduce((args, arg) =>
        args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg)
        , []);
}

// IE 11
const supports = {

    get Multiple() {
        return this.get('_multiple');
    },

    get Force() {
        return this.get('_force');
    },

    get(key) {

        if (!hasOwn(this, key)) {
            const {classList} = document.createElement('_');
            classList.add('a', 'b');
            classList.toggle('c', false);
            this._multiple = classList.contains('b');
            this._force = !classList.contains('c');
        }

        return this[key];
    }

};
