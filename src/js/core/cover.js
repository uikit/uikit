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

                var el = this.$el;

                if (!isVisible(el)) {
                    return;
                }

                var {offsetHeight: height, offsetWidth: width} = el.parentNode;

                css(
                    css(el, {width: '', height: ''}),
                    Dimensions.cover(
                        {
                            width: this.width || el.clientWidth,
                            height: this.height || el.clientHeight
                        },
                        {
                            width: width + (width % 2 || height % 2 ? 1 : 0),
                            height
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
