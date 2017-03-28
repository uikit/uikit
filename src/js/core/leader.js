import { Class } from '../mixin/index';
import { $, getStyle } from '../util/index';

export default function (UIkit) {

    UIkit.component('leader', {

        mixins: [Class],

        connected() {

            this.filler = $('<span class="uk-leader-fill"></span>').appendTo(this.$el);
            this.fillChar = getStyle(this.filler[0], 'content', ':after').replace(/^["'](.*)["']$/, '$1');

            $(window).on('load resize', () => this.fill() );

            this.fill();
        },

        disconnected() {
            this.filler.remove();
        },

        methods: {

            fill() {

                var lw = this.$el.width();
                var mw = this.filler.removeClass('uk-hidden').text('').width();
                var oe = this.$el.offset().left;
                var of = this.filler.offset().left;
                var fill = of - oe;
                var maxtimes = Math.floor(lw/mw);
                var times = Math.floor((lw - fill)/mw);

                // is filler alone in next row?
                if (times/maxtimes > 0.9) {
                    return this.filler.addClass('uk-hidden')
                }

                var filltext = '';

                for (var i=0;i<times;i++) {
                    filltext += this.fillChar;
                }

                this.filler.text(filltext);
            }

        }

    });

}
