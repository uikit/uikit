import {css, getEventPos, includes, isRtl, isTouch, noop, off, on, pointerDown, pointerMove, pointerUp, trigger} from 'uikit-util';

export default {

    props: {
        draggable: Boolean
    },

    data: {
        draggable: true,
        threshold: 10
    },

    created() {

        ['start', 'move', 'end'].forEach(key => {

            const fn = this[key];
            this[key] = e => {

                const pos = getEventPos(e).x * (isRtl ? -1 : 1);

                this.prevPos = pos !== this.pos ? this.pos : this.prevPos;
                this.pos = pos;

                fn(e);
            };

        });

    },

    events: [

        {

            name: pointerDown,

            delegate() {
                return this.selSlides;
            },

            handler(e) {

                if (!this.draggable
                    || !isTouch(e) && hasTextNodesOnly(e.target)
                    || e.button > 0
                    || this.length < 2
                ) {
                    return;
                }

                this.start(e);
            }

        },

        {

            // Workaround for iOS 11 bug: https://bugs.webkit.org/show_bug.cgi?id=184250

            name: 'touchmove',
            passive: false,
            handler: 'move',
            delegate() {
                return this.selSlides;
            }

        },

        {
            name: 'dragstart',

            handler(e) {
                e.preventDefault();
            }
        }

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

            // See above workaround notice
            const off = pointerMove !== 'touchmove'
                ? on(document, pointerMove, this.move, {passive: false})
                : noop;
            this.unbindMove = () => {
                off();
                this.unbindMove = null;
            };
            on(window, 'scroll', this.unbindMove);
            on(document, pointerUp, this.end, true);

            css(this.list, 'userSelect', 'none');

        },

        move(e) {

            // See above workaround notice
            if (!this.unbindMove) {
                return;
            }

            const distance = this.pos - this.drag;

            if (distance === 0 || this.prevPos === this.pos || !this.dragging && Math.abs(distance) < this.threshold) {
                return;
            }

            css(this.list, 'pointerEvents', 'none');

            e.cancelable && e.preventDefault();

            this.dragging = true;
            this.dir = (distance < 0 ? 1 : -1);

            const {slides} = this;
            let {prevIndex} = this;
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

            [this.index, this.prevIndex].filter(i => !includes([nextIndex, prevIndex], i)).forEach(i => {
                trigger(slides[i], 'itemhidden', [this]);

                if (edge) {
                    itemShown = true;
                    this.prevIndex = prevIndex;
                }

            });

            if (this.index === prevIndex && this.prevIndex !== prevIndex || itemShown) {
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

            off(window, 'scroll', this.unbindMove);
            this.unbindMove && this.unbindMove();
            off(document, pointerUp, this.end, true);

            if (this.dragging) {

                this.dragging = null;

                if (this.index === this.prevIndex) {
                    this.percent = 1 - this.percent;
                    this.dir *= -1;
                    this._show(false, this.index, true);
                    this._transitioner = null;
                } else {

                    const dirChange = (isRtl ? this.dir * (isRtl ? 1 : -1) : this.dir) < 0 === this.prevPos > this.pos;
                    this.index = dirChange ? this.index : this.prevIndex;

                    if (dirChange) {
                        this.percent = 1 - this.percent;
                    }

                    this.show(this.dir > 0 && !dirChange || this.dir < 0 && dirChange ? 'next' : 'previous', true);
                }

            }

            css(this.list, {userSelect: '', pointerEvents: ''});

            this.drag
                = this.percent
                = null;

        }

    }

};

function hasTextNodesOnly(el) {
    return !el.children.length && el.childNodes.length;
}
