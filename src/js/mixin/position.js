import {
    css,
    dimensions,
    flipPosition,
    includes,
    isRtl,
    positionAt,
    scrollParent,
    toPx,
} from 'uikit-util';

export default {
    props: {
        pos: String,
        offset: Boolean,
        flip: Boolean,
        shift: Boolean,
        inset: Boolean,
    },

    data: {
        pos: `bottom-${isRtl ? 'right' : 'left'}`,
        offset: false,
        flip: true,
        shift: true,
        inset: false,
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        [this.dir, this.align] = this.pos;
        this.axis = includes(['top', 'bottom'], this.dir) ? 'y' : 'x';
    },

    methods: {
        positionAt(element, target, boundary) {
            let offset = [this.getPositionOffset(element), this.getShiftOffset(element)];
            const placement = [this.flip && 'flip', this.shift && 'shift'];

            const attach = {
                element: [this.inset ? this.dir : flipPosition(this.dir), this.align],
                target: [this.dir, this.align],
            };

            if (this.axis === 'y') {
                for (const prop in attach) {
                    attach[prop].reverse();
                }
                offset.reverse();
                placement.reverse();
            }

            const restoreScrollPosition = storeScrollPosition(element);

            // Ensure none positioned element does not generate scrollbars
            const elDim = dimensions(element);
            css(element, { top: -elDim.height, left: -elDim.width });

            positionAt(element, target, {
                attach,
                offset,
                boundary,
                placement,
                viewportOffset: this.getViewportOffset(element),
            });

            restoreScrollPosition();
        },

        getPositionOffset(element = this.$el) {
            return (
                toPx(
                    this.offset === false ? css(element, '--uk-position-offset') : this.offset,
                    this.axis === 'x' ? 'width' : 'height',
                    element,
                ) *
                (includes(['left', 'top'], this.dir) ? -1 : 1) *
                (this.inset ? -1 : 1)
            );
        },

        getShiftOffset(element = this.$el) {
            return this.align === 'center'
                ? 0
                : toPx(
                      css(element, '--uk-position-shift-offset'),
                      this.axis === 'y' ? 'width' : 'height',
                      element,
                  ) * (includes(['left', 'top'], this.align) ? 1 : -1);
        },

        getViewportOffset(element) {
            return toPx(css(element, '--uk-position-viewport-offset'));
        },
    },
};

export function storeScrollPosition(element) {
    const scrollElement = scrollParent(element);
    const { scrollTop } = scrollElement;

    const restore = () => {
        if (scrollTop !== scrollElement.scrollTop) {
            scrollElement.scrollTop = scrollTop;
        }
    };

    return () => {
        restore();
        // setTimeout is needed for iOS Safari
        setTimeout(restore);
    };
}
