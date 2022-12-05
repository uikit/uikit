import { translate } from '../../mixin/internal/slideshow-animations';
import {
    children,
    clamp,
    createEvent,
    css,
    Deferred,
    dimensions,
    findIndex,
    includes,
    isRtl,
    noop,
    position,
    sumBy,
    Transition,
    trigger,
} from 'uikit-util';

export default function (prev, next, dir, { center, easing, list }) {
    const deferred = new Deferred();

    const from = prev
        ? getLeft(prev, list, center)
        : getLeft(next, list, center) + dimensions(next).width * dir;
    const to = next
        ? getLeft(next, list, center)
        : from + dimensions(prev).width * dir * (isRtl ? -1 : 1);

    return {
        dir,

        show(duration, percent = 0, linear) {
            const timing = linear ? 'linear' : easing;
            duration -= Math.round(duration * clamp(percent, -1, 1));

            this.translate(percent);

            percent = prev ? percent : clamp(percent, 0, 1);
            triggerUpdate(this.getItemIn(), 'itemin', { percent, duration, timing, dir });
            prev &&
                triggerUpdate(this.getItemIn(true), 'itemout', {
                    percent: 1 - percent,
                    duration,
                    timing,
                    dir,
                });

            Transition.start(
                list,
                { transform: translate(-to * (isRtl ? -1 : 1), 'px') },
                duration,
                timing
            ).then(deferred.resolve, noop);

            return deferred.promise;
        },

        cancel() {
            Transition.cancel(list);
        },

        reset() {
            css(list, 'transform', '');
        },

        forward(duration, percent = this.percent()) {
            Transition.cancel(list);
            return this.show(duration, percent, true);
        },

        translate(percent) {
            const distance = this.getDistance() * dir * (isRtl ? -1 : 1);

            css(
                list,
                'transform',
                translate(
                    clamp(
                        -to + (distance - distance * percent),
                        -getWidth(list),
                        dimensions(list).width
                    ) * (isRtl ? -1 : 1),
                    'px'
                )
            );

            const actives = this.getActives();
            const itemIn = this.getItemIn();
            const itemOut = this.getItemIn(true);

            percent = prev ? clamp(percent, -1, 1) : 0;

            for (const slide of children(list)) {
                const isActive = includes(actives, slide);
                const isIn = slide === itemIn;
                const isOut = slide === itemOut;
                const translateIn =
                    isIn ||
                    (!isOut &&
                        (isActive ||
                            (dir * (isRtl ? -1 : 1) === -1) ^
                                (getElLeft(slide, list) > getElLeft(prev || next))));

                triggerUpdate(slide, `itemtranslate${translateIn ? 'in' : 'out'}`, {
                    dir,
                    percent: isOut ? 1 - percent : isIn ? percent : isActive ? 1 : 0,
                });
            }
        },

        percent() {
            return Math.abs(
                (css(list, 'transform').split(',')[4] * (isRtl ? -1 : 1) + from) / (to - from)
            );
        },

        getDistance() {
            return Math.abs(to - from);
        },

        getItemIn(out = false) {
            let actives = this.getActives();
            let nextActives = inView(list, getLeft(next || prev, list, center));

            if (out) {
                const temp = actives;
                actives = nextActives;
                nextActives = temp;
            }

            return nextActives[findIndex(nextActives, (el) => !includes(actives, el))];
        },

        getActives() {
            return inView(list, getLeft(prev || next, list, center));
        },
    };
}

function getLeft(el, list, center) {
    const left = getElLeft(el, list);

    return center ? left - centerEl(el, list) : Math.min(left, getMax(list));
}

export function getMax(list) {
    return Math.max(0, getWidth(list) - dimensions(list).width);
}

export function getWidth(list) {
    return sumBy(children(list), (el) => dimensions(el).width);
}

function centerEl(el, list) {
    return dimensions(list).width / 2 - dimensions(el).width / 2;
}

export function getElLeft(el, list) {
    return (
        (el &&
            (position(el).left + (isRtl ? dimensions(el).width - dimensions(list).width : 0)) *
                (isRtl ? -1 : 1)) ||
        0
    );
}

function inView(list, listLeft) {
    listLeft -= 1;
    const listWidth = dimensions(list).width;
    const listRight = listLeft + listWidth + 2;

    return children(list).filter((slide) => {
        const slideLeft = getElLeft(slide, list);
        const slideRight = slideLeft + Math.min(dimensions(slide).width, listWidth);

        return slideLeft >= listLeft && slideRight <= listRight;
    });
}

function triggerUpdate(el, type, data) {
    trigger(el, createEvent(type, false, false, data));
}
