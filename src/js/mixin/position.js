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
            offset = toPx(offset) + toPx(getCssVar('position-margin-offset', element));

            positionAt(element, target, {
                boundary,
                flip: this.flip,
                attach: {
                    element: axis === 'x' ? [flipPosition(dir), align] : [align, flipPosition(dir)],
                    target: axis === 'x' ? [dir, align] : [align, dir],
                },
                offset:
                    axis === 'x'
                        ? [dir === 'left' ? -offset : +offset, 0]
                        : [0, dir === 'top' ? -offset : +offset],
            });

            [this.dir, this.align] = getAlignment(element, target);
        },

        getAxis() {
            return includes(['top', 'bottom'], this.dir) ? 'y' : 'x';
        },
    },
};

function getAlignment(el, target) {
    const elOffset = getOffset(el);
    const targetOffset = getOffset(target);
    const properties = [
        ['left', 'right'],
        ['top', 'bottom'],
    ];

    let dir;
    for (const props of properties) {
        if (elOffset[props[0]] >= targetOffset[props[1]]) {
            dir = props[1];
            break;
        }
        if (elOffset[props[1]] <= targetOffset[props[0]]) {
            dir = props[0];
            break;
        }
    }

    let align;
    const props = includes(properties[0], dir) ? properties[1] : properties[0];
    if (elOffset[props[0]] === targetOffset[props[0]]) {
        align = props[0];
    } else if (elOffset[props[1]] === targetOffset[props[1]]) {
        align = props[1];
    } else {
        align = 'center';
    }

    return [dir, align];
}
