import { css, query } from 'uikit-util';
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
        target: {
            get: ({ target }, $el) => query(target, $el),
            observe: ({ target }) => target,
        },
    },

    observe: resize({ target: ({ target }) => target }),

    update: {
        read() {
            return this.target ? { height: this.target.offsetHeight } : false;
        },

        write({ height }) {
            css(this.$el, { minHeight: height });
        },

        events: ['resize'],
    },
};
