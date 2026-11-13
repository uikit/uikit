import {
    css,
    getEventPos,
    isEqual,
    isRtl,
    isTouch,
    noop,
    off,
    on,
    selInput,
    toArray,
} from 'uikit-util';

const pointerOptions = { passive: false, capture: true };
const pointerDown = 'touchstart mousedown';
const pointerMove = 'touchmove mousemove';
const pointerUp = 'touchend touchcancel mouseup click input scroll';

export default {
    props: {
        draggable: Boolean,
    },

    data: {
        draggable: true,
        threshold: 10,
        angleThreshold: 45,
    },

    created() {
        for (const key of ['start', 'move', 'end']) {
            const fn = this[key];
            this[key] = (e) => {
                const pos = getEventPos(e);

                if (isRtl) {
                    pos.x = -pos.x;
                }

                this.prevPos = isEqual(pos, this.pos) ? this.prevPos : this.pos;
                this.pos = pos;

                fn(e);
            };
        }
    },

    events: [
        {
            name: pointerDown,

            passive: true,

            delegate: ({ selList }) => `${selList} > *`,

            handler(e) {
                if (
                    !this.draggable ||
                    this.parallax ||
                    (!isTouch(e) && hasSelectableText(e.target)) ||
                    e.target.closest(selInput) ||
                    e.button > 0 ||
                    this.length < 2
                ) {
                    return;
                }

                this.start(e);
            },
        },

        {
            name: 'dragstart',

            handler(e) {
                e.preventDefault();
            },
        },

        {
            // iOS workaround for slider stopping if swiping fast
            // https://bugs.webkit.org/show_bug.cgi?id=184251
            name: pointerMove,
            el: ({ list }) => list,
            handler: noop,
            ...pointerOptions,
        },
    ],

    methods: {
        start() {
            this.drag = this.pos;

            if (this._transitioner) {
                this.percent = this._transitioner.percent();
                this.drag.x += this._transitioner.getDistance() * this.percent * this.dir;

                this._transitioner.cancel();
                this._transitioner.translate(this.percent);

                this.dragging = true;

                this.stack = [];
            } else {
                this.prevIndex = this.index;
            }

            on(document, pointerMove, this.move, pointerOptions);

            // 'input' event is triggered by video controls
            on(document, pointerUp, this.end, { passive: true, capture: true, once: true });

            css(this.list, 'userSelect', 'none');
        },

        move(e) {
            const distance = this.pos.x - this.drag.x;
            if (
                distance === 0 ||
                (!this.dragging && getAngle(this.pos, this.drag) > this.angleThreshold) ||
                this.prevPos.x === this.pos.x ||
                (!this.dragging && Math.abs(distance) < this.threshold)
            ) {
                return;
            }

            e.cancelable && e.preventDefault();

            this.dragging = true;
            this.dir = distance < 0 ? 1 : -1;

            let { prevIndex } = this;
            let dis = Math.abs(distance);
            let nextIndex = this.getIndex(prevIndex + this.dir);
            let width = getDistance.call(this, prevIndex, nextIndex);

            while (nextIndex !== prevIndex && dis > width) {
                this.drag.x -= width * this.dir;

                prevIndex = nextIndex;
                dis -= width;
                nextIndex = this.getIndex(prevIndex + this.dir);
                width = getDistance.call(this, prevIndex, nextIndex);
            }

            this.percent = dis / width;

            this._seek(prevIndex, nextIndex);
            this._transitioner = this._translate(
                this.percent,
                prevIndex,
                prevIndex !== nextIndex && nextIndex,
            );
        },

        end() {
            off(document, pointerMove, this.move, pointerOptions);

            if (this.dragging) {
                setTimeout(on(this.list, 'click', (e) => e.preventDefault(), pointerOptions));

                if (this.index === this.prevIndex) {
                    this.dragging = null;
                    this.percent = 1 - this.percent;
                    this.dir *= -1;
                    this._show(false, this.index, true);
                    this._transitioner = null;
                } else {
                    // Return to the previous slide if the drag direction was reversed
                    const dirChange = this.dir < 0 === this.prevPos.x > this.pos.x;
                    const dir = dirChange ? -this.dir : this.dir;
                    const index = dirChange ? this.index : this.prevIndex;

                    if (dirChange) {
                        this.percent = 1 - this.percent;
                    }

                    // Swap the slides while still dragging, so they are not treated as a new transition
                    this.dir = dir;
                    this._seek(index, this.getIndex(index + dir, index));
                    this.index = index;

                    this.dragging = null;
                    this.show(dir > 0 ? 'next' : 'previous', true);
                }
            }

            css(this.list, { userSelect: '' });

            this.drag = this.percent = null;
        },
    },
};

function getDistance(prev, next) {
    return (
        this._getTransitioner(prev, prev !== next && next).getDistance() ||
        this.slides[prev].offsetWidth
    );
}

function hasSelectableText(el) {
    return (
        css(el, 'userSelect') !== 'none' &&
        toArray(el.childNodes).some((el) => el.nodeType === 3 && el.textContent.trim())
    );
}

function getAngle(pos1, pos2) {
    return (Math.atan2(Math.abs(pos2.y - pos1.y), Math.abs(pos2.x - pos1.x)) * 180) / Math.PI;
}
