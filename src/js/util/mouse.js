import {on} from './event';
import {offset} from './dimensions';

export function MouseTracker() {}

MouseTracker.prototype = {

    positions: [],
    position: null,

    init() {

        this.positions = [];
        this.position = null;

        let ticking = false;
        this.unbind = on(document, 'mousemove', e => {

            if (ticking) {
                return;
            }

            setTimeout(() => {

                const time = Date.now();
                const {length} = this.positions;

                if (length && (time - this.positions[length - 1].time > 100)) {
                    this.positions.splice(0, length);
                }

                this.positions.push({time, x: e.pageX, y: e.pageY});

                if (this.positions.length > 5) {
                    this.positions.shift();
                }

                ticking = false;
            }, 5);

            ticking = true;
        });

    },

    cancel() {
        if (this.unbind) {
            this.unbind();
        }
    },

    movesTo(target) {

        if (this.positions.length < 2) {
            return false;
        }

        const p = offset(target);
        const position = this.positions[this.positions.length - 1];
        const [prevPos] = this.positions;

        if (p.left <= position.x && position.x <= p.right && p.top <= position.y && position.y <= p.bottom) {
            return false;
        }

        const points = [
            [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
            [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
        ];

        if (p.right <= position.x) {
            // empty
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
