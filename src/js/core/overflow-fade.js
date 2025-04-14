import { $$, addClass, clamp, css } from 'uikit-util';
import { mutation, resize } from '../api/observables';

export default {
    props: {
        axis: String,
    },

    data: {
        axis: 'x',
        fadeDuration: 0.05,
    },

    connected() {
        addClass(this.$el, `${this.$options.id}-${this.axis === 'x' ? 'horizontal' : 'vertical'}`);
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
            target: ({ $el }) => [$el, ...$$('*', $el)],
        }),
    ],

    update: {
        read() {
            const prop = this.axis === 'x' ? 'Width' : 'Height';
            return { overflow: this.$el[`scroll${prop}`] - this.$el[`client${prop}`] };
        },

        write({ overflow }) {
            const dir = this.axis === 'x' ? 'Left' : 'Top';
            const percent = overflow ? this.$el[`scroll${dir}`] / overflow : 0;

            const toValue = (value) =>
                overflow ? clamp((this.fadeDuration - value) / this.fadeDuration) : 1;

            css(this.$el, {
                '--uk-overflow-fade-start-opacity': toValue(percent),
                '--uk-overflow-fade-end-opacity': toValue(1 - percent),
            });
        },

        events: ['resize'],
    },
};
