import {hasTouch, isWithin} from '../util/index';

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

            if (!this.target) {
                return;
            }

            this.target.on('toggle', (e, toggle) => {
                if (this.$el === toggle && !e.isDefaultPrevented()) {
                    this.toggleElement(e.target);
                }
            })

        },

        events: {

            tap(e) {
                if (!isWithin(e.target, this.target)) {
                    e.preventDefault();
                }

                this.toggle();
            },

            click(e) {
                if (!isWithin(e.target, this.target)) {
                    e.preventDefault();
                }

                if (!hasTouch) {
                    this.toggle();
                }
            },

            mouseenter() {
                this.target.trigger('toggleenter', [this.$el]);
            },

            mouseleave() {
                this.target.trigger('toggleleave', [this.$el]);
            }

        },

        methods: {

            toggle() {
                this.target.trigger('toggle', [this.$el]);
            }

        }

    });

}
