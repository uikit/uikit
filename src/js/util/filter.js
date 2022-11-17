import { isElement, isString, startsWith, toNode, toNodes } from './lang';

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

export function isVisible(element) {
    return toNodes(element).some(
        (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length
    );
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

export function closest(element, selector) {
    return isElement(element)
        ? element.closest(startsWith(selector, '>') ? selector.slice(1) : selector)
        : toNodes(element)
              .map((element) => closest(element, selector))
              .filter(Boolean);
}

export function within(element, selector) {
    return isString(selector)
        ? !!closest(element, selector)
        : toNode(selector).contains(toNode(element));
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
    return ref ? toNodes(element).indexOf(toNode(ref)) : children(parent(element)).indexOf(element);
}
