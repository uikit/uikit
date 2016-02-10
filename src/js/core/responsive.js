export default function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        ready: 'update',

        update: {

            handler() {

                if (!this.$el.is(':visible') || !this.width || !this.height) {
                    return;
                }

                var width = this.$el.parent().width();

                this.$el.css({height: (width < this.width) ? Math.floor((width / this.width) * this.height) : this.height});

            },

            events: ['load', 'resize', 'orientationchange', 'update']

        }

    });

}
