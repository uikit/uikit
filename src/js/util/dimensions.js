import {css} from './style';
import {each, endsWith, isDocument, isElement, isNumeric, isUndefined, isWindow, toFloat, toNode, toWindow, ucfirst} from './lang';

const dirs = {
    width: ['left', 'right'],
    height: ['top', 'bottom']
};

export function dimensions(element) {

    const rect = isElement(element)
        ? toNode(element).getBoundingClientRect()
        : {height: height(element), width: width(element), top: 0, left: 0};

    return {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        left: rect.left,
        bottom: rect.top + rect.height,
        right: rect.left + rect.width
    };
}

export function offset(element, coordinates) {

    const currentOffset = dimensions(element);
    const {pageYOffset, pageXOffset} = toWindow(element);
    const offsetBy = {height: pageYOffset, width: pageXOffset};

    for (const dir in dirs) {
        for (const i in dirs[dir]) {
            currentOffset[dirs[dir][i]] += offsetBy[dir];
        }
    }

    if (!coordinates) {
        return currentOffset;
    }

    const pos = css(element, 'position');

    each(css(element, ['left', 'top']), (value, prop) =>
        css(element, prop, coordinates[prop]
            - currentOffset[prop]
            + toFloat(pos === 'absolute' && value === 'auto'
                ? position(element)[prop]
                : value)
        )
    );
}

export function position(element) {

    let {top, left} = offset(element);

    const {ownerDocument: {body, documentElement}, offsetParent} = toNode(element);
    let parent = offsetParent || documentElement;

    while (parent && (parent === body || parent === documentElement) && css(parent, 'position') === 'static') {
        parent = parent.parentNode;
    }

    if (isElement(parent)) {
        const parentOffset = offset(parent);
        top -= parentOffset.top + toFloat(css(parent, 'borderTopWidth'));
        left -= parentOffset.left + toFloat(css(parent, 'borderLeftWidth'));
    }

    return {
        top: top - toFloat(css(element, 'marginTop')),
        left: left - toFloat(css(element, 'marginLeft'))
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

            return css(element, prop, !value && value !== 0
                ? ''
                : +value + boxModelAdjust(element, prop) + 'px'
            );

        }

    };
}

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
    for (const dir in dirs) {
        for (const i in dirs[dir]) {
            if (dirs[dir][i] === pos) {
                return dirs[dir][1 - i];
            }
        }
    }
    return pos;
}

export function toPx(value, property = 'width', element = window) {
    return isNumeric(value)
        ? +value
        : endsWith(value, 'vh')
            ? percent(height(toWindow(element)), value)
            : endsWith(value, 'vw')
                ? percent(width(toWindow(element)), value)
                : endsWith(value, '%')
                    ? percent(dimensions(element)[property], value)
                    : toFloat(value);
}

function percent(base, value) {
    return base * toFloat(value) / 100;
}
