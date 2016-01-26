import $ from 'jquery';
import {animate, hasAnimation} from '../util/index';

export default function (UIkit) {

    UIkit.component('toggle', {

        props: ['target', 'cls', 'animation', 'duration'],

        defaults: {
            target: false,
            cls: 'uk-hidden',
            animation: false,
            duration: 200
        },

        ready() {

            this.aria = (this.cls.indexOf('uk-hidden') !== -1);
            this.targets = $(this.target);

            this.animations = hasAnimation && this.animation && this.animation.split(',');

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

            toggle: function () {

                if (!this.targets.length) {
                    return;
                }

                if (this.animations) {

                    this.targets
                        .css('animation-duration', this.duration + 'ms')
                        .each((i, target) => {

                            var el = $(target);

                            if (el.hasClass(this.cls)) {

                                el.toggleClass(this.cls);

                                animate(el, this.animations[0]).then(() => {
                                    el.css('animation-duration', '');
                                    this.$update();
                                });

                            } else {

                                animate(el, this.animations[1] + ' uk-animation-reverse').then(() => {
                                    el.toggleClass(this.cls).css('animation-duration', '');
                                    this.$update();
                                });

                            }

                        });

                } else {
                    this.targets.toggleClass(this.cls);
                    this.$update();
                }

                this.updateAria();

            },

            updateAria: function () {
                if (this.aria) {
                    this.targets.each(function () {
                        $(this).attr('aria-hidden', $(this).hasClass('uk-hidden'));
                    });
                }
            }

        },

        destroy() {
            this.$el.off('click');
        }

    });

}
