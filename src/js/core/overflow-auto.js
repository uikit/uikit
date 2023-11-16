import { css, dimensions, height, isVisible } from 'uikit-util';
import { resize } from '../api/observables';
import Class from '../mixin/class';

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
        container: ({ selContainer }, $el) => $el.closest(selContainer),

        content: ({ selContent }, $el) => $el.closest(selContent),
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
                    height(this.container) - (dimensions(this.content).height - height(this.$el)),
                ),
            };
        },

        write({ max }) {
            css(this.$el, { minHeight: this.minHeight, maxHeight: max });
        },

        events: ['resize'],
    },
};
