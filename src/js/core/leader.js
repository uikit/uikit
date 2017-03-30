import { Class } from '../mixin/index';
import { $, getCssVar } from '../util/index';

export default function (UIkit) {

    UIkit.component('leader', {

        mixins: [Class],

        props: {
            fill: String,
            media: 'media'
        },

        defaults: {
            fill: '',
            media: false
        },

        connected() {
            this.$el.wrapInner('<span class="uk-leader-fill"></span>');
            this.filler = this.$el.children().eq(0);
            this.fillChar = this.fill || getCssVar('leader-fill');
        },

        disconnected() {
            this.filler.contents().unwrap();
        },

        update: [

            {
                write() {

                    if (this.media && !window.matchMedia(this.media).matches) {
                        this.filler.attr('data-fill', '');
                        return;
                    }

                    var filltext = '';
                    var height = this.filler.attr('data-fill', this.fillChar).height();
                    var h = 0;

                    if (!height) {
                        return;
                    }

                    while (h <= height) {
                        filltext += this.fillChar;
                        h = this.filler.attr('data-fill', filltext).height();
                    }

                    this.filler.attr('data-fill', filltext.substring(1));
                },

                events: ['load', 'resize']

            }
        ]
    });

}
