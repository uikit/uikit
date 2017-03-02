import { doc, getDimensions } from './index';

export function MouseTracker() {}

MouseTracker.prototype = {

    positions: [],
    position: null,

    init() {

        this.positions = [];
        this.position = null;

        var ticking = false;
        this.handler = e => {

            if (!ticking) {
                setTimeout(() => {

                    var time = Date.now(), length = this.positions.length;
                    if (length && (time - this.positions[length - 1].time > 100)) {
                        this.positions.splice(0, length);
                    }

                    this.positions.push({time, x: e.pageX, y: e.pageY});

                    if (this.positions.length > 5) {
                        this.positions.shift();
                    }

                    ticking = false;
                }, 5);
            }

            ticking = true;
        };

        doc.on('mousemove', this.handler);

    },

    cancel() {
        if (this.handler) {
            doc.off('mousemove', this.handler);
        }
    },

    movesTo(target) {

        if (this.positions.length < 2) {
            return false;
        }

        var p = getDimensions(target),
            position = this.positions[this.positions.length - 1],
            prevPos = this.positions[0];

        if (p.left <= position.x && position.x <= p.right && p.top <= position.y && position.y <= p.bottom) {
            return false;
        }

        var points = [
            [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
            [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
        ];

        if (p.right <= position.x) {

        } else if (p.left >= position.x) {
            points[0].reverse();
            points[1].reverse();
        } else if (p.bottom <= position.y) {
            points[0].reverse();
        } else if (p.top >= position.y) {
            points[1].reverse();
        }

        return !!points.reduce((result, point) => {
            return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
        }, 0);
    }

};

function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
}
