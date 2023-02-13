import { getEventPos, on } from './event';
import { last, pointInRect } from './lang';

export function MouseTracker() {}

MouseTracker.prototype = {
    positions: [],

    init() {
        this.positions = [];

        let position;
        this.unbind = on(document, 'mousemove', (e) => (position = getEventPos(e)));
        this.interval = setInterval(() => {
            if (!position) {
                return;
            }

            this.positions.push(position);

            if (this.positions.length > 5) {
                this.positions.shift();
            }
        }, 50);
    },

    cancel() {
        this.unbind?.();
        clearInterval(this.interval);
    },

    movesTo(target) {
        if (this.positions.length < 2) {
            return false;
        }

        const p = target.getBoundingClientRect();
        const { left, right, top, bottom } = p;

        const [prevPosition] = this.positions;
        const position = last(this.positions);
        const path = [prevPosition, position];

        if (pointInRect(position, p)) {
            return false;
        }

        const diagonals = [
            [
                { x: left, y: top },
                { x: right, y: bottom },
            ],
            [
                { x: left, y: bottom },
                { x: right, y: top },
            ],
        ];

        return diagonals.some((diagonal) => {
            const intersection = intersect(path, diagonal);
            return intersection && pointInRect(intersection, p);
        });
    },
};

// Inspired by http://paulbourke.net/geometry/pointlineplane/
function intersect([{ x: x1, y: y1 }, { x: x2, y: y2 }], [{ x: x3, y: y3 }, { x: x4, y: y4 }]) {
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

    if (ua < 0) {
        return false;
    }

    // Return an object with the x and y coordinates of the intersection
    return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
}
