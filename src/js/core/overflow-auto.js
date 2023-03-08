import Class from '../mixin/class';
import { resize } from '../api/observables';
import { closest, css, dimensions, height, isVisible } from 'uikit-util';

export default {
    mixins: [Class],

    props: {
        selContainer: String,
        selContent: String,
        minHeight: Number,
    },

    data: {
        selContainer: '.uk-modal',
        selContent: '.uk-modal-dialog',
        minHeight: 150,
    },

    computed: {
        container({ selContainer }, $el) {
            return closest($el, selContainer);
        },

        content({ selContent }, $el) {
            return closest($el, selContent);
        },
    },

    observe: resize({
        target: ({ container, content }) => [container, content],
    }),

    update: {
        read() {
            if (!this.content || !this.container || !isVisible(this.$el)) {
                return false;
            }

            return {
                max: Math.max(
                    this.minHeight,
                    height(this.container) - (dimensions(this.content).height - height(this.$el))
                ),
            };
        },

        write({ max }) {
            css(this.$el, { minHeight: this.minHeight, maxHeight: max });
        },

        events: ['resize'],
    },
};
