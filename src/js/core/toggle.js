import $ from 'jquery';

export default function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.toggable],

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
        },

        events: {

            click(e) {

                if (String($(e.target).closest('a').attr('href'))[0] === '#') {
                    e.preventDefault();
                }

                this.toggle();
            },

            mouseenter() {
                this.target.triggerHandler('toggleenter', [this.$el]);
            },

            mouseleave() {
                this.target.triggerHandler('toggleleave', [this.$el]);
            }

        },

        methods: {

            toggle() {
                var event = $.Event('toggle');
                this.target.triggerHandler(event, [this.$el]);

                if (!event.isDefaultPrevented()) {
                    this.toggleElement(event.target);
                }
            }

        }

    });

}
