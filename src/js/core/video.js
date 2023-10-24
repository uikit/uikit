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

    beforeConnect() {
        this.inView = this.autoplay === 'inview';
    },

    connected() {
        if (this.inView && !hasAttr(this.$el, 'preload')) {
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
            filter: ({ $el }) => isVideo($el),
            handler([{ isIntersecting }]) {
                if (isIntersecting) {
                    play(this.$el);
                } else {
                    pause(this.$el);
                }
            },
            args: { intersecting: false },
            options: ({ $el, inView }) => ({ root: inView ? null : parent($el) }),
        }),
    ],
};
