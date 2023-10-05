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

    events: {
        'load loadedmetadata'() {
            this.$emit('resize');
        },
    },

    observe: resize({
        target: ({ $el }) => [getPositionedParent($el) || parent($el)],
        filter: ({ _useObjectFit }) => !_useObjectFit,
    }),

    connected() {
        this._useObjectFit = isTag(this.$el, 'img', 'video');
    },

    update: {
        read() {
            if (this._useObjectFit) {
                return;
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
            const coverDim = cover(dim, {
                width: coverWidth + (coverWidth % 2 ? 1 : 0),
                height: coverHeight + (coverHeight % 2 ? 1 : 0),
            });

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
