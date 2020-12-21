import {inBrowser} from './env';
import {isDocument, isElement, isString, noop, startsWith, toNode, toNodes} from './lang';

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
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};
export function isVoidElement(element) {
    return toNodes(element).some(element => voidElements[element.tagName.toLowerCase()]);
}

export function isVisible(element) {
    return toNodes(element).some(element => element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

export const selInput = 'input,select,textarea,button';
export function isInput(element) {
    return toNodes(element).some(element => matches(element, selInput));
}

export function parent(element) {
    element = toNode(element);
    return element && isElement(element.parentNode) && element.parentNode;
}

export function filter(element, selector) {
    return toNodes(element).filter(element => matches(element, selector));
}

const elProto = inBrowser ? Element.prototype : {};
const matchesFn = elProto.matches || elProto.webkitMatchesSelector || elProto.msMatchesSelector || noop;

export function matches(element, selector) {
    return toNodes(element).some(element => matchesFn.call(element, selector));
}

const closestFn = elProto.closest || function (selector) {
    let ancestor = this;

    do {

        if (matches(ancestor, selector)) {
            return ancestor;
        }

    } while ((ancestor = parent(ancestor)));
};

export function closest(element, selector) {

    if (startsWith(selector, '>')) {
        selector = selector.slice(1);
    }

    return isElement(element)
        ? closestFn.call(element, selector)
        : toNodes(element).map(element => closest(element, selector)).filter(Boolean);
}

export function within(element, selector) {
    return !isString(selector)
        ? element === selector || (isDocument(selector)
            ? selector.documentElement
            : toNode(selector)).contains(toNode(element)) // IE 11 document does not implement contains
        : matches(element, selector) || !!closest(element, selector);
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
    const children = element ? toNodes(element.children) : [];
    return selector ? filter(children, selector) : children;
}

export function index(element, ref) {
    return ref
        ? toNodes(element).indexOf(toNode(ref))
        : children(parent(element)).indexOf(element);
}
