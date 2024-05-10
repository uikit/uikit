import { includes, isArray, isUndefined, toNodes } from './lang';

export function addClass(element, ...classes) {
    for (const node of toNodes(element)) {
        const add = toClasses(classes).filter((cls) => !hasClass(node, cls));
        if (add.length) {
            node.classList.add(...add);
        }
    }
}

export function removeClass(element, ...classes) {
    for (const node of toNodes(element)) {
        const remove = toClasses(classes).filter((cls) => hasClass(node, cls));
        if (remove.length) {
            node.classList.remove(...remove);
        }
    }
}

export function replaceClass(element, oldClass, newClass) {
    newClass = toClasses(newClass);
    oldClass = toClasses(oldClass).filter((cls) => !includes(newClass, cls));
    removeClass(element, oldClass);
    addClass(element, newClass);
}

export function hasClass(element, cls) {
    [cls] = toClasses(cls);
    return toNodes(element).some((node) => node.classList.contains(cls));
}

export function toggleClass(element, cls, force) {
    const classes = toClasses(cls);

    if (!isUndefined(force)) {
        force = !!force;
    }

    for (const node of toNodes(element)) {
        for (const cls of classes) {
            node.classList.toggle(cls, force);
        }
    }
}

function toClasses(str) {
    return str
        ? isArray(str)
            ? str.map(toClasses).flat()
            : String(str).split(' ').filter(Boolean)
        : [];
}
