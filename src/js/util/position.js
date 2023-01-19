import { css } from './style';
import { within } from './filter';
import { offset } from './dimensions';
import { clamp, isArray, ucfirst } from './lang';
import { offsetViewport, overflowParents } from './viewport';

const dirs = [
    ['width', 'x', 'left', 'right'],
    ['height', 'y', 'top', 'bottom'],
];

export function positionAt(element, target, options) {
    options = {
        attach: {
            element: ['left', 'top'],
            target: ['left', 'top'],
            ...options.attach,
        },
        offset: [0, 0],
        placement: [],
        ...options,
    };

    if (!isArray(target)) {
        target = [target, target];
    }

    offset(element, getPosition(element, target, options));
}

function getPosition(element, target, options) {
    const position = attachTo(element, target, options);
    const { boundary, viewportOffset = 0, placement } = options;

    let offsetPosition = position;
    for (const [i, [prop, , start, end]] of Object.entries(dirs)) {
        const viewport = getViewport(element, target[i], viewportOffset, boundary, i);

        if (isWithin(position, viewport, i)) {
            continue;
        }

        let offsetBy = 0;

        // Flip
        if (placement[i] === 'flip') {
            const attach = options.attach.target[i];
            if (
                (attach === end && position[end] <= viewport[end]) ||
                (attach === start && position[start] >= viewport[start])
            ) {
                continue;
            }

            offsetBy = flip(element, target, options, i)[start] - position[start];

            const scrollArea = getScrollArea(element, target[i], viewportOffset, i);

            if (!isWithin(applyOffset(position, offsetBy, i), scrollArea, i)) {
                if (isWithin(position, scrollArea, i)) {
                    continue;
                }

                if (options.recursion) {
                    return false;
                }

                const newPos = flipAxis(element, target, options);

                if (newPos && isWithin(newPos, scrollArea, 1 - i)) {
                    return newPos;
                }

                continue;
            }

            // Shift
        } else if (placement[i] === 'shift') {
            const targetDim = offset(target[i]);
            const { offset: elOffset } = options;
            offsetBy =
                clamp(
                    clamp(position[start], viewport[start], viewport[end] - position[prop]),
                    targetDim[start] - position[prop] + elOffset[i],
                    targetDim[end] - elOffset[i]
                ) - position[start];
        }

        offsetPosition = applyOffset(offsetPosition, offsetBy, i);
    }

    return offsetPosition;
}

function attachTo(element, target, options) {
    let { attach, offset: offsetBy } = {
        attach: {
            element: ['left', 'top'],
            target: ['left', 'top'],
            ...options.attach,
        },
        offset: [0, 0],
        ...options,
    };

    let elOffset = offset(element);

    for (const [i, [prop, , start, end]] of Object.entries(dirs)) {
        const targetOffset =
            attach.target[i] === attach.element[i] ? offsetViewport(target[i]) : offset(target[i]);

        elOffset = applyOffset(
            elOffset,
            targetOffset[start] -
                elOffset[start] +
                moveBy(attach.target[i], end, targetOffset[prop]) -
                moveBy(attach.element[i], end, elOffset[prop]) +
                +offsetBy[i],
            i
        );
    }
    return elOffset;
}

function applyOffset(position, offset, i) {
    const [, dir, start, end] = dirs[i];
    const newPos = { ...position };
    newPos[start] = position[dir] = position[start] + offset;
    newPos[end] += offset;
    return newPos;
}

function moveBy(attach, end, dim) {
    return attach === 'center' ? dim / 2 : attach === end ? dim : 0;
}

function getViewport(element, target, viewportOffset, boundary, i) {
    let viewport = getIntersectionArea(...commonScrollParents(element, target).map(offsetViewport));

    if (viewportOffset) {
        viewport[dirs[i][2]] += viewportOffset;
        viewport[dirs[i][3]] -= viewportOffset;
    }

    if (boundary) {
        viewport = getIntersectionArea(
            viewport,
            offset(isArray(boundary) ? boundary[i] : boundary)
        );
    }

    return viewport;
}

function getScrollArea(element, target, viewportOffset, i) {
    const [prop, axis, start, end] = dirs[i];
    const [scrollElement] = commonScrollParents(element, target);
    const viewport = offsetViewport(scrollElement);

    if (['auto', 'scroll'].includes(css(scrollElement, `overflow-${axis}`))) {
        viewport[start] -= scrollElement[`scroll${ucfirst(start)}`];
        viewport[end] = viewport[start] + scrollElement[`scroll${ucfirst(prop)}`];
    }

    viewport[start] += viewportOffset;
    viewport[end] -= viewportOffset;

    return viewport;
}

function commonScrollParents(element, target) {
    return overflowParents(target).filter((parent) => within(element, parent));
}

function getIntersectionArea(...rects) {
    let area = {};
    for (const rect of rects) {
        for (const [, , start, end] of dirs) {
            area[start] = Math.max(area[start] || 0, rect[start]);
            area[end] = Math.min(...[area[end], rect[end]].filter(Boolean));
        }
    }
    return area;
}

function isWithin(positionA, positionB, i) {
    const [, , start, end] = dirs[i];
    return positionA[start] >= positionB[start] && positionA[end] <= positionB[end];
}

function flip(element, target, { offset, attach }, i) {
    return attachTo(element, target, {
        attach: {
            element: flipAttach(attach.element, i),
            target: flipAttach(attach.target, i),
        },
        offset: flipOffset(offset, i),
    });
}

function flipAxis(element, target, options) {
    return getPosition(element, target, {
        ...options,
        attach: {
            element: options.attach.element.map(flipAttachAxis).reverse(),
            target: options.attach.target.map(flipAttachAxis).reverse(),
        },
        offset: options.offset.reverse(),
        placement: options.placement.reverse(),
        recursion: true,
    });
}

function flipAttach(attach, i) {
    const newAttach = [...attach];
    const index = dirs[i].indexOf(attach[i]);
    if (~index) {
        newAttach[i] = dirs[i][1 - (index % 2) + 2];
    }
    return newAttach;
}

function flipAttachAxis(prop) {
    for (let i = 0; i < dirs.length; i++) {
        const index = dirs[i].indexOf(prop);
        if (~index) {
            return dirs[1 - i][(index % 2) + 2];
        }
    }
}

function flipOffset(offset, i) {
    offset = [...offset];
    offset[i] *= -1;
    return offset;
}
