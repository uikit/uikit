import {
    $,
    flipPosition,
    getCssVar,
    offset as getOffset,
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
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        this.dir = this.pos[0];
        this.align = this.pos[1];
    },

    methods: {
        positionAt(element, target, boundary) {
            const axis = this.getAxis();
            const dir = this.pos[0];
            const align = this.pos[1];

            let { offset } = this;
            if (!isNumeric(offset)) {
                const node = $(offset);
                offset = node
                    ? getOffset(node)[axis === 'x' ? 'left' : 'top'] -
                      getOffset(target)[axis === 'x' ? 'right' : 'bottom']
                    : 0;
            }
            offset = toPx(offset) + toPx(getCssVar('position-offset', element));

            const { x, y } = positionAt(
                element,
                target,
                axis === 'x' ? `${flipPosition(dir)} ${align}` : `${align} ${flipPosition(dir)}`,
                axis === 'x' ? `${dir} ${align}` : `${align} ${dir}`,
                axis === 'x'
                    ? `${dir === 'left' ? -offset : offset}`
                    : ` ${dir === 'top' ? -offset : offset}`,
                null,
                this.flip,
                boundary
            ).target;

            this.dir = axis === 'x' ? x : y;
            this.align = axis === 'x' ? y : x;
        },

        getAxis() {
            return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
        },
    },
};
