import {css} from './style';
import {attr} from './attr';
import {isVisible} from './filter';
import {endsWith, isDocument, isNumeric, isUndefined, isWindow, toFloat, toNode, toWindow, ucfirst} from './lang';

export function offset(element, coordinates) {

    if (!coordinates) {
        return getDimensions(element);
    }

    const currentOffset = getDimensions(element);
    const pos = css(element, 'position');

    ['left', 'top'].forEach(prop => {
        if (prop in coordinates) {
            const value = css(element, prop);
            css(element, prop, coordinates[prop] - currentOffset[prop]
                + toFloat(pos === 'absolute' && value === 'auto'
                    ? position(element)[prop]
                    : value)
            );
        }
    });
}

function getDimensions(element) {

    const {pageYOffset: top, pageXOffset: left} = toWindow(element);

    const rect = isWindow(element)
        ? {height: height(element), width: width(element), top: 0, left: 0}
        : getRect(toNode(element));

    return {
        height: rect.height,
        width: rect.width,
        top: rect.top + top,
        left: rect.left + left,
        bottom: rect.top + rect.height + top,
        right: rect.left + rect.width + left
    };
}

export function position(element, parent) {

    parent = parent || (toNode(element) || {}).offsetParent || toWindow(element).document.documentElement;

    const elementOffset = offset(element);
    const parentOffset = offset(parent);

    return {
        top: elementOffset.top - parentOffset.top - toFloat(css(parent, 'borderTopWidth')),
        left: elementOffset.left - parentOffset.left - toFloat(css(parent, 'borderLeftWidth'))
    };
}

export function offsetPosition(element) {
    const offset = [0, 0];

    element = toNode(element);

    do {

        offset[0] += element.offsetTop;
        offset[1] += element.offsetLeft;

        if (css(element, 'position') === 'fixed') {
            const win = toWindow(element);
            offset[0] += win.pageYOffset;
            offset[1] += win.pageXOffset;
            return offset;
        }

    } while ((element = element.offsetParent));

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

            css(element, prop, !value && value !== 0
                ? ''
                : +value + boxModelAdjust(element, prop) + 'px'
            );

        }

    };
}

const dirs = {
    width: ['left', 'right'],
    height: ['top', 'bottom']
};

export function boxModelAdjust(element, prop, sizing = 'border-box') {
    return css(element, 'boxSizing') === sizing
        ? dirs[prop].map(ucfirst).reduce((value, prop) =>
            value
            + toFloat(css(element, `padding${prop}`))
            + toFloat(css(element, `border${prop}Width`))
            , 0)
        : 0;
}

export function flipPosition(pos) {
    switch (pos) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        default:
            return pos;
    }
}

export function toPx(value, property = 'width', element = window) {
    return isNumeric(value)
        ? +value
        : endsWith(value, 'vh')
            ? percent(height(toWindow(element)), value)
            : endsWith(value, 'vw')
                ? percent(width(toWindow(element)), value)
                : endsWith(value, '%')
                    ? percent(getDimensions(element)[property], value)
                    : toFloat(value);
}

function percent(base, value) {
    return base * toFloat(value) / 100;
}

function getRect(element) {

    if (!element) {
        return {};
    }

    let style;

    if (!isVisible(element)) {
        style = attr(element, 'style');
        element.style.setProperty('display', 'block', 'important');
    }

    const rect = element.getBoundingClientRect();

    attr(element, 'style', style);

    return rect;
}
