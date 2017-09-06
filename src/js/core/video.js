import { css, isVisible, Player } from '../util/index';

export default function (UIkit) {

    UIkit.component('video', {

        props: {
            automute: Boolean,
            autoplay: Boolean,
        },

        defaults: {automute: false, autoplay: true},

        ready() {
            this.player = new Player(this.$el);

            if (this.automute) {
                this.player.mute();
            }

        },

        update: {

            write() {

                if (!this.player || !this.autoplay) {
                    return;
                }

                if (!isVisible(this.$el) || css(this.$el, 'visibility') === 'hidden') {
                    this.player.pause();
                } else {
                    this.player.play();
                }

            },

            events: ['load']

        },

    });

}
