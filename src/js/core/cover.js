export default function (UIkit) {

    UIkit.component('cover', {

        props: {
            automute: Boolean,
            width: String,
            height: String
        },

        defaults: {automute: true},

        ready() {

            this.parent = this.$el.parent();

            this.check();

            if (this.$el.is('iframe') && this.automute) {

                var src = this.$el.attr('src');

                this.$el.attr('src', '').on('load', function () {

                    this.contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');

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

                this.$el.css({
                    width: '',
                    height: ''
                });

                var dimension = {w: this.$el.width(), h: this.$el.height()};

                if (this.width && !isNaN(this.width)) {
                    dimension.w = this.width;
                }

                if (this.height && !isNaN(this.height)) {
                    dimension.h = this.height;
                }

                this.ratio = dimension.w / dimension.h;

                var w = this.parent.width(), h = this.parent.height(), width, height;

                // if element height < parent height (gap underneath)
                if ((w / this.ratio) < h) {

                    width = Math.ceil(h * this.ratio);
                    height = h;

                    // element width < parent width (gap to right)
                } else {

                    width = w;
                    height = Math.ceil(w / this.ratio);
                }

                this.$el.css({
                    width: width,
                    height: height
                });
            }

        }

    });

}
