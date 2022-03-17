import {
    $,
    flipPosition,
    offset as getOffset,
    isNumeric,
    isRtl,
    positionAt,
    removeClasses,
    toggleClass,
} from 'uikit-util';

export default {
    props: {
        pos: String,
        offset: null,
        flip: Boolean,
        clsPos: String,
    },

    data: {
        pos: `bottom-${isRtl ? 'right' : 'left'}`,
        flip: true,
        offset: false,
        clsPos: '',
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        this.dir = this.pos[0];
        this.align = this.pos[1];
    },

    methods: {
        positionAt(element, target, boundary) {
            removeClasses(element, `${this.clsPos}-(top|bottom|left|right)(-[a-z]+)?`);

            let { offset } = this;
            const axis = this.getAxis();
            const dir = this.pos[0];
            const align = this.pos[1];

            if (!isNumeric(offset)) {
                const node = $(offset);
                offset = node
                    ? getOffset(node)[axis === 'x' ? 'left' : 'top'] -
                      getOffset(target)[axis === 'x' ? 'right' : 'bottom']
                    : 0;
            }

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

            toggleClass(element, `${this.clsPos}-${this.dir}-${this.align}`, this.offset === false);
        },

        getAxis() {
            return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
        },
    },
};
