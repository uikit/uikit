import {position, removeClass} from '../util/index';

export default function (UIkit) {

    UIkit.mixin.position = {

        props: {
            pos: String,
            offset: Number,
            flip: Boolean,
            clsPos: String
        },

        defaults: {
            pos: 'bottom-left',
            flip: true,
            offset: 0,
            clsPos: ''
        },

        ready() {
            this.pos = (this.pos + (this.pos.indexOf('-') === -1 ? '-center' : '')).split('-');
            this.dir = this.pos[0];
            this.align = this.pos[1];
        },

        methods: {

            positionAt(element, target, boundary) {

                removeClass(element, this.clsPos + '-(top|bottom|left|right)(-[a-z]+)?').css({top: '', left: ''});

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var axis = this.getAxis(),
                    flipped = position(
                        element,
                        target,
                        axis === 'x' ? `${flipPosition(this.dir)} ${this.align}` : `${this.align} ${flipPosition(this.dir)}`,
                        axis === 'x' ? `${this.dir} ${this.align}` : `${this.align} ${this.dir}`,
                        axis === 'x' ? `${this.dir === 'left' ? -1 * this.offset : this.offset}` : ` ${this.dir === 'top' ? -1 * this.offset : this.offset}`,
                        null,
                        this.flip,
                        boundary
                    );

                this.dir = axis === 'x' ? flipped.target.x : flipped.target.y;
                this.align = axis === 'x' ? flipped.target.y : flipped.target.x;

                element.css('display', '').addClass(`${this.clsPos}-${this.dir}-${this.align}`)
            },

            getAxis() {
                return this.pos[0] === 'top' || this.pos[0] === 'bottom' ? 'y' : 'x';
            }

        }

    }

};

function flipPosition(pos) {
    switch (pos) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        default:
            return pos;
    }
}
