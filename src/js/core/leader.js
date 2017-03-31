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

                    if (this.media && !window.matchMedia(this.media).matches) {
                        this.filler.attr('data-fill', '');
                        return;
                    }

                   var lw = this.$el.width();
                   var mw = this.filler.attr('data-fill', this.fillChar).width();
                   var fill = this.filler.offset().left - this.$el.offset().left;
                   var times = Math.ceil((lw - fill) / mw);
                   var filltext = '';

                   if (times < 3) {
                       this.filler.attr('data-fill', '');
                       return;
                   }

                   while (filltext.length < times) {
                       filltext += this.fillChar;
                   }

                   this.filler.attr('data-fill', filltext);
               },

                events: ['load', 'resize']

            }
        ]
    });

}
