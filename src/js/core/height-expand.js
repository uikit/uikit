export default function (UIkit) {

    UIkit.component('expand', {

        update: {

            handler() {
                this.$el.css('min-height', '');
                if (document.documentElement.offsetHeight < window.innerHeight) {
                    this.$el.css('min-height', this.$el.outerHeight() + window.innerHeight - document.documentElement.offsetHeight - (this.$el.outerHeight() - this.$el.height()))
                }
            },

            events: ['load', 'resize', 'orientationchange']

        }

    });

}
