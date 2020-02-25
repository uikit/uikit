import {$, css, flipPosition, includes, isNumeric, isRtl, offset as getOffset, positionAt, removeClasses, toggleClass} from 'uikit-util';

export default {

    props: {
        pos: String,
        offset: null,
        flip: Boolean,
        clsPos: String
    },

    data: {
        pos: `bottom-${!isRtl ? 'left' : 'right'}`,
        flip: true,
        offset: false,
        clsPos: ''
    },

    computed: {

        pos({pos}) {
            return (pos + (!includes(pos, '-') ? '-center' : '')).split('-');
        },

        dir() {
            return this.pos[0];
        },

        align() {
            return this.pos[1];
        }

    },

    methods: {

        positionAt(element, target, boundary) {

            removeClasses(element, `${this.clsPos}-(top|bottom|left|right)(-[a-z]+)?`);
            css(element, {top: '', left: ''});

            let node;
            let {offset} = this;
            const axis = this.getAxis();

            if (!isNumeric(offset)) {
                node = $(offset);
                offset = node
                    ? getOffset(node)[axis === 'x' ? 'left' : 'top'] - getOffset(target)[axis === 'x' ? 'right' : 'bottom']
                    : 0;
            }

            const {x, y} = positionAt(
                element,
                target,
                axis === 'x' ? `${flipPosition(this.dir)} ${this.align}` : `${this.align} ${flipPosition(this.dir)}`,
                axis === 'x' ? `${this.dir} ${this.align}` : `${this.align} ${this.dir}`,
                axis === 'x' ? `${this.dir === 'left' ? -offset : offset}` : ` ${this.dir === 'top' ? -offset : offset}`,
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
        }

    }

};
