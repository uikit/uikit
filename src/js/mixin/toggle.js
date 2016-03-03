import $ from 'jquery';
import {Animation} from '../util/index';

var updating;

export default {

    props: {
        cls: Boolean,
        animation: String,
        duration: Number
    },

    defaults: {
        cls: false,
        animation: false,
        duration: 200
    },

    ready() {

        this.aria = this.cls === false;
        this.animations = this.animation && this.animation.split(' ');

        if (this.animations) {

            if (this.animations.length == 1) {
                this.animations[1] = this.animations[0];
            }

            this.animations[0] = this.animations[0].trim();
            this.animations[1] = this.animations[1].trim();

        }

    },

    methods: {

        toggleState(el, animate) {

            el = $(el);

            var toggled = this.isToggled(el);

            if (this.animations && animate !== false) {

                Animation.cancel(el);

                if (!this.isToggled(el)) {

                    this.doToggle(el, true);
                    return Animation.in(el, this.animations[0], this.duration).then(() => {
                        this.doUpdate(el);
                    });

                }

                return Animation.out(el, this.animations[1], this.duration).then(() => {
                    this.doToggle(el, false);
                    this.doUpdate(el);
                });

            }

            this.doToggle(el, !toggled);
            this.doUpdate(el);
            return $.Deferred().resolve().promise();
        },

        doToggle(el, toggled) {
            el = $(el);
            el.toggleClass(this.cls, this.cls && toggled).attr('hidden', !this.cls && !toggled);
        },

        isToggled(el) {
            el = $(el);
            return this.cls ? el.hasClass(this.cls) : !el.attr('hidden');
        },

        doUpdate(el) {

            if (!updating) {
                requestAnimationFrame(() => {
                    this.$update();
                    updating = false;
                });
                updating = true;
            }

            if (this.aria) {
                el.attr('aria-hidden', !!el.attr('hidden'));
            }
        }

    }

}
