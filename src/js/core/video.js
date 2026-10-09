import {
    hasAttr,
    isFocusable,
    isTag,
    isTouch,
    mute,
    observeIntersection,
    parent,
    pause,
    play,
    pointerEnter,
    pointerLeave,
    query,
} from 'uikit-util';
import { intersection } from '../api/observables';
import Media from '../mixin/media';
import ScrollDriven from '../mixin/scroll-driven';

const loopKey = Symbol();

export default {
    mixins: [Media, ScrollDriven],

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
        media: '(prefers-reduced-motion: reduce)',
    },

    beforeConnect() {
        const isVideo = (this.isVideo = isTag(this.$el, 'video'));

        this.interactionDriven = ['hover', 'parallax'].includes(this.autoplay);

        if (this.interactionDriven && !isVideo) {
            this.interactionDriven = this.autoplay = false;
        }

        this.restart = isVideo && this.restart;
        this.parallax = this.autoplay === 'parallax';
        this.inviewQueued = isVideo && this.autoplay === 'inview' && this.inviewQueued;

        if (this.inviewQueued) {
            this.$el[loopKey] = this.$el.loop;
            this.$el.loop = false;
        }

        if (
            ['hover', 'inview'].includes(this.autoplay) &&
            isVideo &&
            !hasAttr(this.$el, 'preload')
        ) {
            this.$el.preload = 'none';
        }

        if (!isVideo && !hasAttr(this.$el, 'allow')) {
            this.$el.allow = 'autoplay';
        }

        if (this.autoplay === 'hover') {
            this.hoverTarget = query(this.hoverTarget, this.$el) || this.$el;

            if (!isFocusable(this.hoverTarget)) {
                this.hoverTarget.tabIndex = 0;
            }
        }

        // If the video is added to the DOM through JS, the muted attribute is ignored
        if (this.automute || hasAttr(this.$el, 'muted')) {
            mute(this.$el);
        }
    },

    connected() {
        if (
            !this.$el.controls &&
            !this.$el.poster &&
            (this.interactionDriven || this.inviewQueued)
        ) {
            this.cancelPreview = preview(this.$el);
        }
    },

    disconnected() {
        this._reverseAbort?.abort();

        this.cancelPreview?.();
        this.cancelPreview = null;

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
                if (!isTouch(e) && !this.matchMedia) {
                    this._reverseAbort?.abort();
                    this.pause();
                    this._reverseAbort = playReverse(this.$el, this.hoverRewind);
                }
            },
        },
        {
            name: 'loadedmetadata durationchange',
            filter: ({ parallax }) => parallax,
            handler() {
                this.$emit('resize');
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
            filter: ({ $el, interactionDriven }) => !interactionDriven && $el.preload !== 'none',
            handler([{ isIntersecting }]) {
                if (!document.fullscreenElement) {
                    if (isIntersecting) {
                        if (this.autoplay) {
                            this.play();
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
                const value = this.matchMedia ? this.reducedMotionTime : percent * duration;
                setCurrentTime(this.$el, value);
            }
        },

        events: ['scroll', 'resize'],
    },

    methods: {
        play() {
            if (this.matchMedia) {
                this.pause();

                if (this.isVideo) {
                    setCurrentTime(this.$el, this.reducedMotionTime);
                }
            } else if (this.inviewQueued) {
                queue.set(this.$el, this.inviewQueued);
                playNextQueued();
            } else {
                this.cancelPreview?.();
                play(this.$el);
            }
        },

        pause() {
            pause(this.$el);

            queue.delete(this.$el);

            if (this.restart) {
                setCurrentTime(this.$el, 0);
            }
        },
    },
};

function setCurrentTime(videoEl, time) {
    if (videoEl.currentTime !== time) {
        videoEl.currentTime = time;
    }
}

function isPlaying(videoEl) {
    return !videoEl.paused && !videoEl.ended;
}

function preview($el) {
    if (!$el.requestVideoFrameCallback) {
        return;
    }

    let frame;
    const pausePreview = () => {
        disconnect();
        pause($el);
    };

    const observer = observeIntersection($el, () => {
        observer.disconnect();
        frame = $el.requestVideoFrameCallback(pausePreview);
        play($el);
    });

    const disconnect = () => {
        observer.disconnect();
        $el.cancelVideoFrameCallback(frame);
    };

    return disconnect;
}

const queue = new Map();
const played = new WeakMap();

let frame;
function playNextQueued() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
        const getPlayed = (el) => played.get(el) ?? 0;
        const videos = shuffle(queue.keys()).sort((a, b) => getPlayed(a) - getPlayed(b));
        let active = videos.filter(isPlaying).length;

        for (const el of videos) {
            const maxQueued = queue.get(el);

            if (isPlaying(el) || active / queue.size >= maxQueued) {
                continue;
            }

            played.set(el, getPlayed(el) + 1);
            play(el);
            active++;
        }
    });
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
