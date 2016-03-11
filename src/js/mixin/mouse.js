import {getDimensions} from '../util/index';

export default function (UIkit) {

    UIkit.mixin.mouse = {

        defaults: {

            positions: [],
            position: null,
            points: null

        },

        methods: {

            initMouseTracker(target) {

                this.positions = [];
                this.position = null;

                this.mouseHandler = (e) => {
                    this.positions.push({x: e.pageX, y: e.pageY});

                    if (this.positions.length > 5) {
                        this.positions.shift();
                    }
                };

                $(document).on('mousemove', this.mouseHandler);

                var p = getDimensions(target);

                this.points = [
                    [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
                    [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
                ];

                if (this.dir === 'right') {
                    this.points[0].reverse();
                    this.points[1].reverse();
                } else if (this.dir === 'top') {
                    this.points[0].reverse();
                } else if (this.dir === 'bottom') {
                    this.points[1].reverse();
                }

            },

            cancelMouseTracker() {
                if (this.mouseHandler) {
                    $(document).off('mousemove', this.mouseHandler);
                }
            },

            movesTowardsTarget() {

                var position = this.positions[this.positions.length - 1],
                    prevPos = this.positions[0] || position,
                    delay = position
                        && this.points
                        && !(this.position && position.x === this.position.x && position.y === this.position.y)
                        && this.points.reduce((result, point) => {
                            return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
                        }, 0);

                this.position = delay ? position : null;
                return delay;
            }

        }

    };

    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }

};


