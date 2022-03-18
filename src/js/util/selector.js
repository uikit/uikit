import { attr } from './attr';
import { closest, index, matches, parent } from './filter';
import { isDocument, isString, memoize, toNode, toNodes } from './lang';

export function query(selector, context) {
    return find(selector, getContext(selector, context));
}

export function queryAll(selector, context) {
    return findAll(selector, getContext(selector, context));
}

export function find(selector, context) {
    return toNode(_query(selector, context, 'querySelector'));
}

export function findAll(selector, context) {
    return toNodes(_query(selector, context, 'querySelectorAll'));
}

const contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
const isContextSelector = memoize((selector) => selector.match(contextSelectorRe));

function getContext(selector, context = document) {
    return (isString(selector) && isContextSelector(selector)) || isDocument(context)
        ? context
        : context.ownerDocument;
}

const contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
const sanatize = memoize((selector) => selector.replace(contextSanitizeRe, '$1 *'));

function _query(selector, context = document, queryFn) {
    if (!selector || !isString(selector)) {
        return selector;
    }

    selector = sanatize(selector);

    if (isContextSelector(selector)) {
        const split = splitSelector(selector);
        selector = '';
        for (let sel of split) {
            let ctx = context;

            if (sel[0] === '!') {
                const selectors = sel.substr(1).trim().split(' ');
                ctx = closest(parent(context), selectors[0]);
                sel = selectors.slice(1).join(' ').trim();
                if (!sel.length && split.length === 1) {
                    return ctx;
                }
            }

            if (sel[0] === '-') {
                const selectors = sel.substr(1).trim().split(' ');
                const prev = (ctx || context).previousElementSibling;
                ctx = matches(prev, sel.substr(1)) ? prev : null;
                sel = selectors.slice(1).join(' ');
            }

            if (ctx) {
                selector += `${selector ? ',' : ''}${domPath(ctx)} ${sel}`;
            }
        }

        context = document;
    }

    try {
        return context[queryFn](selector);
    } catch (e) {
        return null;
    }
}

const selectorRe = /.*?[^\\](?:,|$)/g;

const splitSelector = memoize((selector) =>
    selector.match(selectorRe).map((selector) => selector.replace(/,$/, '').trim())
);

function domPath(element) {
    const names = [];
    while (element.parentNode) {
        const id = attr(element, 'id');
        if (id) {
            names.unshift(`#${escape(id)}`);
            break;
        } else {
            let { tagName } = element;
            if (tagName !== 'HTML') {
                tagName += `:nth-child(${index(element) + 1})`;
            }
            names.unshift(tagName);
            element = element.parentNode;
        }
    }
    return names.join(' > ');
}

export function escape(css) {
    return isString(css) ? CSS.escape(css) : '';
}
