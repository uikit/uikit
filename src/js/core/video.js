import {css, hasAttr, isInView, isVisible, mute, pause, play} from 'uikit-util';

export default {

    args: 'autoplay',

    props: {
        automute: Boolean,
        autoplay: Boolean
    },

    data: {
        automute: false,
        autoplay: true
    },

    computed: {

        inView({autoplay}) {
            return autoplay === 'inview';
        }

    },

    connected() {

        if (this.inView && !hasAttr(this.$el, 'preload')) {
            this.$el.preload = 'none';
        }

        if (this.automute) {
            mute(this.$el);
        }

    },

    update: {

        read() {
            return {
                visible: isVisible(this.$el) && css(this.$el, 'visibility') !== 'hidden',
                inView: this.inView && isInView(this.$el)
            };
        },

        write({visible, inView}) {

            if (!visible || this.inView && !inView) {
                pause(this.$el);
            } else if (this.autoplay === true || this.inView && inView) {
                play(this.$el);
            }

        },

        events: ['resize', 'scroll']

    }

};
