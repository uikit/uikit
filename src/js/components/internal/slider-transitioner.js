import { translate } from '../../mixin/internal/slideshow-animations';

export default function (UIkit) {

    var {clamp, css, Deferred, noop, toNodes, Transition} = UIkit.util;

    function Transitioner(prev, next, dir, {center, easing, list}) {

        var deferred = new Deferred();

        var from = prev
                ? Transitioner.getLeft(prev, list, center)
                : Transitioner.getLeft(next, list, center) + next.offsetWidth * dir,
            to = next
                ? Transitioner.getLeft(next, list, center)
                : from + prev.offsetWidth * dir;

        return {

            dir,

            show(duration, percent = 0, linear) {

                var ease = linear ? 'linear' : easing;

                duration -= Math.round(duration * clamp(percent, -1, 1));

                this.translate(percent);

                Transition
                    .start(list, {transform: translate(-to, 'px')}, duration, ease)
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

                var distance = this.getDistance() * dir;

                css(list, 'transform', translate(clamp(
                    -to + (distance - distance * percent),
                    -Transitioner.getWidth(list),
                    list.offsetWidth
                ), 'px'));

            },

            percent() {
                return Math.abs((Number(css(list, 'transform').split(',')[4] || 0) + from) / (to - from));
            },

            getDistance() {
                return Math.abs(to - from);
            }

        };

    }

    Transitioner.getLeft = function (el, list, center) {

        return center
            ? el.offsetLeft - Transitioner.center(el, list)
            : Math.min(el.offsetLeft, Transitioner.getMax(list));

    };

    Transitioner.getMax = function (list) {
        return Math.max(0, Transitioner.getWidth(list) - list.offsetWidth);
    };

    Transitioner.getWidth = function (list) {
        return toNodes(list.children).reduce((right, el) => el.offsetWidth + right, 0);
    };

    Transitioner.getMaxWidth = function (list) {
        return toNodes(list.children).reduce((right, el) => Math.max(right, el.offsetWidth), 0);
    };

    Transitioner.center = function (el, list) {
        return list.offsetWidth / 2 - el.offsetWidth / 2;
    };

    return Transitioner;

}
