import {translate} from '../../mixin/internal/slideshow-animations';
import {children, clamp, createEvent, css, Deferred, dimensions, includes, index, isRtl, noop, position, sortBy, Transition, trigger} from 'uikit-util';

export default function (prev, next, dir, {center, easing, list}) {

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

            prev && this.updateTranslates();
            percent = prev ? percent : clamp(percent, 0, 1);
            triggerUpdate(this.getItemIn(), 'itemin', {percent, duration, timing, dir});
            prev && triggerUpdate(this.getItemIn(true), 'itemout', {percent: 1 - percent, duration, timing, dir});

            Transition
                .start(list, {transform: translate(-to * (isRtl ? -1 : 1), 'px')}, duration, timing)
                .then(deferred.resolve, noop);

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

            css(list, 'transform', translate(clamp(
                -to + (distance - distance * percent),
                -getWidth(list),
                dimensions(list).width
            ) * (isRtl ? -1 : 1), 'px'));

            this.updateTranslates();

            if (prev) {
                percent = clamp(percent, -1, 1);
                triggerUpdate(this.getItemIn(), 'itemtranslatein', {percent, dir});
                triggerUpdate(this.getItemIn(true), 'itemtranslateout', {percent: 1 - percent, dir});
            }

        },

        percent() {
            return Math.abs((css(list, 'transform').split(',')[4] * (isRtl ? -1 : 1) + from) / (to - from));
        },

        getDistance() {
            return Math.abs(to - from);
        },

        getItemIn(out = false) {

            const actives = sortBy(this.getActives(), 'offsetLeft');
            const all = sortBy(children(list), 'offsetLeft');
            const i = index(all, actives[dir * (out ? -1 : 1) > 0 ? actives.length - 1 : 0]);

            return ~i && all[i + (prev && !out ? dir : 0)];

        },

        getActives() {
            return [prev || next].concat(children(list).filter(slide => {
                const slideLeft = getElLeft(slide, list);
                return slideLeft > from && slideLeft + dimensions(slide).width <= dimensions(list).width + from;
            }));
        },

        updateTranslates() {

            const actives = this.getActives();

            children(list).forEach(slide => {
                const isActive = includes(actives, slide);

                triggerUpdate(slide, `itemtranslate${isActive ? 'in' : 'out'}`, {
                    percent: isActive ? 1 : 0,
                    dir: slide.offsetLeft <= next.offsetLeft ? 1 : -1
                });
            });
        }

    };

}

function getLeft(el, list, center) {

    const left = getElLeft(el, list);

    return center
        ? left - centerEl(el, list)
        : Math.min(left, getMax(list));

}

export function getMax(list) {
    return Math.max(0, getWidth(list) - dimensions(list).width);
}

export function getWidth(list) {
    return children(list).reduce((right, el) => dimensions(el).width + right, 0);
}

function centerEl(el, list) {
    return dimensions(list).width / 2 - dimensions(el).width / 2;
}

export function getElLeft(el, list) {
    return el && (position(el).left + (isRtl ? dimensions(el).width - dimensions(list).width : 0)) * (isRtl ? -1 : 1) || 0;
}

function triggerUpdate(el, type, data) {
    trigger(el, createEvent(type, false, false, data));
}
