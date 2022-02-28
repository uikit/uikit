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

export function isTag(element, tagName) {
    return element?.tagName?.toLowerCase() === tagName.toLowerCase();
}

export function empty(element) {
    return replaceChildren(element, '');
}

export function html(parent, html) {
    return isUndefined(html) ? $(parent).innerHTML : replaceChildren(parent, html);
}

export const replaceChildren = applyFn('replaceChildren');
export const prepend = applyFn('prepend');
export const append = applyFn('append');
export const before = applyFn('before');
export const after = applyFn('after');

function applyFn(fn) {
    return function (ref, element) {
        const nodes = toNodes(isString(element) ? fragment(element) : element);
        if (nodes.length) {
            $(ref)[fn](...nodes);
        }
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
            element.hasChildNodes
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

export function fragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const nodes = toNodes(template.content.childNodes);
    for (const node of nodes) {
        document.adoptNode(node);
    }
    return unwrapSingle(nodes);
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
