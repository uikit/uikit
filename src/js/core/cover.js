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

            this.width = this.width && !isNaN(this.width) ? this.width : false;
            this.height = this.height && !isNaN(this.height) ? this.height : false;

            this.check();

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
                this.check();
            },
            on: ['resize', 'orientationchange', 'update']
        },

        methods: {

            check: function () {

                if (!this.$el.is(':visible')) {
                    return this;
                }

                this.$el.css({width: '', height: ''});

                var width, height,
                    parentWidth = this.parent.width(),
                    parentHeight = this.parent.height(),
                    ratio = (this.width || this.$el.width()) / (this.height || this.$el.height());

                // if element height < parent height (gap underneath)
                if ((parentWidth / ratio) < parentHeight) {

                    width = Math.ceil(parentHeight * ratio);
                    height = parentHeight;

                    // element width < parent width (gap to right)
                } else {

                    width = parentWidth;
                    height = Math.ceil(parentWidth / ratio);

                }

                this.$el.css({width: width, height: height});
            }

        }

    });

}
