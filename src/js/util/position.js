import { offset } from './dimensions';
import { clamp, isArray, ucfirst } from './lang';
import { offsetViewport, scrollParents } from './viewport';

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

    let {
        attach: { element: elAttach, target: targetAttach },
        offset: elOffset,
        boundary,
        viewportOffset,
        placement,
    } = options;

    let offsetPosition = position;
    for (const [i, [prop, , start, end]] of Object.entries(dirs)) {
        let viewports = scrollParents(target[i]);
        const scrollArea = getScrollArea(viewports[0], viewportOffset, i);

        let viewport = getIntersectionArea(...viewports.map(offsetViewport));

        if (viewportOffset) {
            viewport[start] += viewportOffset;
            viewport[end] -= viewportOffset;
        }

        if (boundary) {
            viewport = getIntersectionArea(viewport, offsetViewport(boundary));
        }

        if (isWithin(position, viewport, i)) {
            continue;
        }

        let offsetBy = 0;

        // Flip
        if (placement[i] === 'flip') {
            if (
                (targetAttach[i] === end && position[end] <= viewport[end]) ||
                (targetAttach[i] === start && position[start] >= viewport[start])
            ) {
                continue;
            }

            offsetBy = flip(element, target, options, i)[start] - position[start];

            if (!isWithin(applyOffset(position, offsetBy, i), scrollArea, i)) {
                if (isWithin(position, scrollArea, i)) {
                    continue;
                }

                if (options.recursion) {
                    return false;
                }

                const newPos = getPosition(element, target, {
                    ...options,
                    attach: {
                        element: elAttach.map(flipAxis).reverse(),
                        target: targetAttach.map(flipAxis).reverse(),
                    },
                    offset: elOffset.reverse(),
                    placement: placement.reverse(),
                    recursion: true,
                });

                if (newPos && isWithin(newPos, scrollArea, 1 - i)) {
                    return newPos;
                }

                continue;
            }

            // Shift
        } else if (placement[i] === 'shift') {
            const targetDim = offset(target[i]);
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

function getScrollArea(scrollElement, viewportOffset, i) {
    const [prop, , start, end] = dirs[i];
    const viewport = offsetViewport(scrollElement);
    viewport[start] -= scrollElement[`scroll${ucfirst(start)}`] - viewportOffset;
    viewport[end] = viewport[start] + scrollElement[`scroll${ucfirst(prop)}`] - viewportOffset;
    return viewport;
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

function flipAttach(attach, i) {
    const newAttach = [...attach];
    const index = dirs[i].indexOf(attach[i]);
    if (~index) {
        newAttach[i] = dirs[i][1 - (index % 2) + 2];
    }
    return newAttach;
}

function flipOffset(offset, i) {
    offset = [...offset];
    offset[i] *= -1;
    return offset;
}

function flipAxis(prop) {
    for (let i = 0; i < dirs.length; i++) {
        const index = dirs[i].indexOf(prop);
        if (~index) {
            return dirs[1 - i][(index % 2) + 2];
        }
    }
}
