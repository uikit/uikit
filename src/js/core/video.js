import {css, hasAttr, isInView, isVisible, Player} from 'uikit-util';

export default {

    args: 'autoplay',

    props: {
        automute: Boolean,
        autoplay: Boolean,
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

        this.player = new Player(this.$el);

        if (this.automute) {
            this.player.mute();
        }

    },

    update: {

        read(_, {type}) {

            return !this.player || (type === 'scroll' || type === 'resize') && !this.inView
                ? false
                : {
                    visible: isVisible(this.$el) && css(this.$el, 'visibility') !== 'hidden',
                    inView: this.inView && isInView(this.$el)
                };
        },

        write({visible, inView}) {

            if (!visible || this.inView && !inView) {
                this.player.pause();
            } else if (this.autoplay === true || this.inView && inView) {
                this.player.play();
            }

        },

        events: ['load', 'resize', 'scroll']

    }

};
