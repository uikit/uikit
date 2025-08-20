import { css, Dimensions, isTag, parent } from 'uikit-util';
import { resize } from '../api/observables';
import Video from './video';

export default {
    mixins: [Video],

    props: {
        width: Number,
        height: Number,
    },

    data: {
        automute: true,
    },

    created() {
        this.useObjectFit = isTag(this.$el, 'img', 'video');
    },

    observe: resize({
        target: ({ $el }) => getPositionedParent($el) || parent($el),
        filter: ({ useObjectFit }) => !useObjectFit,
    }),

    update: {
        read() {
            if (this.useObjectFit) {
                return false;
            }

            const { $el, width = $el.clientWidth, height = $el.clientHeight } = this;

            const el = getPositionedParent($el) || parent($el);
            const dim = Dimensions.cover(
                { width, height },
                { width: el.offsetWidth, height: el.offsetHeight },
            );

            return dim.width && dim.height ? dim : false;
        },

        write({ height, width }) {
            css(this.$el, { height, width });
        },

        events: ['resize'],
    },
};

function getPositionedParent(el) {
    while ((el = parent(el))) {
        if (css(el, 'position') !== 'static') {
            return el;
        }
    }
}
