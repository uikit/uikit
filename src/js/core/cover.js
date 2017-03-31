import { Class } from '../mixin/index';
import { Dimensions } from '../util/index';

export default function (UIkit) {

    UIkit.component('cover', {

        mixins: [Class],

        props: {
            automute: Boolean,
            width: Number,
            height: Number
        },

        defaults: {automute: true},

        computed: {

            el() {
                return this.$el[0];
            },

            parent() {
                return this.$el.parent()[0];
            }

        },

        ready() {

            if (!this.$el.is('iframe')) {
                return;
            }

            this.$el.css('pointerEvents', 'none');

            if (this.automute) {

                var src = this.$el.attr('src');

                this.$el
                    .attr('src', `${src}${~src.indexOf('?') ? '&' : '?'}enablejsapi=1&api=1`)
                    .on('load', ({target}) => target.contentWindow.postMessage('{"event": "command", "func": "mute", "method":"setVolume", "value":0}', '*'));
            }
        },

        update: {

            write() {

                if (this.el.offsetHeight === 0) {
                    return;
                }

                this.$el
                    .css({width: '', height: ''})
                    .css(Dimensions.cover(
                        {width: this.width || this.el.clientWidth, height: this.height || this.el.clientHeight},
                        {width: this.parent.offsetWidth, height: this.parent.offsetHeight}
                    ));

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
