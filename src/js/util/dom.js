import {on} from './event';
import {find, findAll} from './selector';
import {clamp, isNumeric, isString, isUndefined, toNode, toNodes, toNumber} from './lang';

export function ready(fn) {

    if (document.readyState !== 'loading') {
        fn();
        return;
    }

    const unbind = on(document, 'DOMContentLoaded', function () {
        unbind();
        fn();
    });
}

export function index(element, ref) {
    return ref
        ? toNodes(element).indexOf(toNode(ref))
        : toNodes((element = toNode(element)) && element.parentNode.children).indexOf(element);
}

export function getIndex(i, elements, current = 0, finite = false) {

    elements = toNodes(elements);

    const {length} = elements;

    i = isNumeric(i)
        ? toNumber(i)
        : i === 'next'
            ? current + 1
            : i === 'previous'
                ? current - 1
                : index(elements, i);

    if (finite) {
        return clamp(i, 0, length - 1);
    }

    i %= length;

    return i < 0 ? i + length : i;
}

export function empty(element) {
    element = $(element);
    element.innerHTML = '';
    return element;
}

export function html(parent, html) {
    parent = $(parent);
    return isUndefined(html)
        ? parent.innerHTML
        : append(parent.hasChildNodes() ? empty(parent) : parent, html);
}

export function prepend(parent, element) {

    parent = $(parent);

    if (!parent.hasChildNodes()) {
        return append(parent, element);
    } else {
        return insertNodes(element, element => parent.insertBefore(element, parent.firstChild));
    }
}

export function append(parent, element) {
    parent = $(parent);
    return insertNodes(element, element => parent.appendChild(element));
}

export function before(ref, element) {
    ref = $(ref);
    return insertNodes(element, element => ref.parentNode.insertBefore(element, ref));
}

export function after(ref, element) {
    ref = $(ref);
    return insertNodes(element, element => ref.nextSibling
        ? before(ref.nextSibling, element)
        : append(ref.parentNode, element)
    );
}

function insertNodes(element, fn) {
    element = isString(element) ? fragment(element) : element;
    return element
        ? 'length' in element
            ? toNodes(element).map(fn)
            : fn(element)
        : null;
}

export function remove(element) {
    toNodes(element).map(element => element.parentNode && element.parentNode.removeChild(element));
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
    return toNodes(toNodes(element).map(element =>
        element.hasChildNodes ? wrapAll(toNodes(element.childNodes), structure) : append(element, structure)
    ));
}

export function unwrap(element) {
    toNodes(element)
        .map(element => element.parentNode)
        .filter((value, index, self) => self.indexOf(value) === index)
        .forEach(parent => {
            before(parent, parent.childNodes);
            remove(parent);
        });
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

    return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;

}

export function apply(node, fn) {

    if (!node || node.nodeType !== 1) {
        return;
    }

    fn(node);
    node = node.firstElementChild;
    while (node) {
        apply(node, fn);
        node = node.nextElementSibling;
    }
}

export function $(selector, context) {
    return !isString(selector)
        ? toNode(selector)
        : isHtml(selector)
            ? toNode(fragment(selector))
            : find(selector, context);
}

export function $$(selector, context) {
    return !isString(selector)
        ? toNodes(selector)
        : isHtml(selector)
            ? toNodes(fragment(selector))
            : findAll(selector, context);
}

function isHtml(str) {
    return str[0] === '<' || str.match(/^\s*</);
}

