import {
    css,
    dimensions,
    flipPosition,
    includes,
    isRtl,
    positionAt,
    scrollParents,
    toPx,
    trigger,
} from 'uikit-util';

export default {
    props: {
        pos: String,
        offset: null,
        flip: Boolean,
        inset: Boolean,
    },

    data: {
        pos: `bottom-${isRtl ? 'right' : 'left'}`,
        flip: true,
        offset: false,
        inset: false,
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        [this.dir, this.align] = this.pos;
        this.axis = includes(['top', 'bottom'], this.dir) ? 'y' : 'x';
    },

    methods: {
        positionAt(element, target, viewport) {
            let offset = [this.getPositionOffset(element), this.getShiftOffset(element)];

            const attach = {
                element: [this.inset ? this.dir : flipPosition(this.dir), this.align],
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

            const args = [
                element,
                target,
                {
                    attach,
                    offset,
                    viewport,
                    flip: this.flip,
                    viewportOffset: this.getViewportOffset(element),
                },
            ];

            trigger(element, 'beforeposition', args);

            positionAt(...args);

            // Restore scroll position
            scrollElement.scrollTop = scrollTop;
            scrollElement.scrollLeft = scrollLeft;
        },

        getPositionOffset(element) {
            return (
                toPx(
                    this.offset === false ? css(element, '--uk-position-offset') : this.offset,
                    this.axis === 'x' ? 'width' : 'height',
                    element
                ) *
                (includes(['left', 'top'], this.dir) ? -1 : 1) *
                (this.inset ? -1 : 1)
            );
        },

        getShiftOffset(element) {
            return this.align === 'center'
                ? 0
                : toPx(
                      css(element, '--uk-position-shift-offset'),
                      this.axis === 'y' ? 'width' : 'height',
                      element
                  ) * (includes(['left', 'top'], this.align) ? 1 : -1);
        },

        getViewportOffset(element) {
            return toPx(css(element, '--uk-position-viewport-offset'));
        },
    },
};
