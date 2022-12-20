import { isFunction, isObject, isUndefined, toNode, toNodes } from './lang';

export function attr(element, name, value) {
    if (isObject(name)) {
        for (const key in name) {
            attr(element, key, name[key]);
        }
        return;
    }

    if (isUndefined(value)) {
        return toNode(element)?.getAttribute(name);
    } else {
        for (const el of toNodes(element)) {
            if (isFunction(value)) {
                value = value.call(el, attr(el, name));
            }

            if (value === null) {
                removeAttr(el, name);
            } else {
                el.setAttribute(name, value);
            }
        }
    }
}

export function hasAttr(element, name) {
    return toNodes(element).some((element) => element.hasAttribute(name));
}

export function removeAttr(element, name) {
    toNodes(element).forEach((element) => element.removeAttribute(name));
}

export function data(element, attribute) {
    for (const name of [attribute, `data-${attribute}`]) {
        if (hasAttr(element, name)) {
            return attr(element, name);
        }
    }
}
