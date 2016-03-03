import $ from 'jquery';

var dirs = {
    x: ['width', 'left', 'right'],
    y: ['height', 'top', 'bottom']
};

export function position(element, target, attach, targetAttach, offset, targetOffset, flip, boundary) {

    element = $(element);
    target = $(target);
    boundary = boundary && $(boundary);
    attach = getPos(attach);
    targetAttach = getPos(targetAttach);

    var dim = getDimensions(element),
        targetDim = getDimensions(target),
        position = targetDim;

    moveTo(position, attach, dim, -1);
    moveTo(position, targetAttach, targetDim, 1);

    offset = getOffsets(offset, dim.width, dim.height);
    targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

    offset['x'] += targetOffset['x'];
    offset['y'] += targetOffset['y'];

    position.left += offset['x'];
    position.top += offset['y'];

    boundary = getDimensions(boundary || $(window));

    var flipped = {element: attach, target: targetAttach};

    if (flip) {
        $.each(dirs, function (dir, props) {

            if (!(flip === true || flip.indexOf(dir) !== -1)) {
                return;
            }

            var elemOffset = attach[dir] === props[1] ? -dim[props[0]] : attach[dir] === props[2] ? dim[props[0]] : 0,
                targetOffset = targetAttach[dir] === props[1] ? targetDim[props[0]] : targetAttach[dir] === props[2] ? -targetDim[props[0]] : 0;

            if (position[props[1]] < boundary[props[1]] || position[props[1]] + dim[props[0]] > boundary[props[2]]) {

                var newVal = position[props[1]] + elemOffset + targetOffset - offset[dir] * 2;

                if (newVal >= boundary[props[1]] && newVal + dim[props[0]] <= boundary[props[2]]) {
                    position[props[1]] = newVal;

                    flipped.element[dir] = elemOffset ? flipped.element[dir] === dirs[dir][1] ? dirs[dir][2] : dirs[dir][1] : flipped.element[dir];
                    flipped.target[dir] = elemOffset ? flipped.target[dir] === dirs[dir][1] ? dirs[dir][2] : dirs[dir][1] : flipped.target[dir];
                }
            }

        });
    }

    element.offset({left: position.left, top: position.top});

    return flipped;
}

export function getDimensions(elem) {

    elem = $(elem);

    var width = elem.outerWidth(),
        height = elem.outerHeight(),
        offset = elem.offset(),
        left = offset ? offset.left : elem.scrollLeft(),
        top = offset ? offset.top : elem.scrollTop();

    return {width: width, height: height, left: left, top: top, right: left + width, bottom: top + height};
}

function moveTo(position, attach, dim, factor) {
    $.each(dirs, function (dir, props) {
        if (attach[dir] === props[2]) {
            position[props[1]] += dim[props[0]] * factor;
        } else if (attach[dir] === 'center') {
            position[props[1]] += dim[props[0]] * factor / 2;
        }
    });
}

function getPos(pos) {

    var x = /left|center|right/, y = /top|center|bottom/;

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

    offsets = (offsets || '').split(' ');

    return {
        x: offsets[0] ? parseFloat(offsets[0]) * (offsets[0][offsets[0].length - 1] === '%' ? width / 100 : 1) : 0,
        y: offsets[1] ? parseFloat(offsets[1]) * (offsets[1][offsets[1].length - 1] === '%' ? height / 100 : 1) : 0
    };
}
