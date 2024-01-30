import { css, height, query } from 'uikit-util';
import { resize } from '../api/observables';

export default {
    args: 'target',

    props: {
        target: String,
    },

    data: {
        target: '',
    },

    computed: {
        target: ({ target }, $el) => query(target, $el),
    },

    observe: resize({ target: ({ target }) => target }),

    update: {
        read() {
            return { height: height(this.target) };
        },

        write({ height }) {
            css(this.$el, { minHeight: height });
        },

        events: ['resize'],
    },
};
