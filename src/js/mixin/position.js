import {
    $,
    flipPosition,
    getCssVar,
    offset as getOffset,
    includes,
    isNumeric,
    isRtl,
    positionAt,
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
        viewportPadding: 10,
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        this.axis = includes(['top', 'bottom'], this.pos[0]) ? 'y' : 'x';
    },

    methods: {
        positionAt(element, target, boundary) {
            const [dir, align] = this.pos;

            let { offset } = this;
            if (!isNumeric(offset)) {
                const node = $(offset);
                offset = node
                    ? getOffset(node)[this.axis === 'x' ? 'left' : 'top'] -
                      getOffset(target)[this.axis === 'x' ? 'right' : 'bottom']
                    : 0;
            }
            offset = toPx(offset) + toPx(getCssVar('position-offset', element));
            offset = [includes(['left', 'top'], dir) ? -offset : +offset, 0];

            const attach = {
                element: [flipPosition(dir), align],
                target: [dir, align],
            };

            if (this.axis === 'y') {
                for (const prop in attach) {
                    attach[prop] = attach[prop].reverse();
                }
                offset = offset.reverse();
            }

            positionAt(element, target, {
                attach,
                offset,
                boundary,
                viewportPadding: this.boundaryAlign ? 0 : this.viewportPadding,
                flip: this.flip,
            });
        },
    },
};
