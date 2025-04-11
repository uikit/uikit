import { clamp, css } from 'uikit-util';
import { resize } from '../api/observables';
import Class from '../mixin/class';

export default {
    mixins: [Class],

    props: {},

    data: {
        margin: 0.2,
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
            return { overflow: this.$el.scrollWidth - this.$el.clientWidth };
        },

        write({ overflow }) {
            const percent = overflow ? this.$el.scrollLeft / overflow : 0;
            const toValue = (value) => (overflow ? clamp((this.margin - value) / this.margin) : 0);

            css(this.$el, {
                '--uk-overflow-fade-start-opacity': toValue(percent),
                '--uk-overflow-fade-end-opacity': toValue(1 - percent),
            });
        },

        events: ['resize'],
    },
};
