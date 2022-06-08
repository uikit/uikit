import {
    $,
    css,
    dimensions,
    flipPosition,
    getCssVar,
    offset as getOffset,
    includes,
    isNumeric,
    isRtl,
    isString,
    positionAt,
    scrollParents,
    toPx,
} from 'uikit-util';

export default {
    props: {
        pos: String,
        offset: null,
        flip: Boolean,
    },

    data: {
        pos: `bottom-${isRtl ? 'right' : 'left'}`,
        flip: true,
        offset: false,
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        [this.dir, this.align] = this.pos;
        this.axis = includes(['top', 'bottom'], this.dir) ? 'y' : 'x';
    },

    methods: {
        positionAt(element, target, boundary) {
            let offset = [this.getPositionOffset(element, target), this.getShiftOffset(element)];

            const attach = {
                element: [flipPosition(this.dir), this.align],
                target: [this.dir, this.align],
            };

            if (this.axis === 'y') {
                for (const prop in attach) {
                    attach[prop] = attach[prop].reverse();
                }
                offset = offset.reverse();
            }

            const [scrollElement] = scrollParents(element, /auto|scroll/);
            const { scrollTop, scrollLeft } = scrollElement;

            // Ensure none positioned element does not generate scrollbars
            const elDim = dimensions(element);
            css(element, { top: -elDim.height, left: -elDim.width });

            positionAt(element, target, {
                attach,
                offset,
                boundary,
                flip: this.flip,
                viewportOffset: this.getViewportOffset(element),
            });

            // Restore scroll position
            scrollElement.scrollTop = scrollTop;
            scrollElement.scrollLeft = scrollLeft;
        },

        getPositionOffset(element, target) {
            let { axis, dir, offset } = this;

            if (offset && !isNumeric(offset) && !(isString(offset) && offset.match(/^-?\d/))) {
                const node = $(offset);
                offset = node
                    ? getOffset(node)[axis === 'x' ? 'left' : 'top'] -
                      getOffset(target)[axis === 'x' ? 'right' : 'bottom']
                    : 0;
            }

            return (
                toPx(
                    offset === false ? getCssVar('position-offset', element) : offset,
                    axis === 'x' ? 'width' : 'height',
                    element
                ) * (includes(['left', 'top'], dir) ? -1 : 1)
            );
        },

        getShiftOffset(element) {
            return includes(['center', 'justify', 'stretch'], this.align)
                ? 0
                : toPx(
                      getCssVar('position-shift-offset', element),
                      this.axis === 'y' ? 'width' : 'height',
                      element
                  ) * (includes(['left', 'top'], this.align) ? 1 : -1);
        },

        getViewportOffset(element) {
            return toPx(getCssVar('position-viewport-offset', element));
        },
    },
};
