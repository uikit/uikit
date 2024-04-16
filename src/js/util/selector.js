import { attr } from './attr';
import { index, matches } from './filter';
import { isDocument, isString, memoize, toNode, toNodes } from './lang';

export function query(selector, context) {
    return find(selector, getContext(selector, context));
}

export function queryAll(selector, context) {
    return findAll(selector, getContext(selector, context));
}

export function find(selector, context) {
    return toNode(_query(selector, toNode(context), 'querySelector'));
}

export function findAll(selector, context) {
    return toNodes(_query(selector, toNode(context), 'querySelectorAll'));
}

function getContext(selector, context = document) {
    return (isString(selector) && parseSelector(selector).isContextSelector) || isDocument(context)
        ? context
        : context.ownerDocument;
}

const addStarRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
const splitSelectorRe = /.*?[^\\](?![^(]*\))(?:,|$)/g;
const trailingCommaRe = /\s*,$/;

const parseSelector = memoize((selector) => {
    selector = selector.replace(addStarRe, '$1 *');
    let isContextSelector = false;

    const selectors = [];
    for (let sel of selector.match(splitSelectorRe) ?? []) {
        sel = sel.replace(trailingCommaRe, '').trim();
        if (sel[0] === '>') {
            sel = `:scope ${sel}`;
        }
        isContextSelector ||= ['!', '+', '~', '-'].includes(sel[0]);
        selectors.push(sel);
    }

    return {
        selector: selectors.join(','),
        selectors,
        isContextSelector,
    };
});

function _query(selector, context = document, queryFn) {
    if (!selector || !isString(selector)) {
        return selector;
    }

    const parsed = parseSelector(selector);

    if (!parsed.isContextSelector) {
        return _doQuery(context, queryFn, parsed.selector);
    }

    selector = '';
    const isSingle = parsed.selectors.length === 1;
    for (let sel of parsed.selectors) {
        let ctx = context;

        if (sel[0] === '!') {
            const selectors = sel.substr(1).trim().split(' ');
            ctx = context.parentElement.closest(selectors[0]);
            sel = selectors.slice(1).join(' ').trim();
            if (!sel.length && isSingle) {
                return ctx;
            }
        }

        if (sel[0] === '-') {
            const selectors = sel.substr(1).trim().split(' ');
            const prev = (ctx || context).previousElementSibling;
            ctx = matches(prev, sel.substr(1)) ? prev : null;
            sel = selectors.slice(1).join(' ');
            if (!sel.length && isSingle) {
                return ctx;
            }
        } else if (sel[0] === '~' || (sel[0] === '+' && isSingle)) {
            return _doQuery(
                ctx.parentElement,
                queryFn,
                `:scope :nth-child(${index(ctx) + 1}) ${sel}`,
            );
        }

        if (ctx) {
            selector += `${selector ? ',' : ''}${domPath(ctx)} ${sel}`;
        }
    }

    if (!isDocument(context)) {
        context = context.ownerDocument;
    }

    return _doQuery(context, queryFn, selector);
}

function _doQuery(context, queryFn, selector) {
    try {
        return context[queryFn](selector);
    } catch (e) {
        return null;
    }
}

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
