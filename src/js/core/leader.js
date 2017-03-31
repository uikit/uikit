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
            this.filler = $('<span class="uk-leader-fill"></span>').appendTo(this.$el);
        },

        disconnected() {
            this.filler.remove();
        },

        update: [

            {

                write() {

                    this.filler.attr('data-fill', '');

                    if (this.media && !window.matchMedia(this.media).matches) {
                        return;
                    }

                    var height = this.$el.height();
                    var times = this.$el.width();
                    var filltext = '';

                    while (filltext.length < times) {
                        filltext += this.fillChar;
                    }

                    this.filler.attr('data-fill', filltext);

                    if (height != this.$el.height()) {
                        this.filler.attr('data-fill', '');
                    }
               },

                events: ['load', 'resize']

            }
        ]
    });

}
