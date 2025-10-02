import { children, clamp, css, toggleClass } from 'uikit-util';
import { mutation, resize } from '../api/observables';

export default {
    data: {
        fadeDuration: 0.05,
    },

    events: {
        name: 'scroll',

        self: true,

        passive: true,

        handler() {
            this.$emit();
        },
    },

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
