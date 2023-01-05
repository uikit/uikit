import { once } from './event';
import { parent } from './filter';
import { find, findAll } from './selector';
import { isElement, isString, isUndefined, startsWith, toNode, toNodes } from './lang';

export function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
        return;
    }

    once(document, 'DOMContentLoaded', fn);
}

export function isTag(element, ...tagNames) {
    return tagNames.some((tagName) => element?.tagName?.toLowerCase() === tagName.toLowerCase());
}

export function empty(element) {
    element = $(element);
    element.innerHTML = '';
    return element;
}

export function html(parent, html) {
    return isUndefined(html) ? $(parent).innerHTML : append(empty(parent), html);
}

export const prepend = applyFn('prepend');
export const append = applyFn('append');
export const before = applyFn('before');
export const after = applyFn('after');

function applyFn(fn) {
    return function (ref, element) {
        const nodes = toNodes(isString(element) ? fragment(element) : element);
        $(ref)?.[fn](...nodes);
        return unwrapSingle(nodes);
    };
}

export function remove(element) {
    toNodes(element).forEach((element) => element.remove());
}

export function wrapAll(element, structure) {
    structure = toNode(before(element, structure));

    while (structure.firstChild) {
        structure = structure.firstChild;
    }

    append(structure, element);

    return structure;
}

export function wrapInner(element, structure) {
    return toNodes(
        toNodes(element).map((element) =>
            element.hasChildNodes()
                ? wrapAll(toNodes(element.childNodes), structure)
                : append(element, structure)
        )
    );
}

export function unwrap(element) {
    toNodes(element)
        .map(parent)
        .filter((value, index, self) => self.indexOf(value) === index)
        .forEach((parent) => parent.replaceWith(...parent.childNodes));
}

const fragmentRe = /^\s*<(\w+|!)[^>]*>/;
const singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

export function fragment(html) {
    const matches = singleTagRe.exec(html);
    if (matches) {
        return document.createElement(matches[1]);
    }

    const container = document.createElement('div');
    if (fragmentRe.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
    } else {
        container.textContent = html;
    }

    return unwrapSingle(container.childNodes);
}

function unwrapSingle(nodes) {
    return nodes.length > 1 ? nodes : nodes[0];
}

export function apply(node, fn) {
    if (!isElement(node)) {
        return;
    }

    fn(node);
    node = node.firstElementChild;
    while (node) {
        const next = node.nextElementSibling;
        apply(node, fn);
        node = next;
    }
}

export function $(selector, context) {
    return isHtml(selector) ? toNode(fragment(selector)) : find(selector, context);
}

export function $$(selector, context) {
    return isHtml(selector) ? toNodes(fragment(selector)) : findAll(selector, context);
}

function isHtml(str) {
    return isString(str) && startsWith(str.trim(), '<');
}
