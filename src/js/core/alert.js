export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [UIkit.mixin.class, UIkit.mixin.toggable],

        props: {
            animation: Boolean,
            close: String
        },

        defaults: {
            animation: true,
            close: '.uk-alert-close'
        },

        ready() {
            this.$el.on('click', this.close, e => {
                e.preventDefault();
                this.closeAlert();
            });
        },

        methods: {

            closeAlert() {
                this.toggleElement(this.$el).then(() => this.$destroy(true));
                requestAnimationFrame(() => this.$el.css('opacity', 0));
            }

        }

    });

}
