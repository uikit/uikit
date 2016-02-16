export default function (UIkit) {

    UIkit.component('cover', {

        props: {
            automute: Boolean,
            width: Number,
            height: Number
        },

        defaults: {automute: true},

        ready() {

            this.parent = this.$el.parent();

            if (this.$el.is('iframe') && this.automute) {

                var src = this.$el.attr('src');

                this.$el.attr('src', '').on('load', function () {

                    // TODO automute broken

                    this.contentWindow.postMessage('{"event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');

                }).attr('src', [src, (src.indexOf('?') > -1 ? '&' : '?'), 'enablejsapi=1&api=1'].join(''));
            }
        },

        update: {

            handler() {

                if (!this.$el.is(':visible')) {
                    return this;
                }

                var dimensions = {width: '', height: ''};

                this.$el.css(dimensions);

                var width = this.parent.width(),
                    height = this.parent.height(),
                    ratio = (this.width || this.$el.width()) / (this.height || this.$el.height());

                // if element height < parent height (gap underneath)
                if ((width / ratio) < height) {

                    dimensions.width = Math.ceil(height * ratio);
                    dimensions.height = height;

                    // element width < parent width (gap to right)
                } else {

                    dimensions.width = width;
                    dimensions.height = Math.ceil(width / ratio);

                }

                this.$el.css(dimensions);
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
