import { Class } from '../mixin/index';
import { Dimensions, Player } from '../util/index';

export default function (UIkit) {

    UIkit.component('cover', {

        mixins: [Class],

        props: {
            width: Number,
            height: Number
        },

        computed: {

            el() {
                return this.$el[0];
            },

            parent() {
                return this.el.parentNode;
            }

        },

        ready() {

            if (this.$el.is('iframe')) {
                this.$el.css('pointerEvents', 'none');
            }

            var player = new Player(this.$el);

            if (player.isVideo()) {
                player.mute();
            }

        },

        update: {

            write() {

                if (this.el.offsetHeight === 0) {
                    return;
                }

                this.$el
                    .css({width: '', height: ''})
                    .css(Dimensions.cover(
                        {width: this.width || this.el.clientWidth, height: this.height || this.el.clientHeight},
                        {width: this.parent.offsetWidth, height: this.parent.offsetHeight}
                    ));

            },

            events: ['load', 'resize']

        },

        events: {

            loadedmetadata() {
                this.$emit();
            }

        }

    });

}
