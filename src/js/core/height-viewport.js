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

                    if (viewport > document.documentElement.offsetHeight) {
                        this.$el.css('min-height', height = this.$el.outerHeight()
                            + viewport
                            - document.documentElement.offsetHeight
                            - this.getPadding()
                        )
                    }

                } else {

                    var top = this.$el[0].offsetTop, calc;

                    offset = this.mode === 'offset' && top < viewport;
                    calc = this.getPadding() + (offset ? top : 0);
                    height = calc ? `calc(100vh - ${calc}px)` : '100vh';

                    this.$el.css('min-height', height);

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css('height', '');
                if (height && viewport - (offset ? top : 0) > this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            getPadding() {
                return this.$el.outerHeight() - parseFloat(this.$el.css('height'));
            }

        }

    });

}
