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

            if (this.$el.tagName === 'IFRAME') {
                css(this.$el, 'pointerEvents', 'none');
            }

            var player = new Player(this.$el);

            if (player.isVideo()) {
                player.mute();
            }

        },

        update: {

            write() {

                var el = this.$el, parent = el.parentNode;

                if (!isVisible(el)) {
                    return;
                }

                css(
                    css(el, {width: '', height: ''}),
                    Dimensions.cover(
                        {
                            width: this.width || el.clientWidth,
                            height: this.height || el.clientHeight
                        },
                        {
                            width: parent.offsetWidth,
                            height: parent.offsetHeight
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
