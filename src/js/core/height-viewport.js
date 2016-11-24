export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            mode: String
        },

        defaults: {
            mode: 'viewport'
        },

        init() {
            this._callUpdate();
        },

        update: {

            handler() {

                var viewport = window.innerHeight, height, offset;

                if (this.mode === 'expand') {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - document.documentElement.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('min-height', height = this.$el.outerHeight() + diff)
                    }

                } else {

                    var top = this.$el[0].offsetTop;

                    offset = this.mode === 'offset' && top < viewport;

                    this.$el.css('min-height', height = offset ? `calc(100vh - ${offset ? top : 0}px)` : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css('height', '');
                if (height && viewport - (offset ? top : 0) >= this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
