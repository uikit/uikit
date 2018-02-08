import {doc, docEl, win} from './env';
import {on} from './event';
import {clamp, isNumeric, isString, isUndefined, toNode, toNodes, toNumber} from './lang';

export function isReady() {
    return doc.readyState === 'complete' || doc.readyState !== 'loading' && !docEl.doScroll;
}

export function ready(fn) {

    if (isReady()) {
        fn();
        return;
    }

    const handle = function () {
        unbind1();
        unbind2();
        fn();
    };
    const unbind1 = on(doc, 'DOMContentLoaded', handle);
    const unbind2 = on(win, 'load', handle);
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
    element = toNode(element);
    element.innerHTML = '';
    return element;
}

export function html(parent, html) {
    parent = toNode(parent);
    return isUndefined(html)
        ? parent.innerHTML
        : append(parent.hasChildNodes() ? empty(parent) : parent, html);
}

export function prepend(parent, element) {

    parent = toNode(parent);

    if (!parent.hasChildNodes()) {
        return append(parent, element);
    } else {
        return insertNodes(element, element => parent.insertBefore(element, parent.firstChild));
    }
}

export function append(parent, element) {
    parent = toNode(parent);
    return insertNodes(element, element => parent.appendChild(element));
}

export function before(ref, element) {
    ref = toNode(ref);
    return insertNodes(element, element => ref.parentNode.insertBefore(element, ref));
}

export function after(ref, element) {
    ref = toNode(ref);
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

const fragmentRE = /^\s*<(\w+|!)[^>]*>/;
const singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

export function fragment(html) {

    const matches = singleTagRE.exec(html);
    if (matches) {
        return doc.createElement(matches[1]);
    }

    const container = doc.createElement('div');
    if (fragmentRE.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
    } else {
        container.textContent = html;
    }

    return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;

}
