import { Dimensions } from '../util/index';

export default function (UIkit) {

    UIkit.component('cover', {

        props: {
            automute: Boolean,
            width: Number,
            height: Number
        },

        defaults: {automute: true},

        ready() {
            if (this.$el.is('iframe') && this.automute) {

                var src = this.$el.attr('src');

                this.$el.attr('src', '').on('load', function () {

                    this.contentWindow.postMessage('{"event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');

                }).attr('src', [src, (~src.indexOf('?') ? '&' : '?'), 'enablejsapi=1&api=1'].join(''));
            }
        },

        update: {

            write() {

                if (this.$el[0].offsetHeight === 0) {
                    return;
                }

                this.$el
                    .css({width: '', height: ''})
                    .css(Dimensions.cover(
                        {width: this.width || this.$el.width(), height: this.height || this.$el.height()},
                        {width: this.$el.parent().width(), height: this.$el.parent().height()}
                    ));

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
