export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggle],

        props: {
            href: 'jQuery',
            target: 'jQuery'
        },

        defaults: {
            href: false,
            target: false
        },

        ready() {

            this.target = this.target || this.href;

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
