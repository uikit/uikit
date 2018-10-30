import {css} from './style';
import {attr} from './attr';
import {isVisible} from './filter';
import {clamp, each, endsWith, includes, intersectRect, isDocument, isUndefined, isWindow, pointInRect, toFloat, toNode, ucfirst} from './lang';

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

    boundary = getDimensions(boundary || window(element));

    if (flip) {
        each(dirs, ([dir, align, alignFlip], prop) => {

            if (!(flip === true || includes(flip, dir))) {
                return;
            }

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

                elAttach[dir] === 'center' && (
                    apply(centerOffset, centerTargetOffset)
                    || apply(-centerOffset, -centerTargetOffset)
                ) || apply(elemOffset, targetOffset);

            }

            function apply(elemOffset, targetOffset) {

                const newVal = position[align] + elemOffset + targetOffset - elOffset[dir] * 2;

                if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                    position[align] = newVal;

                    ['element', 'target'].forEach((el) => {
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
    }

    offset(element, position);

    return flipped;
}

export function offset(element, coordinates) {

    element = toNode(element);

    if (coordinates) {

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

        return;
    }

    return getDimensions(element);
}

function getDimensions(element) {

    element = toNode(element);

    const {pageYOffset: top, pageXOffset: left} = window(element);

    if (isWindow(element)) {

        const height = element.innerHeight;
        const width = element.innerWidth;

        return {
            top,
            left,
            height,
            width,
            bottom: top + height,
            right: left + width,
        };
    }

    let style, hidden;

    if (!isVisible(element)) {
        style = attr(element, 'style');
        hidden = attr(element, 'hidden');

        attr(element, {
            style: `${style || ''};display:block !important;`,
            hidden: null
        });
    }

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
        right: rect.right + left,
    };
}

export function position(element) {
    element = toNode(element);

    const parent = element.offsetParent || docEl(element);
    const parentOffset = offset(parent);
    const {top, left} = ['top', 'left'].reduce((props, prop) => {
        const propName = ucfirst(prop);
        props[prop] -= parentOffset[prop]
            + toFloat(css(element, `margin${propName}`))
            + toFloat(css(parent, `border${propName}Width`));
        return props;
    }, offset(element));

    return {top, left};
}

export const height = dimension('height');
export const width = dimension('width');

function dimension(prop) {
    const propName = ucfirst(prop);
    return (element, value) => {

        element = toNode(element);

        if (isUndefined(value)) {

            if (isWindow(element)) {
                return element[`inner${propName}`];
            }

            if (isDocument(element)) {
                const doc = element.documentElement;
                return Math.max(doc[`offset${propName}`], doc[`scroll${propName}`]);
            }

            value = css(element, prop);
            value = value === 'auto' ? element[`offset${propName}`] : toFloat(value) || 0;

            return value - boxModelAdjust(prop, element);

        } else {

            css(element, prop, !value && value !== 0
                ? ''
                : +value + boxModelAdjust(prop, element) + 'px'
            );

        }

    };
}

export function boxModelAdjust(prop, element, sizing = 'border-box') {
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
            ? pos.concat(['center'])
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

export function isInView(element, topOffset = 0, leftOffset = 0, relativeToViewport) {

    if (!isVisible(element)) {
        return false;
    }

    element = toNode(element);

    const win = window(element);
    let client, bounding;

    if (relativeToViewport) {

        client = element.getBoundingClientRect();
        bounding = {
            top: -topOffset,
            left: -leftOffset,
            bottom: topOffset + height(win),
            right: leftOffset + width(win)
        };

    } else {

        const [elTop, elLeft] = offsetPosition(element);
        const {pageYOffset: top, pageXOffset: left} = win;

        client = {
            top: elTop,
            left: elLeft,
            bottom: elTop + element.offsetHeight,
            right: elTop + element.offsetWidth
        };
        bounding = {
            top: top - topOffset,
            left: left - leftOffset,
            bottom: top + topOffset + height(win),
            right: left + leftOffset + width(win)
        };
    }

    return intersectRect(client, bounding) || pointInRect({x: client.left, y: client.top}, bounding);

}

export function scrolledOver(element, heightOffset = 0) {

    if (!isVisible(element)) {
        return 0;
    }

    element = toNode(element);

    const win = window(element);
    const doc = document(element);
    const elHeight = element.offsetHeight + heightOffset;
    const [top] = offsetPosition(element);
    const vp = height(win);
    const vh = vp + Math.min(0, top - vp);
    const diff = Math.max(0, vp - (height(doc) + heightOffset - (top + elHeight)));

    return clamp(((vh + win.pageYOffset - top) / ((vh + (elHeight - (diff < vp ? diff : 0))) / 100)) / 100);
}

export function scrollTop(element, top) {
    element = toNode(element);

    if (isWindow(element) || isDocument(element)) {
        const {scrollTo, pageXOffset} = window(element);
        scrollTo(pageXOffset, top);
    } else {
        element.scrollTop = top;
    }
}

export function offsetPosition(element) {
    const offset = [0, 0];

    do {

        offset[0] += element.offsetTop;
        offset[1] += element.offsetLeft;

        if (css(element, 'position') === 'fixed') {
            const win = window(element);
            offset[0] += win.pageYOffset;
            offset[1] += win.pageXOffset;
            return offset;
        }

    } while ((element = element.offsetParent));

    return offset;
}

function window(element) {
    return isWindow(element) ? element : document(element).defaultView;
}

function document(element) {
    return toNode(element).ownerDocument;
}

function docEl(element) {
    return document(element).documentElement;
}
