import { offset } from './dimensions';
import { clamp, includes } from './lang';
import { getViewport, scrollParents } from './viewport';

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
    for (const i in dirs) {
        const [prop, dir, start, end] = dirs[i];
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
    let position = attachTo(element, target, options);
    const targetDim = offset(target);
    const viewports = scrollParents(element).map(getViewport);

    let {
        flip,
        attach: { element: elAttach, target: targetAttach },
        offset: elOffset,
        boundary,
        viewport,
        recursion = 0,
    } = options;

    viewports.push(viewport);

    for (const i in dirs) {
        const [prop, dir, start, end] = dirs[i];

        if (flip !== true && !includes(flip, dir)) {
            continue;
        }

        const willFlip =
            !intersectLine(position, targetDim, i) && intersectLine(position, targetDim, 1 - i);

        viewport = getIntersectionArea(
            ...viewports,
            willFlip || position[prop] > offset(boundary)[prop] ? null : boundary
        );
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
                position[start] + offsetBy < viewport[start] ||
                position[end] + offsetBy > viewport[end]
            ) {
                if (recursion < 1) {
                    position =
                        attachToWithFlip(element, target, {
                            ...options,
                            attach: {
                                element: elAttach.map(flipDir).reverse(),
                                target: targetAttach.map(flipDir).reverse(),
                            },
                            offset: elOffset.reverse(),
                            flip: flip === true ? flip : [...flip, dirs[1 - i][1]],
                            recursion: recursion + 1,
                        }) || position;

                    continue;
                } else {
                    return false;
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

        position[start] = position[dir] = position[start] + offsetBy;
        position[end] += offsetBy;
    }

    return position;
}

function moveBy(start, end, dim) {
    return start === 'center' ? dim / 2 : start === end ? dim : 0;
}

function getIntersectionArea(...elements) {
    let intersection;
    for (const el of elements.filter(Boolean)) {
        const rect = offset(el);
        if (!intersection) {
            intersection = rect;
            continue;
        }
        for (const prop of ['left', 'top']) {
            intersection[prop] = Math.max(rect[prop], intersection[prop]);
        }
        for (const prop of ['right', 'bottom']) {
            intersection[prop] = Math.min(rect[prop], intersection[prop]);
        }
    }
    return intersection;
}

function intersectLine(dimA, dimB, dir) {
    const [, , start, end] = dirs[dir];
    return dimA[end] > dimB[start] && dimB[end] > dimA[start];
}

function flipDir(prop) {
    for (const i in dirs) {
        const index = dirs[i].indexOf(prop);
        if (~index) {
            return dirs[1 - i][(index % 2) + 2];
        }
    }
}
