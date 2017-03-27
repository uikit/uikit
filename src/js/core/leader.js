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
                var mw = this.filler.text('').width();
                var fill = this.filler.offset().left - this.$el.offset().left;
                var times = Math.floor((lw - fill)/mw);
                var filltext = '';

                for (var i=0;i<times;i++) {
                    filltext += this.fillChar;
                }

                this.filler.text(filltext);
            }

        }

    });

}
