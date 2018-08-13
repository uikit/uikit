import {translate} from '../../mixin/internal/slideshow-animations';
import {clamp, createEvent, css, Deferred, includes, index, isRtl, noop, position, sortBy, toNodes, Transition, trigger} from 'uikit-util';

export default function (prev, next, dir, {center, easing, list}) {

    const deferred = new Deferred();

    const from = prev
        ? getLeft(prev, list, center)
        : getLeft(next, list, center) + bounds(next).width * dir;
    const to = next
        ? getLeft(next, list, center)
        : from + bounds(prev).width * dir * (isRtl ? -1 : 1);

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

        stop() {
            return Transition.stop(list);
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
                bounds(list).width
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

            const actives = this.getActives();
            const all = sortBy(slides(list), 'offsetLeft');
            const i = index(all, actives[dir * (out ? -1 : 1) > 0 ? actives.length - 1 : 0]);

            return ~i && all[i + (prev && !out ? dir : 0)];

        },

        getActives() {

            const left = getLeft(prev || next, list, center);

            return sortBy(slides(list).filter(slide => {
                const slideLeft = getElLeft(slide, list);
                return slideLeft >= left && slideLeft + bounds(slide).width <= bounds(list).width + left;
            }), 'offsetLeft');

        },

        updateTranslates() {

            const actives = this.getActives();

            slides(list).forEach(slide => {
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
    return Math.max(0, getWidth(list) - bounds(list).width);
}

export function getWidth(list) {
    return slides(list).reduce((right, el) => bounds(el).width + right, 0);
}

export function getMaxWidth(list) {
    return slides(list).reduce((right, el) => Math.max(right, bounds(el).width), 0);
}

function centerEl(el, list) {
    return bounds(list).width / 2 - bounds(el).width / 2;
}

export function getElLeft(el, list) {
    return (position(el).left + (isRtl ? bounds(el).width - bounds(list).width : 0)) * (isRtl ? -1 : 1);
}

export function bounds(el) {
    return el.getBoundingClientRect();
}

function triggerUpdate(el, type, data) {
    trigger(el, createEvent(type, false, false, data));
}

function slides(list) {
    return toNodes(list.children);
}
