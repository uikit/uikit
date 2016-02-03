export default function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        ready() {
            this.check();
        },

        update: {
            handler() {
                this.check();
            },
            on: ['load', 'resize', 'orientationchange', 'update']
        },

        methods: {

            check() {

                if (!this.$el.is(':visible') || !this.width || !this.height) {
                    return;
                }

                var width = this.$el.parent().width();

                this.$el.css({height: (width < this.width) ? Math.floor((width / this.width) * this.height) : this.height});

            }

        }

    });

}
