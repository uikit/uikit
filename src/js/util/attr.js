import {isFunction, isObject, isUndefined, toNode, toNodes} from './lang';

export function attr(element, name, value) {

    if (isObject(name)) {
        for (const key in name) {
            attr(element, key, name[key]);
        }
        return;
    }

    if (isUndefined(value)) {
        element = toNode(element);
        return element && element.getAttribute(name);
    } else {
        toNodes(element).forEach(element => {

            if (isFunction(value)) {
                value = value.call(element, attr(element, name));
            }

            if (value === null) {
                removeAttr(element, name);
            } else {
                element.setAttribute(name, value);
            }
        });
    }

}

export function hasAttr(element, name) {
    return toNodes(element).some(element => element.hasAttribute(name));
}

export function removeAttr(element, name) {
    element = toNodes(element);
    name.split(' ').forEach(name =>
        element.forEach(element =>
            element.removeAttribute(name)
        )
    );
}

export function data(element, attribute) {
    for (let i = 0, attrs = [attribute, `data-${attribute}`]; i < attrs.length; i++) {
        if (hasAttr(element, attrs[i])) {
            return attr(element, attrs[i]);
        }
    }
}
