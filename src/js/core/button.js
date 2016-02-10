export default function (UIkit) {

    UIkit.component('button', {

        props: {
            activeClass: String
        },

        defaults: {
            activeClass: 'uk-active',
            ariaAttr: 'aria-pressed'
        },

        ready() {
            this.$el
                .attr(this.ariaAttr, this.$el.hasClass(this.activeClass))
                .on('click', e => {

                    if (this.$el.is('a[href="#"]')) {
                        e.preventDefault();
                    }

                    this.toggle();

                    this.$el.blur().trigger('change', [this.$el]);

                });
        },

        methods: {

            toggle() {
                this.$el.toggleClass(this.activeClass).attr(this.ariaAttr, this.$el.hasClass(this.activeClass));
            }

        }

    });

}
