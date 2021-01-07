import {offset} from './dimensions';
import {each, endsWith, includes, toFloat} from './lang';
import {getViewport, scrollParents} from './viewport';

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

    const dim = offset(element);
    const targetDim = offset(target);
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

        let boundaries = scrollParents(element).map(getViewport);

        if (boundary && includes(boundaries, boundary)) {
            boundaries.unshift(boundary);
        }

        boundaries = boundaries.map(el => offset(el));

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

                    const newVal = toFloat((position[align] + elemOffset + targetOffset - elOffset[dir] * 2).toFixed(4));

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
