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
} from 'uikit-util';
import { intersection } from '../api/observables';

export default {
    args: 'autoplay',

    props: {
        automute: Boolean,
        autoplay: Boolean,
    },

    data: {
        automute: false,
        autoplay: true,
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

            filter: ({ autoplay }) => includes(autoplay, 'hover'),

            handler(e) {
                if (!isTouch(e) || !isPlaying(this.$el)) {
                    play(this.$el);
                } else {
                    pause(this.$el);
                }
            },
        },

        {
            name: `${pointerLeave} focusout`,

            filter: ({ autoplay }) => includes(autoplay, 'hover'),

            handler(e) {
                if (!isTouch(e)) {
                    pause(this.$el);
                }
            },
        },
    ],

    observe: [
        intersection({
            filter: ({ $el, autoplay }) => autoplay !== 'hover' || $el.preload === 'none',
            handler([{ isIntersecting, target }]) {
                if (!document.fullscreenElement) {
                    if (isIntersecting) {
                        if (target.preload === 'none') {
                            target.preload = '';
                            this.$reset();
                            return;
                        }

                        if (this.autoplay) {
                            play(target);
                        }
                    } else {
                        pause(target);
                    }
                }
            },
            args: { intersecting: false },
            options: ({ $el, autoplay }) => ({
                root:
                    autoplay === 'inview' || $el.preload === 'none'
                        ? null
                        : parent($el).closest(':not(a)'),
            }),
        }),
    ],
};

function isPlaying(videoEl) {
    return !videoEl.paused && !videoEl.ended;
}
