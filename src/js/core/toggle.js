import $ from 'jquery';
import {each, hasTouch, isWithin} from '../util/index';

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

            click(e) {
                if (!isWithin(e.target, this.target)) {
                    e.preventDefault();
                }

                this.target.trigger('toggle', [this.$el]);
            },

            mouseenter() {
                this.target.trigger('toggleenter', [this.$el]);
            },

            mouseleave() {
                this.target.trigger('toggleleave', [this.$el]);
            }

        }

    });

}
