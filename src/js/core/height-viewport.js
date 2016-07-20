export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            offset: Boolean,
            expand: Boolean
        },

        defaults: {
            offset: false,
            expand: false
        },

        init() {
            if (!this.expand) {
                this.$el.css('min-height', this.getHeight());
            }
        },

        update: {

            handler() {

                this.borderBox = this.$el.css('box-sizing') === 'border-box';

                if (this.expand) {

                    this.$el.css('min-height', '');
                    if (document.documentElement.offsetHeight < window.innerHeight) {
                        this.$el.css('min-height', this.$el.outerHeight() + window.innerHeight - document.documentElement.offsetHeight - (this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height()))
                    }
                    return;

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css('height', '');
                if (this.getHeight() >= this.$el.height()) {
                    this.$el.css('height', this.getHeight());
                }

                this.$el.css('min-height', this.getHeight());

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            getHeight() {

                var height = window.innerHeight;

                if (this.offset && this.$el.offset().top < height) {
                    height -= this.$el.offset().top + (this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height());
                }

                return height;
            }

        }

    });

}
