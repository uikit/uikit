export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggle],

        props: {
            target: 'jQuery'
        },

        defaults: {
            target: false
        },

        ready() {

            if (!this.target) {
                return;
            }

            this.aria = this.cls === false;
            this.updateAria(this.target);

            this.$el.on('click', e => {
                e.preventDefault();
                this.toggleState(this.target);
            });
        }

    });

}
