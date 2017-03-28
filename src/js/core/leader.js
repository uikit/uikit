import { Class } from '../mixin/index';
import { $, getCssVar } from '../util/index';

export default function (UIkit) {

    UIkit.component('leader', {

        mixins: [Class],

        connected() {
            this.filler = $('<span class="uk-leader-fill"></span>').appendTo(this.$el);
            this.fillChar = getCssVar('leader-fill');
        },

        disconnected() {
            this.filler.remove();
        },

        update: [

            {
                write() {

                    var lw = this.$el.width();
                    var mw = this.filler.removeClass('uk-hidden').attr('data-fill', this.fillChar).width();
                    var fill = this.filler.offset().left - this.$el.offset().left;;
                    var maxtimes = Math.floor(lw / mw);
                    var times = Math.floor((lw - fill) / mw);

                    if (times == 1 || times/maxtimes > 0.9) {
                        this.filler.addClass('uk-hidden');
                        return;
                    }

                    var filltext = '';

                    for (var i=0;i<times;i++) {
                        filltext += this.fillChar;
                    }

                    this.filler.attr('data-fill', filltext);
                },

                events: ['load', 'resize']

            }
        ]
    });

}
