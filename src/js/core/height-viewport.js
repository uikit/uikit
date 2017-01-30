export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean,
            height: Number
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false,
            height: 100
        },

        init() {
            this.$emit();
        },

        update: {

            write() {

                this.$el.css('boxSizing', 'border-box');

                var viewport = window.innerHeight, height, offset = 0;

                if (this.expand) {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - document.documentElement.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('min-height', height = this.$el.outerHeight() + diff)
                    }

                } else {

                    var top = this.$el[0].offsetTop;

                    if (top < viewport) {

                        if (this.offsetTop) {
                            offset += top;
                        }

                        if (this.offsetBottom) {
                            offset += this.$el.next().outerHeight() || 0;
                        }

                    }

                    if (this.height !== 100) {
                        offset += ((viewport - offset) / 100) * (100 - this.height)
                    }

                    this.$el.css('min-height', height = offset ? `calc(100vh - ${offset}px)` : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css('height', '');
                if (height && viewport - offset >= this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
