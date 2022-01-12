import {attr} from './attr';
import {inBrowser} from './env';
import {closest, index, matches, parent} from './filter';
import {isDocument, isString, memoize, toNode, toNodes} from './lang';

export function query(selector, context) {
    return find(selector, getContext(selector, context));
}

export function queryAll(selector, context) {
    return findAll(selector, getContext(selector, context));
}

function getContext(selector, context = document) {
    return isString(selector) && isContextSelector(selector) || isDocument(context)
        ? context
        : context.ownerDocument;
}

export function find(selector, context) {
    return toNode(_query(selector, context, 'querySelector'));
}

export function findAll(selector, context) {
    return toNodes(_query(selector, context, 'querySelectorAll'));
}

function _query(selector, context = document, queryFn) {

    if (!selector || !isString(selector)) {
        return selector;
    }

    selector = selector.replace(contextSanitizeRe, '$1 *');

    if (isContextSelector(selector)) {

        selector = splitSelector(selector).map(selector => {

            let ctx = context;

            if (selector[0] === '!') {

                const selectors = selector.substr(1).trim().split(' ');
                ctx = closest(parent(context), selectors[0]);
                selector = selectors.slice(1).join(' ').trim();

            }

            if (selector[0] === '-') {

                const selectors = selector.substr(1).trim().split(' ');
                const prev = (ctx || context).previousElementSibling;
                ctx = matches(prev, selector.substr(1)) ? prev : null;
                selector = selectors.slice(1).join(' ');

            }

            if (!ctx) {
                return null;
            }

            return `${domPath(ctx)} ${selector}`;

        }).filter(Boolean).join(',');

        context = document;

    }

    try {

        return context[queryFn](selector);

    } catch (e) {

        return null;

    }

}

const contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
const contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;

const isContextSelector = memoize(selector => selector.match(contextSelectorRe));

const selectorRe = /.*?[^\\](?:,|$)/g;

const splitSelector = memoize(selector =>
    selector.match(selectorRe).map(selector =>
        selector.replace(/,$/, '').trim()
    )
);

function domPath(element) {
    const names = [];
    while (element.parentNode) {
        const id = attr(element, 'id');
        if (id) {
            names.unshift(`#${escape(id)}`);
            break;
        } else {
            let {tagName} = element;
            if (tagName !== 'HTML') {
                tagName += `:nth-child(${index(element) + 1})`;
            }
            names.unshift(tagName);
            element = element.parentNode;
        }
    }
    return names.join(' > ');
}

const escapeFn = inBrowser && window.CSS && CSS.escape || function (css) { return css.replace(/([^\x7f-\uFFFF\w-])/g, match => `\\${match}`); };
export function escape(css) {
    return isString(css) ? escapeFn.call(null, css) : '';
}
