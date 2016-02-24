import $ from 'jquery';
import {Animation} from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        props: {
            target: 'jQuery',
            cls: Boolean,
            animation: String,
            duration: Number
        },

        defaults: {
            target: false,
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

            this.$el.on('click', e => {

                if (this.$el.is('a[href="#"]')) {
                    e.preventDefault();
                }

                this.toggle();
            });
        },

        methods: {

            toggle() {

                if (!this.target) {
                    return;
                }

                Animation.cancel(this.target);

                if (this.animations) {

                    this.target.each((i, target) => {

                        var el = $(target);

                        if (this.isToggled(el)) {

                            this.doToggle(el);
                            Animation.in(el, this.animations[0], this.duration).then(this.doUpdate.bind(this));

                        } else {

                            Animation.out(el, this.animations[1], this.duration).then(() => {
                                this.doToggle(el);
                                this.doUpdate();
                            });

                        }

                    });

                } else {
                    this.doToggle(this.target);
                    this.doUpdate();
                }

            },

            doToggle(targets) {
                if (this.cls) {
                    targets.toggleClass(this.cls);
                } else {
                    targets.each((i, el) => {
                        $(el).attr('hidden', !this.isToggled(el));
                    });
                }
            },

            isToggled(el) {
                el = $(el);
                return this.cls ? el.hasClass(this.cls) : !!el.attr('hidden');
            },

            doUpdate() {
                this.$update();

                if (this.aria) {
                    this.target.each(function () {
                        $(this).attr('aria-hidden', !!$(this).attr('hidden'));
                    });
                }
            }

        }

    });

}
