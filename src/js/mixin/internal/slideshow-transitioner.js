export default function (UIkit) {

    var {createEvent, clamp, css, Deferred, noop, Promise, Transition, trigger} = UIkit.util;

    function Transitioner(prev, next, dir, {animation, easing}) {

        var {percent, translate, show = noop} = animation,
            props = show(dir),
            deferred = new Deferred();

        return {

            dir,

            show(duration, percent = 0, linear) {

                var timing = linear ? 'linear' : easing;
                duration -= Math.round(duration * clamp(percent, -1, 1));

                this.translate(percent);

                triggerUpdate(next, 'itemin', {percent, duration, timing, dir});
                triggerUpdate(prev, 'itemout', {percent: 1 - percent, duration, timing, dir});

                Promise.all([
                    Transition.start(next, props[1], duration, timing),
                    Transition.start(prev, props[0], duration, timing)
                ]).then(() => {
                    this.reset();
                    deferred.resolve();
                }, noop);

                return deferred.promise;
            },

            stop() {
                return Transition.stop([next, prev]);
            },

            cancel() {
                Transition.cancel([next, prev]);
            },

            reset() {
                for (var prop in props[0]) {
                    css([next, prev], prop, '');
                }
            },

            forward(duration, percent = this.percent()) {
                Transition.cancel([next, prev]);
                return this.show(duration, percent, true);

            },

            translate(percent) {

                var props = translate(percent, dir);
                css(next, props[1]);
                css(prev, props[0]);
                triggerUpdate(next, 'itemtranslatein', {percent, dir});
                triggerUpdate(prev, 'itemtranslateout', {percent: 1 - percent, dir});

            },

            percent() {
                return percent(prev || next, next, dir);
            },

            getDistance() {
                return prev.offsetWidth;
            }

        };

    }

    function triggerUpdate(el, type, data) {
        trigger(el, createEvent(type, false, false, data));
    }

    return Transitioner;

}
