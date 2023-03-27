import {
    closest,
    css,
    getEventPos,
    includes,
    isRtl,
    isTouch,
    noop,
    off,
    on,
    selInput,
    toArray,
    trigger,
} from 'uikit-util';

const pointerOptions = { passive: false, capture: true };
const pointerUpOptions = { passive: true, capture: true };
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
    },

    created() {
        for (const key of ['start', 'move', 'end']) {
            const fn = this[key];
            this[key] = (e) => {
                const pos = getEventPos(e).x * (isRtl ? -1 : 1);

                this.prevPos = pos === this.pos ? this.prevPos : this.pos;
                this.pos = pos;

                fn(e);
            };
        }
    },

    events: [
        {
            name: pointerDown,

            passive: true,

            delegate() {
                return `${this.selList} > *`;
            },

            handler(e) {
                if (
                    !this.draggable ||
                    (!isTouch(e) && hasSelectableText(e.target)) ||
                    closest(e.target, selInput) ||
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
            name: pointerMove,
            el() {
                return this.list;
            },
            handler: noop,
            ...pointerOptions,
        },
    ],

    methods: {
        start() {
            this.drag = this.pos;

            if (this._transitioner) {
                this.percent = this._transitioner.percent();
                this.drag += this._transitioner.getDistance() * this.percent * this.dir;

                this._transitioner.cancel();
                this._transitioner.translate(this.percent);

                this.dragging = true;

                this.stack = [];
            } else {
                this.prevIndex = this.index;
            }

            on(document, pointerMove, this.move, pointerOptions);

            // 'input' event is triggered by video controls
            on(document, pointerUp, this.end, pointerUpOptions);

            css(this.list, 'userSelect', 'none');
        },

        move(e) {
            const distance = this.pos - this.drag;

            if (
                distance === 0 ||
                this.prevPos === this.pos ||
                (!this.dragging && Math.abs(distance) < this.threshold)
            ) {
                return;
            }

            // prevent click event
            css(this.list, 'pointerEvents', 'none');

            e.cancelable && e.preventDefault();

            this.dragging = true;
            this.dir = distance < 0 ? 1 : -1;

            const { slides } = this;
            let { prevIndex } = this;
            let dis = Math.abs(distance);
            let nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
            let width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;

            while (nextIndex !== prevIndex && dis > width) {
                this.drag -= width * this.dir;

                prevIndex = nextIndex;
                dis -= width;
                nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
                width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;
            }

            this.percent = dis / width;

            const prev = slides[prevIndex];
            const next = slides[nextIndex];
            const changed = this.index !== nextIndex;
            const edge = prevIndex === nextIndex;

            let itemShown;

            [this.index, this.prevIndex]
                .filter((i) => !includes([nextIndex, prevIndex], i))
                .forEach((i) => {
                    trigger(slides[i], 'itemhidden', [this]);

                    if (edge) {
                        itemShown = true;
                        this.prevIndex = prevIndex;
                    }
                });

            if ((this.index === prevIndex && this.prevIndex !== prevIndex) || itemShown) {
                trigger(slides[this.index], 'itemshown', [this]);
            }

            if (changed) {
                this.prevIndex = prevIndex;
                this.index = nextIndex;

                !edge && trigger(prev, 'beforeitemhide', [this]);
                trigger(next, 'beforeitemshow', [this]);
            }

            this._transitioner = this._translate(Math.abs(this.percent), prev, !edge && next);

            if (changed) {
                !edge && trigger(prev, 'itemhide', [this]);
                trigger(next, 'itemshow', [this]);
            }
        },

        end() {
            off(document, pointerMove, this.move, pointerOptions);
            off(document, pointerUp, this.end, pointerUpOptions);

            if (this.dragging) {
                this.dragging = null;

                if (this.index === this.prevIndex) {
                    this.percent = 1 - this.percent;
                    this.dir *= -1;
                    this._show(false, this.index, true);
                    this._transitioner = null;
                } else {
                    const dirChange =
                        (isRtl ? this.dir * (isRtl ? 1 : -1) : this.dir) < 0 ===
                        this.prevPos > this.pos;
                    this.index = dirChange ? this.index : this.prevIndex;

                    if (dirChange) {
                        this.percent = 1 - this.percent;
                    }

                    this.show(
                        (this.dir > 0 && !dirChange) || (this.dir < 0 && dirChange)
                            ? 'next'
                            : 'previous',
                        true
                    );
                }
            }

            css(this.list, { userSelect: '', pointerEvents: '' });

            this.drag = this.percent = null;
        },
    },
};

function hasSelectableText(el) {
    return (
        css(el, 'userSelect') !== 'none' &&
        toArray(el.childNodes).some((el) => el.nodeType === 3 && el.textContent.trim())
    );
}
