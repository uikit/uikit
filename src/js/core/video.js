import {
    css,
    hasAttr,
    isInView,
    isVideo,
    isVisible,
    mute,
    observeIntersection,
    pause,
    play,
} from 'uikit-util';

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
        this.inView = this.autoplay === 'inview';

        if (this.inView && !hasAttr(this.$el, 'preload')) {
            this.$el.preload = 'none';
        }

        if (this.automute) {
            mute(this.$el);
        }

        this.registerObserver(observeIntersection(this.$el, () => this.$emit(), {}, false));
    },

    update: {
        read() {
            if (!isVideo(this.$el)) {
                return false;
            }

            return {
                visible: isVisible(this.$el) && css(this.$el, 'visibility') !== 'hidden',
                inView: this.inView && isInView(this.$el),
            };
        },

        write({ visible, inView }) {
            if (!visible || (this.inView && !inView)) {
                pause(this.$el);
            } else if (this.autoplay === true || (this.inView && inView)) {
                play(this.$el);
            }
        },
    },
};
