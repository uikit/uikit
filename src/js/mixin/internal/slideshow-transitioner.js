import { clamp, createEvent, css, noop, Transition, trigger } from 'uikit-util';

export default function Transitioner(prev, next, dir, { animation, easing }) {
    const { percent, translate, show = noop } = animation;
    const props = show(dir);

    const { promise, resolve } = withResolvers();

    return {
        dir,

        show(duration, percent = 0, linear) {
            const timing = linear ? 'linear' : easing;
            duration -= Math.round(duration * clamp(percent, -1, 1));

            this.translate(percent);

            triggerUpdate(next, 'itemin', { percent, duration, timing, dir });
            triggerUpdate(prev, 'itemout', { percent: 1 - percent, duration, timing, dir });

            Promise.all([
                Transition.start(next, props[1], duration, timing),
                Transition.start(prev, props[0], duration, timing),
            ]).then(() => {
                this.reset();
                resolve();
            }, noop);

            return promise;
        },

        cancel() {
            return Transition.cancel([next, prev]);
        },

        reset() {
            for (const prop in props[0]) {
                css([next, prev], prop, '');
            }
        },

        async forward(duration, percent = this.percent()) {
            await this.cancel();
            return this.show(duration, percent, true);
        },

        translate(percent) {
            this.reset();

            const props = translate(percent, dir);
            css(next, props[1]);
            css(prev, props[0]);
            triggerUpdate(next, 'itemtranslatein', { percent, dir });
            triggerUpdate(prev, 'itemtranslateout', { percent: 1 - percent, dir });
        },

        percent() {
            return percent(prev || next, next, dir);
        },

        getDistance() {
            return prev?.offsetWidth;
        },
    };
}

export function triggerUpdate(el, type, data) {
    trigger(el, createEvent(type, false, false, data));
}

// Use Promise.withResolvers() once it becomes baseline
export function withResolvers() {
    let resolve;
    return { promise: new Promise((res) => (resolve = res)), resolve };
}
