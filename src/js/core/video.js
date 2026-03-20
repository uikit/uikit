import {
    hasAttr,
    isFocusable,
    isTag,
    isTouch,
    mute,
    parent,
    pause,
    play,
    pointerEnter,
    pointerLeave,
    query,
} from 'uikit-util';
import { intersection } from '../api/observables';
import ScrollDriven from '../mixin/scroll-driven';

const loopKey = Symbol();

export default {
    mixins: [ScrollDriven],

    args: 'autoplay',

    props: {
        automute: Boolean,
        autoplay: Boolean,
        restart: Boolean,
        inviewMargin: String,
        inviewQueued: Number,
        hoverTarget: Boolean,
        hoverRewind: Number,
        reducedMotionTime: Number,
    },

    data: {
        automute: false,
        autoplay: true,
        restart: false,
        inviewMargin: '0px',
        inviewQueued: 0,
        hoverTarget: false,
        hoverRewind: 0,
        reducedMotionTime: 0,
    },

    beforeConnect() {
        const isVideo = isTag(this.$el, 'video');

        this.restart = isVideo && this.restart;
        this.parallax = isVideo && this.autoplay === 'parallax';
        this.manualControl = ['hover', 'parallax'].includes(this.autoplay);
        this.inviewQueued = this.autoplay === 'inview' && this.inviewQueued;

        if (this.inviewQueued) {
            this.$el[loopKey] = this.$el.loop;
            this.$el.loop = false;
        }

        if (this.autoplay === 'inview' && isVideo && !hasAttr(this.$el, 'preload')) {
            this.$el.preload = 'none';
        }

        if (!isVideo && !hasAttr(this.$el, 'allow')) {
            this.$el.allow = 'autoplay';
        }

        if (this.autoplay === 'hover') {
            if (isVideo) {
                this.hoverTarget = query(this.hoverTarget, this.$el) || this.$el;

                if (!isFocusable(this.hoverTarget)) {
                    this.hoverTarget.tabIndex = 0;
                }
            } else {
                this.autoplay = true;
            }
        }

        // If the video is added to the DOM through JS, the muted attribute is ignored
        if (this.automute || hasAttr(this.$el, 'muted')) {
            mute(this.$el);
        }
    },

    disconnected() {
        if (this.$el[loopKey]) {
            this.$el.loop = true;
        }

        queue.delete(this.$el);
    },

    events: [
        {
            name: `${pointerEnter} focusin`,

            el: ({ hoverTarget }) => hoverTarget,

            filter: ({ autoplay }) => autoplay === 'hover',

            handler(e) {
                this._reverseAbort?.abort();

                if (!isTouch(e) || !isPlaying(this.$el)) {
                    this.play();
                } else {
                    this.pause();
                }
            },
        },

        {
            name: `${pointerLeave} focusout`,

            el: ({ hoverTarget }) => hoverTarget,

            filter: ({ autoplay }) => autoplay === 'hover',

            handler(e) {
                if (!isTouch(e)) {
                    this._reverseAbort?.abort();
                    this.pause();
                    this._reverseAbort = playReverse(this.$el, this.hoverRewind);
                }
            },
        },
        {
            name: 'error pause ended',
            filter: ({ inviewQueued }) => inviewQueued,
            handler(e) {
                if (e.type === 'error' || (e.type === 'ended' && !this.$el[loopKey])) {
                    queue.delete(this.$el);
                }

                playNextQueued();
            },
        },
    ],

    observe: [
        intersection({
            filter: ({ $el }) => $el.preload === 'none',
            handler([{ target }]) {
                target.preload = '';
                this.$reset();
            },
        }),

        intersection({
            filter: ({ $el, manualControl }) => !manualControl && $el.preload !== 'none',
            handler([{ isIntersecting }]) {
                if (!document.fullscreenElement) {
                    if (isIntersecting) {
                        if (this.autoplay) {
                            this._autoplay();
                        }
                    } else {
                        this.pause();
                    }
                }
            },
            args: { intersecting: false },
            options: ({ $el, autoplay, inviewMargin }) => ({
                root: autoplay === 'inview' ? null : parent($el).closest(':not(a)'),
                rootMargin: autoplay === 'inview' ? inviewMargin : '0px',
            }),
        }),
    ],

    update: {
        write({ percent }) {
            if (!this.parallax) {
                return;
            }

            const { duration, seeking } = this.$el;

            if (!isNaN(duration) && !seeking) {
                this.$el.currentTime = percent * duration;
            }
        },

        events: ['scroll', 'resize'],
    },

    methods: {
        _autoplay() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.pause();

                if (isTag(this.$el, 'video')) {
                    this.$el.currentTime = this.reducedMotionTime;
                }
            } else {
                this.play();
            }
        },

        play() {
            if (this.inviewQueued) {
                queue.set(this.$el, this.inviewQueued);
                playNextQueued();
            } else {
                play(this.$el);
            }
        },

        pause() {
            pause(this.$el);

            queue.delete(this.$el);

            if (this.restart) {
                this.$el.currentTime = 0;
            }
        },
    },
};

function isPlaying(videoEl) {
    return !videoEl.paused && !videoEl.ended;
}

const queue = new Map();
const played = new WeakMap();

let frame;
async function playNextQueued() {
    cancelAnimationFrame(frame);
    await new Promise((resolve) => (frame = requestAnimationFrame(resolve)));

    const getPlayed = (el) => played.getOrInsert(el, 0);
    const videos = shuffle(queue.keys()).sort((a, b) => getPlayed(a) - getPlayed(b));

    for (const el of videos) {
        const maxQueued = queue.get(el);

        if (isPlaying(el) || videos.filter(isPlaying).length / queue.size >= maxQueued) {
            continue;
        }

        played.set(el, getPlayed(el) + 1);
        play(el);
    }
}

function shuffle(array) {
    array = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function playReverse(el, playbackRate) {
    const start = el.currentTime;

    if (isNaN(start) || !playbackRate) {
        return;
    }

    playbackRate *= Math.max(1, start / 10 + 0.5);

    const controller = new AbortController();
    const time = Date.now();
    (function next() {
        requestAnimationFrame(() => {
            if (controller.signal.aborted) {
                return;
            }

            if (!el.seeking) {
                el.currentTime = Math.max(0, start - ((Date.now() - time) * playbackRate) / 1000);
            }

            if (el.currentTime > 0) {
                next();
            }
        });
    })();

    return controller;
}
