import {attr} from './attr';
import {isUndefined, toNodes} from './lang';

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
    [cls] = getClasses(cls);
    const nodes = toNodes(element);
    for (let n = 0; n < nodes.length; n++) {
        if (cls && nodes[n].classList.contains(cls)) {
            return true;
        }
    }
    return false;
}

export function toggleClass(element, cls, force) {

    cls = getClasses(cls);

    const nodes = toNodes(element);
    for (let n = 0; n < nodes.length; n++) {
        const list = nodes[n].classList;
        for (let i = 0; i < cls.length; i++) {
            if (isUndefined(force)) {
                list.toggle(cls[i]);
            } else {
                list.toggle(cls[i], !!force);
            }
        }
    }
}

function apply(element, args, fn) {

    args = args.reduce((args, arg) => args.concat(getClasses(arg)), []);

    const nodes = toNodes(element);
    for (let n = 0; n < nodes.length; n++) {
        nodes[n].classList[fn](...args);
    }
}

function getClasses(str) {
    return String(str).split(/\s|,/).filter(Boolean);
}
