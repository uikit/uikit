import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('button-radio', {

        props: {
            activeClass: String,
            target: String
        },

        defaults: {
            activeClass: 'uk-active',
            target: '.uk-button'
        },

        ready() {

            var targets = this.$el.find(this.target);

            targets.on('click', e => {
                targets.removeClass(this.activeClass).attr('aria-checked', 'false');
            });

            UIkit.button(targets, {activeClass: this.activeClass, ariaAttr: 'aria-checked'});
        }

    });

}
