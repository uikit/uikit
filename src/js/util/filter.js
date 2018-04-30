import {closest, matches} from './selector';
import {isDocument, isString, toNode, toNodes} from './lang';

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

export function filter(element, selector) {
    return toNodes(element).filter(element => matches(element, selector));
}

export function within(element, selector) {
    return !isString(selector)
        ? element === selector || (isDocument(selector)
            ? selector.documentElement
            : toNode(selector)).contains(toNode(element)) // IE 11 document does not implement contains
        : matches(element, selector) || closest(element, selector);
}
