import { hasAttr, isTag, isVideo, mute, parent, pause, play } from 'uikit-util';
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

    connected() {
        if (this.autoplay === 'inview' && !hasAttr(this.$el, 'preload')) {
            this.$el.preload = 'none';
        }

        if (isTag(this.$el, 'iframe') && !hasAttr(this.$el, 'allow')) {
            this.$el.allow = 'autoplay';
        }

        if (this.automute) {
            mute(this.$el);
        }
    },

    observe: [
        intersection({
            filter: ({ $el, autoplay }) => autoplay && isVideo($el),
            handler([{ isIntersecting }]) {
                if (isIntersecting) {
                    play(this.$el);
                } else {
                    pause(this.$el);
                }
            },
            args: { intersecting: false },
            options: ({ $el, autoplay }) => ({ root: autoplay === 'inview' ? null : parent($el) }),
        }),
    ],
};
