export default function (UIkit) {

    UIkit.component('alert', {

        props: {
            fade: Boolean,
            duration: Number,
            trigger: String
        },

        defaults: {
            fade: true,
            duration: 200,
            trigger: '.uk-alert-close'
        },

        ready() {
            this.$el.on('click', this.trigger, e => {
                e.preventDefault();
                this.close();
            })
        },

        methods: {

            close() {

                this.$el.trigger('close');

                if (this.fade) {
                    this.$el
                        .css('overflow', 'hidden')
                        .css('max-height', this.$el.height())
                        .animate({
                            'height': 0,
                            'opacity': 0,
                            'padding-top': 0,
                            'padding-bottom': 0,
                            'margin-top': 0,
                            'margin-bottom': 0
                        }, this.duration, this.$destroy.bind(this));
                } else {
                    this.$destroy();
                }

            }

        },

        destroy() {
            this.$el.off('click');
            this.$el.trigger('closed');
        }

    });

}
