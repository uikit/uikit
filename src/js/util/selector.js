import { doc, docEl, fragment, includes, isArray, isDocument, isObject, isString, isWindow, startsWith } from './index';

var arrayProto = Array.prototype;

export function $(selector, context) {
    return !isString(selector)
        ? toNode(selector)
        : isHtml(selector)
            ? $(fragment(selector))
            : find(selector, context);
}

export function $$(selector, context) {
    return !isString(selector)
        ? toNodes(selector)
        : isHtml(selector)
            ? $$(fragment(selector))
            : findAll(selector, context);
}

function isHtml(str) {
    return str[0] === '<' || str.match(/^\s*</);
}

export function query(selector, context) {
    return $(selector, isContextSelector(selector) ? context : doc);
}

export function queryAll(selector, context) {
    return $$(selector, isContextSelector(selector) ? context : doc);
}

function find(selector, context = doc) {

    try {

        return !selector
            ? null
            : !isContextSelector(selector)
                ? context.querySelector(selector)
                : $(_query(selector, context));

    } catch (e) {
        return null;
    }
}

function findAll(selector, context = doc) {

    try {

        return !selector
            ? []
            : !isContextSelector(selector)
                ? $$(context.querySelectorAll(selector))
                : $$(_query(selector, context));

    } catch (e) {
        return [];
    }

}

function _query(selector, context) {

    if (includes(selector, ',')) {
        return merge(selector.split(',').map(selector => find(selector.trim(), context)));
    }

    return getContextSelectors(selector).reduce((context, selector) => resolveQuery(selector, context), context);
}

export function filter(element, selector) {
    return $$(element).filter(element => matches(element, selector));
}

export function within(element, selector) {
    return !isString(selector)
        ? element === selector || toNode(selector).contains(toNode(element))
        : matches(element, selector) || closest(element, selector);
}

var contextSelector = '^,?[!+-]?\\s*>|(?:^|\\s)[!+-]',
    contextSelectorRe = new RegExp(contextSelector),
    contextSplitRe = new RegExp(`(?=${contextSelector})`, 'g');

function isContextSelector(selector) {
    return isString(selector) && selector.match(contextSelectorRe);
}

function getContextSelectors(selector) {
    return isString(selector) && selector.split(contextSplitRe);
}

function resolveQuery(query, context) {

    if (!isString(query) || !context) {
        return null;
    }

    query = query.trim();

    var selectors = query.substr(1).trim().split(' '),
        contextSelector = selectors[0] || '*',
        selector = selectors.slice(1).join(' ');
    switch (query[0]) {
        case '>':
            return merge(filter(context.children, contextSelector).map(el => !selector && el || $$(selector, el)));
        case '!':
            return closest(context.parentNode, query.substr(1));
        case '+':
            return findDir(context, contextSelector, selector, 'next');
        case '-':
            return findDir(context, contextSelector, selector, 'previous');
    }

    return $(query, context);
}

function findDir(element, contextSelector, selector, dir) {
    var fn = [`${dir}ElementSibling`], nodes = [];

    element = element[fn];

    while (element) {
        if (matches(element, contextSelector)) {
            nodes = nodes.concat(selector ? $$(selector, element) : element);
        }

        element = element[fn];
    }

    return nodes;
}

var elProto = Element.prototype;
var matchesFn = elProto.matches || elProto.msMatchesSelector;

export function matches(element, selector) {
    return toNodes(element).some(element => matchesFn.call(element, selector));
}

var closestFn = elProto.closest || function (selector) {
    var ancestor = this;

    if (!docEl.contains(this)) {
        return;
    }

    do {

        if (matches(ancestor, selector)) {
            return ancestor;
        }

        ancestor = ancestor.parentNode;

    } while (ancestor && ancestor.nodeType === 1);
};

export function closest(element, selector) {

    if (startsWith(selector, '>')) {
        selector = selector.slice(1);
    }

    return isNode(element) ? closestFn.call(element, selector) : toNodes(element).map(element => closestFn.call(element, selector));
}

export function parents(element, selector) {
    var elements = [], parent = toNode(element).parentNode;

    while (parent && parent.nodeType === 1) {

        if (matches(parent, selector)) {
            elements.push(parent);
        }

        parent = parent.parentNode;
    }

    return elements;
}

export function isJQuery(obj) {
    return isObject(obj) && !!obj.jquery;
}

function isNode(element) {
    return element instanceof Node || isObject(element) && element.nodeType === 1;
}

function isNodeCollection(element) {
    return element instanceof NodeList || element instanceof HTMLCollection;
}

export function toNode(element) {
    return isNode(element) || isWindow(element) || isDocument(element)
        ? element
        : isNodeCollection(element) || isJQuery(element)
            ? element[0]
            : isArray(element)
                ? toNode(element[0])
                : null;
}

export function toNodes(element) {
    return isNode(element)
        ? [element]
        : isNodeCollection(element)
            ? arrayProto.slice.call(element)
            : isArray(element)
                ? element.map(toNode).filter(Boolean)
                : isJQuery(element)
                    ? element.toArray()
                    : [];
}

function merge(arrays) {
    return arrayProto.concat.apply([], arrays);
}
