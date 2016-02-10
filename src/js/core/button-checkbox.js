export default function (UIkit) {

    UIkit.component('button-checkbox', {

        props: {
            activeClass: String,
            target: String
        },

        defaults: {
            activeClass: 'uk-active',
            target: '.uk-button'
        },

        ready() {
            UIkit.button(this.$el.find(this.target), {activeClass: this.activeClass, ariaAttr: 'aria-checked'});
        }

    });

}
