import {
    $,
    children,
    css,
    dimensions,
    getIndex,
    hasClass,
    isRtl,
    isTouch,
    pointerDown,
    pointerEnter,
    pointerLeave,
    toggleClass,
    toPx,
} from 'uikit-util';
import { intersection, preloadMedia, resize } from '../api/observables';
import Class from '../mixin/class';
import { drag, hasSelectableText } from '../mixin/internal/drag';

export default {
    mixins: [Class],

    props: {
        velocity: Number,
        start: Number,
        reverse: Boolean,
        pause: Boolean,
        pauseVelocity: Number,
        fadeSize: null,
        draggable: Boolean,
    },

    data: {
        velocity: 25,
        start: 0,
        reverse: false,
        pause: false,
        pauseVelocity: 10,
        selList: '.uk-marquee-items',
        fadeSize: 0,
        draggable: false,
        threshold: 10,
        inertia: 325,
    },

    computed: {
        list: ({ selList }, $el) => $(selList, $el),
        items() {
            return children(this.list);
        },
    },

    watch: {
        items() {
            this.$emit();
        },
    },

    observe: [
        resize({
            target: ({ $el, items }) => [$el, ...items],
        }),
        intersection({
            handler(entries) {
                let active;
                for (const entry of entries) {
                    entry.target.inert = !entry.isIntersecting;
                    active ||= entry.isIntersecting && entry.target;
                }

                if (!active) {
                    return;
                }

                const { items } = this;
                const index = items.indexOf(active);
                if (!~index) {
                    return;
                }

                const direction = this.reverse ? 1 : -1;
                for (let offset = 1; offset < items.length; offset++) {
                    const item = items[getIndex(index + direction * offset, items)];
                    if (item.inert) {
                        preloadMedia(item);
                        break;
                    }
                }
            },
            target: ({ items }) => items,
            args: { intersecting: false },
            options: ({ $el }) => ({ root: $el }),
        }),
    ],

    disconnected() {
        // Resume if disconnected while being dragged or released
        cancelAnimationFrame(this.frame);
        this.animations().forEach((animation) => animation.play());
    },

    methods: {
        vertical() {
            return hasClass(this.$el, `${this.$options.id}-vertical`);
        },

        animations() {
            return this.items.flatMap((el) => el.getAnimations());
        },

        // Moves the paused animations by the passed time (ms)
        seek(time) {
            for (const animation of this.animations()) {
                const { duration } = animation.effect.getComputedTiming();
                if (duration) {
                    // Wrap around, so the time never leaves the active phase
                    animation.currentTime =
                        (((animation.currentTime + time) % duration) + duration) % duration;
                }
            }
        },

        // Eases from the passed playback rate back to the one of the animations
        release(rate, prev = performance.now()) {
            this.frame = requestAnimationFrame((now) => {
                const animations = this.animations();
                const target = animations[0]?.playbackRate ?? 1;

                rate += (target - rate) * (1 - Math.exp((prev - now) / this.inertia));

                if (Math.abs(target - rate) < 0.01) {
                    animations.forEach((animation) => animation.play());
                } else {
                    this.seek(rate * (now - prev));
                    this.release(rate, now);
                }
            });
        },
    },

    events: [
        {
            name: [pointerEnter, pointerLeave],
            el: ({ $el }) => $el,
            self: true,
            filter: ({ pause }) => pause,
            handler(e) {
                for (const animation of this.animations()) {
                    animation.playbackRate =
                        e.type === pointerEnter ? this.pauseVelocity / this.velocity : 1;
                }
            },
        },
        {
            name: pointerDown,
            filter: ({ draggable }) => draggable,
            handler(e) {
                // Keep text selectable with the mouse
                if (!isTouch(e) && hasSelectableText(e.target)) {
                    return;
                }

                const vertical = this.vertical();
                // Animation time (ms) per pixel moved in the animation direction
                const scale =
                    ((this.reverse ? -1 : 1) * (!vertical && isRtl ? -1 : 1) * 1000) /
                    this.velocity;
                let time = e.timeStamp;
                let rate = 0;

                const tracked = drag(e, this.list, {
                    threshold: this.threshold,
                    touch: true,
                    vertical,
                    move: (delta, e) => {
                        rate =
                            0.8 * ((delta * scale) / Math.max(e.timeStamp - time, 1)) + 0.2 * rate;
                        time = e.timeStamp;
                        this.seek(delta * scale);
                    },
                    // No inertia if the pointer rested before being released
                    end: (e) => this.release(e.timeStamp - time < 100 ? rate : 0),
                });

                if (tracked) {
                    cancelAnimationFrame(this.frame);
                    this.animations().forEach((animation) => animation.pause());
                }
            },
        },
    ],

    update: {
        write() {
            const prefix = this.$options.id;
            const items = this.items;
            const vertical = this.vertical();

            css(items, 'offset', 'none');

            const dir = vertical ? ['top', 'bottom'] : ['left', 'right'];
            if (!vertical && isRtl) {
                dir.reverse();
            }

            const listStart = dimensions(this.list)[dir[0]];
            const itemEnds = items.map((el) => dimensions(el)[dir[1]]);
            const listEnd = Math[!vertical && isRtl ? 'min' : 'max'](...itemEnds);

            for (const [index, el] of items.entries()) {
                const elEnd = itemEnds[index];
                const line1 = listEnd - elEnd;
                const line2 = elEnd - listStart;
                const path = vertical
                    ? `"M0 0 v${line1}M0 ${-line2} v${line2}"`
                    : `"M0 0 h${line1}M${-line2} 0 h${line2}"`;
                css(el, `--${prefix}-path`, path);
            }

            css(this.$el, {
                [`--${prefix}-duration`]: `${Math.abs(listStart - listEnd) / this.velocity}s`,
                [`--${prefix}-start`]: this.start,
                [`--${prefix}-direction`]: this.reverse ? 'reverse' : 'normal',
                '--uk-overflow-fade-size': this.fadeSize
                    ? `${toPx(this.fadeSize, vertical ? 'height' : 'width', this.$el, true)}px`
                    : '',
                // Allow dragging in the scroll direction, while the page scrolls in the other one
                touchAction: this.draggable ? `${vertical ? 'pan-x' : 'pan-y'} pinch-zoom` : '',
            });

            toggleClass(this.$el, `${prefix}-fade`, this.fadeSize);

            css(items, 'offset', '');
        },

        events: ['resize'],
    },
};
