import {
    hasAttr,
    includes,
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

export default {
    args: 'autoplay',

    props: {
        automute: Boolean,
        autoplay: Boolean,
        restart: Boolean,
        hoverTarget: Boolean,
    },

    data: {
        automute: false,
        autoplay: true,
        restart: false,
        hoverTarget: false,
    },

    beforeConnect() {
        const isVideo = isTag(this.$el, 'video');
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

            filter: ({ autoplay }) => includes(autoplay, 'hover'),

            handler(e) {
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

            filter: ({ autoplay }) => includes(autoplay, 'hover'),

            handler(e) {
                if (!isTouch(e)) {
                    pauseHover(this.$el, this.restart);
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
            filter: ({ $el, autoplay }) => autoplay !== 'hover' && $el.preload !== 'none',
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
            options: ({ $el, autoplay }) => ({
                root: autoplay === 'inview' ? null : parent($el).closest(':not(a)'),
            }),
        }),
    ],
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
