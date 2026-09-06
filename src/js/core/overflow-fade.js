import {
    children,
    clamp,
    css,
    getEventPos,
    hasClass,
    isInput,
    isTouch,
    on,
    pointerCancel,
    pointerDown,
    pointerMove,
    pointerUp,
    selInput,
    toggleClass,
} from 'uikit-util';
import { mutation, resize } from '../api/observables';

export default {
    data: {
        threshold: 5,
        fadeDuration: 0.05,
    },

    events: [
        {
            name: 'scroll',

            self: true,

            passive: true,

            handler() {
                this.$emit();
            },
        },
        {
            name: pointerDown,

            handler: handleMouseDrag,
        },
    ],

    observe: [
        mutation({
            options: {
                subtree: true,
                childList: true,
            },
        }),
        resize({
            target: ({ $el }) => [$el, ...children($el)],
        }),
    ],

    update: {
        read() {
            const overflow = [];
            for (const prop of ['Width', 'Height']) {
                overflow.push(this.$el[`scroll${prop}`] - this.$el[`client${prop}`]);
            }
            return { overflow };
        },

        write({ overflow }) {
            for (let i = 0; i < 2; i++) {
                toggleClass(
                    this.$el,
                    `${this.$options.id}-${i ? 'vertical' : 'horizontal'}`,
                    overflow[i] && !overflow[i - 1],
                );

                if (!overflow[i - 1]) {
                    const dir = i ? 'Top' : 'Left';
                    const percent = overflow[i] ? this.$el[`scroll${dir}`] / overflow[i] : 0;

                    const toValue = (value) =>
                        overflow[i] ? clamp((this.fadeDuration - value) / this.fadeDuration) : 1;

                    css(this.$el, {
                        '--uk-overflow-fade-start-opacity': toValue(percent),
                        '--uk-overflow-fade-end-opacity': toValue(1 - percent),
                    });
                }
            }
        },

        events: ['resize'],
    },
};

function handleMouseDrag(e) {
    const { target, button, defaultPrevented } = e;

    if (
        defaultPrevented ||
        button > 0 ||
        isTouch(e) ||
        target.closest(selInput) ||
        isInput(target)
    ) {
        return;
    }

    e.preventDefault();

    const pointerOptions = { passive: false, capture: true };
    const { $el: el, threshold, $options } = this;
    let started;

    const off = on(document, pointerMove, move(e), pointerOptions);
    on(document, [pointerUp, pointerCancel], end, { capture: true, once: true });

    function move(e) {
        let origin = getEventPos(e);
        let pos = origin;
        let lastPos = pos;

        return function (e) {
            lastPos = pos;
            pos = getEventPos(e);

            const isVertical = hasClass(el, `${$options.id}-vertical`);
            const prop = isVertical ? 'y' : 'x';

            started ||= Math.abs(pos[prop] - origin[prop]) > threshold;

            if (started) {
                const delta = lastPos[prop] - pos[prop];
                el[isVertical ? 'scrollTop' : 'scrollLeft'] += delta;
            }
        };
    }

    function end() {
        off();

        if (started) {
            setTimeout(on(el, 'click', (e) => e.preventDefault(), pointerOptions));
        }
    }
}
