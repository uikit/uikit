import { offset } from './dimensions';
import { clamp, includes, ucfirst } from './lang';
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
        ...options,
    };

    const dim = options.flip
        ? attachToWithFlip(element, target, options)
        : attachTo(element, target, options);

    offset(element, dim);
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

    const position = offset(element);
    const targetOffset = offset(target);
    for (const [i, [prop, dir, start, end]] of Object.entries(dirs)) {
        position[start] = position[dir] =
            targetOffset[start] +
            moveBy(attach.target[i], end, targetOffset[prop]) -
            moveBy(attach.element[i], end, position[prop]) +
            +offsetBy[i];
        position[end] = position[start] + position[prop];
    }
    return position;
}

function attachToWithFlip(element, target, options) {
    const position = attachTo(element, target, options);
    const targetDim = offset(target);

    let {
        flip,
        attach: { element: elAttach, target: targetAttach },
        offset: elOffset,
        boundary,
        viewport,
        viewportPadding,
    } = options;

    let viewports = scrollParents(element);
    if (boundary === target) {
        viewports = viewports.filter((viewport) => viewport !== boundary);
    }
    const [scrollElement] = viewports;
    viewports.push(viewport);

    const offsetPosition = { ...position };
    for (const [i, [prop, dir, start, end]] of Object.entries(dirs)) {
        if (flip !== true && !includes(flip, dir)) {
            continue;
        }

        const willFlip =
            !intersectLine(position, targetDim, i) && intersectLine(position, targetDim, 1 - i);

        viewport = getIntersectionArea(...viewports.filter(Boolean).map(offsetViewport));

        if (viewportPadding) {
            viewport[start] += viewportPadding;
            viewport[end] -= viewportPadding;
        }

        if (boundary && !willFlip && position[prop] <= offset(boundary)[prop]) {
            viewport = getIntersectionArea(viewport, offset(boundary));
        }

        const isInStartBoundary = position[start] >= viewport[start];
        const isInEndBoundary = position[end] <= viewport[end];

        if (isInStartBoundary && isInEndBoundary) {
            continue;
        }

        let offsetBy;

        // Flip
        if (willFlip) {
            if (
                (elAttach[i] === end && isInStartBoundary) ||
                (elAttach[i] === start && isInEndBoundary)
            ) {
                continue;
            }

            offsetBy =
                (elAttach[i] === start
                    ? -position[prop]
                    : elAttach[i] === end
                    ? position[prop]
                    : 0) +
                (targetAttach[i] === start
                    ? targetDim[prop]
                    : targetAttach[i] === end
                    ? -targetDim[prop]
                    : 0) -
                elOffset[i] * 2;

            if (
                !isInScrollArea(
                    {
                        ...position,
                        [start]: position[start] + offsetBy,
                        [end]: position[end] + offsetBy,
                    },
                    scrollElement,
                    i
                )
            ) {
                if (isInScrollArea(position, scrollElement, i)) {
                    continue;
                }

                if (options.recursion) {
                    return false;
                }

                const newPos = attachToWithFlip(element, target, {
                    ...options,
                    attach: {
                        element: elAttach.map(flipDir).reverse(),
                        target: targetAttach.map(flipDir).reverse(),
                    },
                    offset: elOffset.reverse(),
                    flip: flip === true ? flip : [...flip, dirs[1 - i][1]],
                    recursion: true,
                });

                if (newPos && isInScrollArea(newPos, scrollElement, 1 - i)) {
                    return newPos;
                }
            }

            // Move
        } else {
            offsetBy =
                clamp(
                    clamp(position[start], viewport[start], viewport[end] - position[prop]),
                    targetDim[start] - position[prop] + elOffset[i],
                    targetDim[end] - elOffset[i]
                ) - position[start];
        }

        offsetPosition[start] = position[dir] = position[start] + offsetBy;
        offsetPosition[end] += offsetBy;
    }

    return offsetPosition;
}

function moveBy(start, end, dim) {
    return start === 'center' ? dim / 2 : start === end ? dim : 0;
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

function isInScrollArea(position, scrollElement, dir) {
    const viewport = offsetViewport(scrollElement);
    const [prop, , start, end] = dirs[dir];
    viewport[start] -= scrollElement[`scroll${ucfirst(start)}`];
    viewport[end] = viewport[start] + scrollElement[`scroll${ucfirst(prop)}`];

    return position[start] >= viewport[start] && position[end] <= viewport[end];
}

function intersectLine(dimA, dimB, dir) {
    const [, , start, end] = dirs[dir];
    return dimA[end] > dimB[start] && dimB[end] > dimA[start];
}

function flipDir(prop) {
    for (let i = 0; i < dirs.length; i++) {
        const index = dirs[i].indexOf(prop);
        if (~index) {
            return dirs[1 - i][(index % 2) + 2];
        }
    }
}
