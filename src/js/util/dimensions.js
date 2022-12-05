import { on } from './event';
import { css } from './style';
import { $, append, remove } from './dom';
import {
    each,
    isDocument,
    isElement,
    isString,
    isUndefined,
    isWindow,
    memoize,
    sumBy,
    toFloat,
    toNode,
    toWindow,
    ucfirst,
} from './lang';

const dirs = {
    width: ['left', 'right'],
    height: ['top', 'bottom'],
};

export function dimensions(element) {
    const rect = isElement(element)
        ? toNode(element).getBoundingClientRect()
        : { height: height(element), width: width(element), top: 0, left: 0 };

    return {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        left: rect.left,
        bottom: rect.top + rect.height,
        right: rect.left + rect.width,
    };
}

export function offset(element, coordinates) {
    const currentOffset = dimensions(element);

    if (element) {
        const { scrollY, scrollX } = toWindow(element);
        const offsetBy = { height: scrollY, width: scrollX };

        for (const dir in dirs) {
            for (const prop of dirs[dir]) {
                currentOffset[prop] += offsetBy[dir];
            }
        }
    }

    if (!coordinates) {
        return currentOffset;
    }

    const pos = css(element, 'position');

    each(css(element, ['left', 'top']), (value, prop) =>
        css(
            element,
            prop,
            coordinates[prop] -
                currentOffset[prop] +
                toFloat(pos === 'absolute' && value === 'auto' ? position(element)[prop] : value)
        )
    );
}

export function position(element) {
    let { top, left } = offset(element);

    const {
        ownerDocument: { body, documentElement },
        offsetParent,
    } = toNode(element);
    let parent = offsetParent || documentElement;

    while (
        parent &&
        (parent === body || parent === documentElement) &&
        css(parent, 'position') === 'static'
    ) {
        parent = parent.parentNode;
    }

    if (isElement(parent)) {
        const parentOffset = offset(parent);
        top -= parentOffset.top + toFloat(css(parent, 'borderTopWidth'));
        left -= parentOffset.left + toFloat(css(parent, 'borderLeftWidth'));
    }

    return {
        top: top - toFloat(css(element, 'marginTop')),
        left: left - toFloat(css(element, 'marginLeft')),
    };
}

export function offsetPosition(element) {
    element = toNode(element);

    const offset = [element.offsetTop, element.offsetLeft];

    while ((element = element.offsetParent)) {
        offset[0] += element.offsetTop + toFloat(css(element, `borderTopWidth`));
        offset[1] += element.offsetLeft + toFloat(css(element, `borderLeftWidth`));

        if (css(element, 'position') === 'fixed') {
            const win = toWindow(element);
            offset[0] += win.scrollY;
            offset[1] += win.scrollX;
            return offset;
        }
    }

    return offset;
}

export const height = dimension('height');
export const width = dimension('width');

function dimension(prop) {
    const propName = ucfirst(prop);
    return (element, value) => {
        if (isUndefined(value)) {
            if (isWindow(element)) {
                return element[`inner${propName}`];
            }

            if (isDocument(element)) {
                const doc = element.documentElement;
                return Math.max(doc[`offset${propName}`], doc[`scroll${propName}`]);
            }

            element = toNode(element);

            value = css(element, prop);
            value = value === 'auto' ? element[`offset${propName}`] : toFloat(value) || 0;

            return value - boxModelAdjust(element, prop);
        } else {
            return css(
                element,
                prop,
                !value && value !== 0 ? '' : +value + boxModelAdjust(element, prop) + 'px'
            );
        }
    };
}

export function boxModelAdjust(element, prop, sizing = 'border-box') {
    return css(element, 'boxSizing') === sizing
        ? sumBy(
              dirs[prop].map(ucfirst),
              (prop) =>
                  toFloat(css(element, `padding${prop}`)) +
                  toFloat(css(element, `border${prop}Width`))
          )
        : 0;
}

export function flipPosition(pos) {
    for (const dir in dirs) {
        for (const i in dirs[dir]) {
            if (dirs[dir][i] === pos) {
                return dirs[dir][1 - i];
            }
        }
    }
    return pos;
}

export function toPx(value, property = 'width', element = window, offsetDim = false) {
    if (!isString(value)) {
        return toFloat(value);
    }

    return sumBy(parseCalc(value), (value) => {
        const unit = parseUnit(value);

        return unit
            ? percent(
                  unit === 'vh'
                      ? getViewportHeight()
                      : unit === 'vw'
                      ? width(toWindow(element))
                      : offsetDim
                      ? element[`offset${ucfirst(property)}`]
                      : dimensions(element)[property],
                  value
              )
            : value;
    });
}

const calcRe = /-?\d+(?:\.\d+)?(?:v[wh]|%|px)?/g;
const parseCalc = memoize((calc) => calc.toString().replace(/\s/g, '').match(calcRe) || []);
const unitRe = /(?:v[hw]|%)$/;
const parseUnit = memoize((str) => (str.match(unitRe) || [])[0]);

function percent(base, value) {
    return (base * toFloat(value)) / 100;
}

let vh;
let vhEl;

function getViewportHeight() {
    if (vh) {
        return vh;
    }
    if (!vhEl) {
        vhEl = $('<div>');
        css(vhEl, {
            height: '100vh',
            position: 'fixed',
        });
        on(window, 'resize', () => (vh = null));
    }

    append(document.body, vhEl);
    vh = vhEl.clientHeight;
    remove(vhEl);
    return vh;
}
