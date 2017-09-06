import { Class } from '../mixin/index';
import { css, Dimensions, isVisible, Player } from '../util/index';

export default function (UIkit) {

    UIkit.component('cover', {

        mixins: [Class],

        props: {
            width: Number,
            height: Number
        },

        ready() {

            if (this.$el.is('iframe')) {
                css(this.$el, 'pointerEvents', 'none');
            }

            var player = new Player(this.$el);

            if (player.isVideo()) {
                player.mute();
            }

        },

        update: {

            write() {

                if (!isVisible(this.$el)) {
                    return;
                }

                css(
                    css(this.$el, {width: '', height: ''}),
                    Dimensions.cover(
                        {
                            width: this.width || this.$el[0].clientWidth,
                            height: this.height || this.$el[0].clientHeight
                        },
                        {
                            width: this.$el.parent()[0].offsetWidth,
                            height: this.$el.parent()[0].offsetHeight
                        }
                    )
                );

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
