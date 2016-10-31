export default function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            mode: String
        },

        defaults: {
            mode: 'viewport'
        },

        init() {
            if (this.mode !== 'expand') {
                this.$el.css('min-height', this.getHeight(this.mode));
            }
        },

        update: {

            handler() {

                var mode = this.mode === 'offset' && this.$el.offset().top >= window.innerHeight ? 'viewport' : this.mode;

                this.borderBox = this.$el.css('box-sizing') === 'border-box';

                if (mode === 'expand') {

                    this.$el.css('min-height', '');
                    if (document.documentElement.offsetHeight < window.innerHeight) {
                        this.$el.css('min-height', this.$el.outerHeight() + window.innerHeight - document.documentElement.offsetHeight - (this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height()))
                    }
                    return;

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.css('height', '').css('min-height', '');
                var height = this.getHeight(mode);
                if (height >= this.$el.height()) {
                    this.$el.css('height', height);
                }

                this.$el.css('min-height', height);

            },

            events: ['load', 'resize', 'orientationchange']

        },

        methods: {

            getHeight(mode) {

                var height = window.innerHeight;

                if (mode === 'offset'&& this.$el.offset().top < height) {
                    height -= this.$el.offset().top + (this.borderBox ? 0 : this.$el.outerHeight() - this.$el.height());
                }

                return height;
            }

        }

    });

}
