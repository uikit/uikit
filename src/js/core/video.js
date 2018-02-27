import {css, isInView, isVisible, Player} from '../util/index';

export default function (UIkit) {

    UIkit.component('video', {

        props: {
            automute: Boolean,
            autoplay: Boolean,
        },

        defaults: {
            automute: false,
            autoplay: true
        },

        computed: {

            inView({autoplay}) {
                return autoplay === 'inview';
            }

        },

        ready() {

            this.player = new Player(this.$el);

            if (this.automute) {
                this.player.mute();
            }

        },

        update: [

            {

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

        ],

    });

}
