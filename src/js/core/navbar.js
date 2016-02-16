import $ from 'jquery';
import {Transition, isWithin} from '../util/index';

export default function (UIkit) {

    UIkit.component('navbar', {

        props: {
            overlay: Boolean,
            duration: Number,
            justify: String,
            dropdown: String,
            target: String,
            cls: String
        },

        defaults: {
            overlay: false,
            duration: 200,
            justify: false,
            dropdown: '.uk-navbar-nav > li:not([uk-drop], [uk-dropdown])',
            target: '.uk-navbar-dropdown',
            cls: 'uk-navbar-dropdown'

        },

        ready() {

            UIkit.drop(this.$el.find(this.dropdown), {target: this.target, cls: this.cls, justify: this.justify, flip: 'x'});

            if (!this.overlay) {
                return;
            }

            this.overlay = typeof this.overlay === 'string' ? $(this.overlay) : this.overlay;

            if (!this.overlay.length) {
                this.overlay = $('<div class="uk-dropdown-overlay"></div>').insertAfter(this.$el);
            }

            this.$el.on({

                show: (e, drop) => {

                    drop.$el.removeClass('uk-open');

                    Transition.stop(this.overlay).start(this.overlay, {height: drop.drop.outerHeight(true)}, this.duration).then(() => {
                        if (drop.isActive()) {
                            drop.$el.addClass('uk-open');
                            drop.$update();
                        }
                    });

                },

                hide: () => {
                    if (!UIkit.drop.getActive()) {
                        Transition.stop(this.overlay).start(this.overlay, {height: 0}, this.duration);
                    }
                }

            });

            this.overlay.on({

                mouseenter: () => {
                    var active = UIkit.drop.getActive();
                    if (UIkit.drop.getActive()) {
                        active.clearTimers();
                    }
                },

                mouseleave: (e) => {
                    var active = UIkit.drop.getActive();
                    if (active && !isWithin(e.relatedTarget, active.$el)) {
                        active.hide();
                    }
                }

            });

        }

    });

}
