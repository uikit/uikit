import {closest, matches} from './selector';
import {isString, toNode, toNodes} from './lang';

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
    return toNodes(element).some(element => element.offsetHeight || element.getBoundingClientRect().height);
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
        ? element === selector || toNode(selector).contains(toNode(element))
        : matches(element, selector) || closest(element, selector);
}
