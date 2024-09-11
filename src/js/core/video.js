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
        if (this.autoplay === 'inview' && !hasAttr(this.$el, 'preload')) {
            this.$el.preload = 'none';
        }

        if (isTag(this.$el, 'iframe') && !hasAttr(this.$el, 'allow')) {
            this.$el.allow = 'autoplay';
        }

        if (this.autoplay === 'hover') {
            if (isTag(this.$el, 'video')) {
                this.$el.tabindex = 0;
            } else {
                this.autoplay = true;
            }
        }

        if (this.automute) {
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
            filter: ({ autoplay }) => autoplay !== 'hover',
            handler([{ isIntersecting }]) {
                if (!document.fullscreenElement) {
                    if (isIntersecting) {
                        if (this.autoplay) {
                            play(this.$el);
                        }
                    } else {
                        pause(this.$el);
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
