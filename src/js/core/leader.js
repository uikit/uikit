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
            this.fillChar = this.fill || getCssVar('leader-fill');
        },

        update: [

            {
                write() {

                    if (this.media && !window.matchMedia(this.media).matches) {
                        this.$el.attr('data-fill', '');
                        return;
                    }

                    var filltext = '';
                    var height = this.$el.attr('data-fill', this.fillChar).height();
                    var h = 0;

                    if (!height) {
                        return;
                    }

                    while (h <= height) {
                        filltext += this.fillChar;
                        h = this.$el.attr('data-fill', filltext).height();
                    }

                    this.$el.attr('data-fill', filltext.substring(1));
                },

                events: ['load', 'resize']

            }
        ]
    });

}
