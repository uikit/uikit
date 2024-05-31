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

            const { ratio, cover } = Dimensions;
            const { $el, width, height } = this;

            let dim = { width, height };

            if (!width || !height) {
                const intrinsic = {
                    width: $el.naturalWidth || $el.videoWidth || $el.clientWidth,
                    height: $el.naturalHeight || $el.videoHeight || $el.clientHeight,
                };

                if (width) {
                    dim = ratio(intrinsic, 'width', width);
                } else if (height) {
                    dim = ratio(intrinsic, 'height', height);
                } else {
                    dim = intrinsic;
                }
            }

            const { offsetHeight: coverHeight, offsetWidth: coverWidth } =
                getPositionedParent($el) || parent($el);
            const coverDim = cover(dim, { width: coverWidth, height: coverHeight });

            if (!coverDim.width || !coverDim.height) {
                return false;
            }

            return coverDim;
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
