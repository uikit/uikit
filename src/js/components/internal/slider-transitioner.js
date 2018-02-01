import {translate} from '../../mixin/internal/slideshow-animations';

export default function (UIkit) {

    const {assign, clamp, createEvent, css, Deferred, includes, index, isRtl, noop, sortBy, toNodes, Transition, trigger} = UIkit.util;

    const Transitioner = assign(function (prev, next, dir, {center, easing, list}) {

        const deferred = new Deferred();

        const from = prev
                ? Transitioner.getLeft(prev, list, center)
                : Transitioner.getLeft(next, list, center) + next.offsetWidth * dir,
            to = next
                ? Transitioner.getLeft(next, list, center)
                : from + prev.offsetWidth * dir * (isRtl ? -1 : 1);

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
                    -Transitioner.getWidth(list),
                    list.offsetWidth
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

                const left = Transitioner.getLeft(prev || next, list, center);

                return sortBy(slides(list).filter(slide => {
                    const slideLeft = Transitioner.getElLeft(slide, list);
                    return slideLeft >= left && slideLeft + slide.offsetWidth <= list.offsetWidth + left;
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

    }, {

        getLeft(el, list, center) {

            const left = this.getElLeft(el, list);

            return center
                ? left - this.center(el, list)
                : Math.min(left, this.getMax(list));

        },

        getMax(list) {
            return Math.max(0, this.getWidth(list) - list.offsetWidth);
        },

        getWidth(list) {
            return slides(list).reduce((right, el) => el.offsetWidth + right, 0);
        },

        getMaxWidth(list) {
            return slides(list).reduce((right, el) => Math.max(right, el.offsetWidth), 0);
        },

        center(el, list) {
            return list.offsetWidth / 2 - el.offsetWidth / 2;
        },

        getElLeft(el, list) {
            return (el.offsetLeft + (isRtl ? el.offsetWidth - list.offsetWidth : 0)) * (isRtl ? -1 : 1);
        }

    });

    function triggerUpdate(el, type, data) {
        trigger(el, createEvent(type, false, false, data));
    }

    function slides(list) {
        return toNodes(list.children);
    }

    return Transitioner;

}
