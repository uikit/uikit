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
    return isDocument(context) || parseSelector(selector).isContextSelector
        ? context
        : context.ownerDocument;
}

const addStarRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
// This will fail for nested, comma separated selectors (e.g `a:has(b:not(c),d)`)
const splitSelectorRe = /(\([^)]*\)|[^,])+/g;

const parseSelector = memoize((selector) => {
    let isContextSelector = false;

    if (!selector || !isString(selector)) {
        return {};
    }

    const selectors = [];

    for (let sel of selector.match(splitSelectorRe)) {
        sel = sel.trim().replace(addStarRe, '$1 *');
        isContextSelector ||= ['!', '+', '~', '-', '>'].includes(sel[0]);
        selectors.push(sel);
    }

    return {
        selector: selectors.join(','),
        selectors,
        isContextSelector,
    };
});
const positionRe = /(\([^)]*\)|\S)*/;
const parsePositionSelector = memoize((selector) => {
    selector = selector.slice(1).trim();
    const [position] = selector.match(positionRe);
    return [position, selector.slice(position.length + 1)];
});

function _query(selector, context = document, queryFn) {
    const parsed = parseSelector(selector);

    if (!parsed.isContextSelector) {
        return parsed.selector ? _doQuery(context, queryFn, parsed.selector) : selector;
    }

    selector = '';
    const isSingle = parsed.selectors.length === 1;
    for (let sel of parsed.selectors) {
        let positionSel;
        let ctx = context;

        if (sel[0] === '!') {
            [positionSel, sel] = parsePositionSelector(sel);
            ctx = context.parentElement.closest(positionSel);
            if (!sel && isSingle) {
                return ctx;
            }
        }

        if (ctx && sel[0] === '-') {
            [positionSel, sel] = parsePositionSelector(sel);
            ctx = ctx.previousElementSibling;
            ctx = matches(ctx, positionSel) ? ctx : null;
            if (!sel && isSingle) {
                return ctx;
            }
        }

        if (!ctx) {
            continue;
        }

        if (isSingle) {
            if (sel[0] === '~' || sel[0] === '+') {
                sel = `:scope > :nth-child(${index(ctx) + 1}) ${sel}`;
                ctx = ctx.parentElement;
            } else if (sel[0] === '>') {
                sel = `:scope ${sel}`;
            }

            return _doQuery(ctx, queryFn, sel);
        }

        selector += `${selector ? ',' : ''}${domPath(ctx)} ${sel}`;
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
