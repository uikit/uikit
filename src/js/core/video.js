import { Player } from '../util/index';

export default function (UIkit) {

    UIkit.component('video', {

        props: {
            automute: Boolean,
            autoplay: Boolean,
        },

        defaults: {automute: false, autoplay: true},

        computed: {

            el() {
                return this.$el[0];
            }

        },

        ready() {
            this.player = new Player(this.el);

            if (this.automute) {
                this.player.mute();
            }

        },

        update: {

            write() {

                if (!this.player || !this.autoplay) {
                    return;
                }

                if (this.el.offsetHeight === 0 || this.$el.css('visibility') === 'hidden') {
                    this.player.pause();
                } else {
                    this.player.play();
                }

            },

            events: ['load']

        },

    });

}
