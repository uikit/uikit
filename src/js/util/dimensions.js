import {css} from './style';
import {attr} from './attr';
import {isVisible} from './filter';
import {each, endsWith, includes, isDocument, isNumeric, isUndefined, isWindow, toFloat, toNode, toWindow, ucfirst} from './lang';

const dirs = {
    width: ['x', 'left', 'right'],
    height: ['y', 'top', 'bottom']
};

export function positionAt(element, target, elAttach, targetAttach, elOffset, targetOffset, flip, boundary) {

    elAttach = getPos(elAttach);
    targetAttach = getPos(targetAttach);

    const flipped = {element: elAttach, target: targetAttach};

    if (!element || !target) {
        return flipped;
    }

    const dim = getDimensions(element);
    const targetDim = getDimensions(target);
    const position = targetDim;

    moveTo(position, elAttach, dim, -1);
    moveTo(position, targetAttach, targetDim, 1);

    elOffset = getOffsets(elOffset, dim.width, dim.height);
    targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

    elOffset['x'] += targetOffset['x'];
    elOffset['y'] += targetOffset['y'];

    position.left += elOffset['x'];
    position.top += elOffset['y'];

    if (flip) {

        const boundaries = [getDimensions(toWindow(element))];

        if (boundary) {
            boundaries.unshift(getDimensions(boundary));
        }

        each(dirs, ([dir, align, alignFlip], prop) => {

            if (!(flip === true || includes(flip, dir))) {
                return;
            }

            boundaries.some(boundary => {

                const elemOffset = elAttach[dir] === align
                    ? -dim[prop]
                    : elAttach[dir] === alignFlip
                        ? dim[prop]
                        : 0;

                const targetOffset = targetAttach[dir] === align
                    ? targetDim[prop]
                    : targetAttach[dir] === alignFlip
                        ? -targetDim[prop]
                        : 0;

                if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {

                    const centerOffset = dim[prop] / 2;
                    const centerTargetOffset = targetAttach[dir] === 'center' ? -targetDim[prop] / 2 : 0;

                    return elAttach[dir] === 'center' && (
                        apply(centerOffset, centerTargetOffset)
                        || apply(-centerOffset, -centerTargetOffset)
                    ) || apply(elemOffset, targetOffset);

                }

                function apply(elemOffset, targetOffset) {

                    const newVal = position[align] + elemOffset + targetOffset - elOffset[dir] * 2;

                    if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                        position[align] = newVal;

                        ['element', 'target'].forEach(el => {
                            flipped[el][dir] = !elemOffset
                                ? flipped[el][dir]
                                : flipped[el][dir] === dirs[prop][1]
                                    ? dirs[prop][2]
                                    : dirs[prop][1];
                        });

                        return true;
                    }

                }

            });

        });
    }

    offset(element, position);

    return flipped;
}

export function offset(element, coordinates) {

    if (!coordinates) {
        return getDimensions(element);
    }

    const currentOffset = offset(element);
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

    if (!element) {
        return {};
    }

    const {pageYOffset: top, pageXOffset: left} = toWindow(element);

    if (isWindow(element)) {

        const height = element.innerHeight;
        const width = element.innerWidth;

        return {
            top,
            left,
            height,
            width,
            bottom: top + height,
            right: left + width
        };
    }

    let style, hidden;

    if (!isVisible(element) && css(element, 'display') === 'none') {

        style = attr(element, 'style');
        hidden = attr(element, 'hidden');

        attr(element, {
            style: `${style || ''};display:block !important;`,
            hidden: null
        });
    }

    element = toNode(element);

    const rect = element.getBoundingClientRect();

    if (!isUndefined(style)) {
        attr(element, {style, hidden});
    }

    return {
        height: rect.height,
        width: rect.width,
        top: rect.top + top,
        left: rect.left + left,
        bottom: rect.bottom + top,
        right: rect.right + left
    };
}

export function position(element, parent) {

    parent = parent || toNode(element).offsetParent || toWindow(element).document.documentElement;

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

export function boxModelAdjust(element, prop, sizing = 'border-box') {
    return css(element, 'boxSizing') === sizing
        ? dirs[prop].slice(1).map(ucfirst).reduce((value, prop) =>
            value
            + toFloat(css(element, `padding${prop}`))
            + toFloat(css(element, `border${prop}Width`))
            , 0)
        : 0;
}

function moveTo(position, attach, dim, factor) {
    each(dirs, ([dir, align, alignFlip], prop) => {
        if (attach[dir] === alignFlip) {
            position[align] += dim[prop] * factor;
        } else if (attach[dir] === 'center') {
            position[align] += dim[prop] * factor / 2;
        }
    });
}

function getPos(pos) {

    const x = /left|center|right/;
    const y = /top|center|bottom/;

    pos = (pos || '').split(' ');

    if (pos.length === 1) {
        pos = x.test(pos[0])
            ? pos.concat('center')
            : y.test(pos[0])
                ? ['center'].concat(pos)
                : ['center', 'center'];
    }

    return {
        x: x.test(pos[0]) ? pos[0] : 'center',
        y: y.test(pos[1]) ? pos[1] : 'center'
    };
}

function getOffsets(offsets, width, height) {

    const [x, y] = (offsets || '').split(' ');

    return {
        x: x ? toFloat(x) * (endsWith(x, '%') ? width / 100 : 1) : 0,
        y: y ? toFloat(y) * (endsWith(y, '%') ? height / 100 : 1) : 0
    };
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
