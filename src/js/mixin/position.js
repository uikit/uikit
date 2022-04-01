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
            const [dir, align] = this.pos;
            const axis = this.getAxis(dir);

            let { offset } = this;
            if (!isNumeric(offset)) {
                const node = $(offset);
                offset = node
                    ? getOffset(node)[axis === 'x' ? 'left' : 'top'] -
                      getOffset(target)[axis === 'x' ? 'right' : 'bottom']
                    : 0;
            }
            offset = toPx(offset) + toPx(getCssVar('position-offset', element));
            offset = [includes(['left', 'top'], dir) ? -offset : +offset, 0];

            const attach = {
                element: [flipPosition(dir), align],
                target: [dir, align],
            };

            if (axis === 'y') {
                for (const prop in attach) {
                    attach[prop] = attach[prop].reverse();
                }
                offset = offset.reverse();
            }

            positionAt(element, target, {
                attach,
                offset,
                boundary,
                flip: this.flip,
            });

            [this.dir, this.align] = getAlignment(element, target, this.pos);
        },

        getAxis(dir = this.dir) {
            return includes(['top', 'bottom'], dir) ? 'y' : 'x';
        },
    },
};

function getAlignment(el, target, [dir, align]) {
    const elOffset = getOffset(el);
    const targetOffset = getOffset(target);
    const properties = [
        ['left', 'right'],
        ['top', 'bottom'],
    ];

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
