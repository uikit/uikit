import {
    hasAttr,
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
                this.$el.tabIndex = 0;
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

            el: ({ hoverTarget, $el }) => query(hoverTarget, $el) || $el,

            filter: ({ autoplay }) => autoplay === 'hover',

            handler(e) {
                this._reverseAbort?.abort();

                if (!isTouch(e) || !isPlaying(this.$el)) {
                    play(this.$el);
                } else {
                    pauseHover(this.$el, this.restart);
                }
            },
        },

        {
            name: `${pointerLeave} focusout`,

            el: ({ hoverTarget, $el }) => query(hoverTarget, $el) || $el,

            filter: ({ autoplay }) => autoplay === 'hover',

            handler(e) {
                if (!isTouch(e)) {
                    this._reverseAbort?.abort();

                    pauseHover(this.$el, this.restart);
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
            handler([{ isIntersecting, target }]) {
                if (!document.fullscreenElement) {
                    if (isIntersecting) {
                        if (this.autoplay) {
                            play(target);
                        }
                    } else {
                        pauseHover(target, this.restart);
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
};

function isPlaying(videoEl) {
    return !videoEl.paused && !videoEl.ended;
}

function pauseHover(el, restart) {
    pause(el);
    if (restart && isTag(el, 'video')) {
        el.currentTime = 0;
    }
}

function playReverse(el, duration) {
    const controller = {
        abort() {
            this.aborted = true;
        },
    };

    const start = el.currentTime;

    if (isNaN(start)) {
        return controller;
    }

    const time = Date.now();
    (function next() {
        requestAnimationFrame(() => {
            if (controller.aborted) {
                return;
            }

            const currentTime = Math.max(0, start - ((Date.now() - time) * duration) / 1000);

            if (currentTime > 0) {
                if (!el.seeking) {
                    el.currentTime = currentTime;
                }

                next();
            }
        });
    })();

    return controller;
}
