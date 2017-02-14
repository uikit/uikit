import { doc, getDimensions } from '../util/index';

export default {

    defaults: {

        positions: [],
        position: null

    },

    methods: {

        initMouseTracker() {

            this.positions = [];
            this.position = null;

            this.mouseHandler = e => {
                this.positions.push({x: e.pageX, y: e.pageY});

                if (this.positions.length > 5) {
                    this.positions.shift();
                }
            };

            doc.on('mousemove', this.mouseHandler);

        },

        cancelMouseTracker() {
            if (this.mouseHandler) {
                doc.off('mousemove', this.mouseHandler);
            }
        },

        movesTo(target) {

            var p = getDimensions(target),
                points = [
                    [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
                    [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
                ],
                position = this.positions[this.positions.length - 1],
                prevPos = this.positions[0] || position;

            if (!position) {
                return false;
            }

            if (p.right <= position.x) {

            } else if (p.left >= position.x) {
                points[0].reverse();
                points[1].reverse();
            } else if (p.bottom <= position.y) {
                points[0].reverse();
            } else if (p.top >= position.y) {
                points[1].reverse();
            }

            var delay = position
                && !(this.position && position.x === this.position.x && position.y === this.position.y)
                && points.reduce((result, point) => {
                    return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
                }, 0);

            this.position = delay ? position : null;
            return !!delay;
        }

    }

}

function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
}
