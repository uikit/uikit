import { addClass, clamp, css } from 'uikit-util';
import { resize } from '../api/observables';

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

    observe: [resize()],

    update: {
        read() {
            const prop = this.axis === 'x' ? 'Width' : 'Height';
            return { overflow: this.$el[`scroll${prop}`] - this.$el[`client${prop}`] };
        },

        write({ overflow }) {
            const percent = overflow
                ? this.$el[`scroll${this.axis === 'x' ? 'Left' : 'Top'}`] / overflow
                : 0;
            const toValue = (value) =>
                overflow ? clamp((this.fadeDuration - value) / this.fadeDuration) : 0;

            css(this.$el, {
                '--uk-overflow-fade-start-opacity': toValue(percent),
                '--uk-overflow-fade-end-opacity': toValue(1 - percent),
            });
        },

        events: ['resize'],
    },
};
