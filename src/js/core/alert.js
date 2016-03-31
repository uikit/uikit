export default function (UIkit) {

    UIkit.component('alert', {

        mixins: [UIkit.mixin.toggable],

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
                this.$el.trigger('close');
                this.toggleElement(this.$el).then(() => this.$destroy());
                requestAnimationFrame(() => this.$el.css('opacity', 0))
            }

        },

        destroy() {
            this.$el.off('click');
            this.$el.trigger('closed');
        }

    });

}
