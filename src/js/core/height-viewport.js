export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false
        },

        init() {
            this._callUpdate();
        },

        update: {

            write() {

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
