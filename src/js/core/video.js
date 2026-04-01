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

export default {
    mixins: [ScrollDriven],

    args: 'autoplay',

    props: {
        automute: Boolean,
        autoplay: Boolean,
        restart: Boolean,
        inviewMargin: String,
        hoverTarget: Boolean,
        hoverRewind: Number,
    },

    data: {
        automute: false,
        autoplay: true,
        restart: false,
        inviewMargin: '0px',
        hoverTarget: false,
        hoverRewind: 0,
    },

    beforeConnect() {
        const isVideo = isTag(this.$el, 'video');

        this.restart = isVideo && this.restart;
        this.parallax = isVideo && this.autoplay === 'parallax';
        this.manualControl = ['hover', 'parallax'].includes(this.autoplay);

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
                this.$el.currentTime = percent * duration;
            }
        },

        events: ['scroll', 'resize'],
    },

    methods: {
        play() {
            play(this.$el);
        },

        pause() {
            pause(this.$el);

            if (this.restart) {
                this.$el.currentTime = 0;
            }
        },
    },
};

function isPlaying(videoEl) {
    return !videoEl.paused && !videoEl.ended;
}

function playReverse(el, playbackRate) {
    const start = el.currentTime;

    if (isNaN(start) || !playbackRate) {
        return;
    }

    let controller = new AbortController();

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
