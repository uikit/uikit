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
            } else if (supports.Force) {
                list.toggle(cls[i], !!force);
            } else {
                list[force ? 'add' : 'remove'](cls[i]);
            }
        }
    }
}

function apply(element, args, fn) {

    args = args.reduce((args, arg) => args.concat(getClasses(arg)), []);

    const nodes = toNodes(element);
    for (let n = 0; n < nodes.length; n++) {
        if (supports.Multiple) {
            nodes[n].classList[fn](...args);
        } else {
            args.forEach(cls => nodes[n].classList[fn](cls));
        }
    }
}

function getClasses(str) {
    str = String(str);
    return (~str.indexOf(' ') ? str.split(' ') : [str]).filter(Boolean);
}

// IE 11
let supports = {

    get Multiple() {
        return this.get('Multiple');
    },

    get Force() {
        return this.get('Force');
    },

    get(key) {

        const {classList} = document.createElement('_');
        classList.add('a', 'b');
        classList.toggle('c', false);
        supports = {
            Multiple: classList.contains('b'),
            Force: !classList.contains('c')
        };

        return supports[key];
    }

};
