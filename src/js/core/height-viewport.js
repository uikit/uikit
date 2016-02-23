export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            offset: Boolean
        },

        defaults: {
            offset: false
        },

        init() {
            this.$el.css('min-height', this.getHeight());
        },

        ready() {
            this.borderBox = this.$el.css('box-sizing') === 'border-box';
        },

        update: {

            handler() {

                if (!this.offset) {
                    // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                    this.$el.css('height', '');
                    if (this.getHeight() >= this.$el.height()) {
                        this.$el.css('height', this.getHeight());
                    }
                }

                this.$el.css('min-height', this.getHeight());

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            getHeight() {

                var height = window.innerHeight;

                if (this.offset) {
                    height -= this.$el.offset().top;
                    height -= this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height();
                }

                return height;
            }

        }

    });

}
