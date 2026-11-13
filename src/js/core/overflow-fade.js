import { children, clamp, css, hasClass, isRtl, pointerDown, toggleClass } from 'uikit-util';
import { mutation, resize } from '../api/observables';
import { drag } from '../mixin/internal/drag';

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
            return {
                overflow: [
                    this.$el.scrollWidth - this.$el.clientWidth,
                    this.$el.scrollHeight - this.$el.clientHeight,
                ],
            };
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
                    // The horizontal mask runs left to right, even in RTL.
                    const position = this.$el[`scroll${dir}`] + (!i && isRtl ? overflow[i] : 0);
                    const percent = overflow[i] ? position / overflow[i] : 0;

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
    const { $el: el, threshold, $options } = this;
    const vertical = hasClass(el, `${$options.id}-vertical`);

    drag(e, el, {
        threshold,
        vertical,
        move(delta) {
            el[vertical ? 'scrollTop' : 'scrollLeft'] -= delta;
        },
    });
}
