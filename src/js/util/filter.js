import { inBrowser } from './env.js';
import { toArray, toNode, toNodes } from './lang';

const voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true,
};
export function isVoidElement(element) {
    return toNodes(element).some((element) => voidElements[element.tagName.toLowerCase()]);
}

const isVisibleFn =
    (inBrowser && Element.prototype.checkVisibility) ||
    function () {
        return this.offsetWidth || this.offsetHeight || this.getClientRects().length;
    };
export function isVisible(element) {
    return toNodes(element).some((element) => isVisibleFn.call(element));
}

export const selInput = 'input,select,textarea,button';
export function isInput(element) {
    return toNodes(element).some((element) => matches(element, selInput));
}

export const selFocusable = `${selInput},a[href],[tabindex]`;
export function isFocusable(element) {
    return matches(element, selFocusable);
}

export function parent(element) {
    return toNode(element)?.parentElement;
}

export function filter(element, selector) {
    return toNodes(element).filter((element) => matches(element, selector));
}

export function matches(element, selector) {
    return toNodes(element).some((element) => element.matches(selector));
}

export function parents(element, selector) {
    const elements = [];

    while ((element = parent(element))) {
        if (!selector || matches(element, selector)) {
            elements.push(element);
        }
    }

    return elements;
}

export function children(element, selector) {
    element = toNode(element);
    const children = element ? toArray(element.children) : [];
    return selector ? filter(children, selector) : children;
}

export function index(element, ref) {
    return ref ? toNodes(element).indexOf(toNode(ref)) : children(parent(element)).indexOf(element);
}

export function isSameSiteAnchor(el) {
    el = toNode(el);
    return el && ['origin', 'pathname', 'search'].every((part) => el[part] === location[part]);
}

export function getTargetedElement(el) {
    if (isSameSiteAnchor(el)) {
        const { hash, ownerDocument } = toNode(el);
        const id = decodeURIComponent(hash).slice(1);
        return id
            ? ownerDocument.getElementById(id) || ownerDocument.getElementsByName(id)[0]
            : ownerDocument.documentElement;
    }
}
