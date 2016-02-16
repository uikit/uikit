import $ from 'jquery';
import {Transition, isWithin} from '../util/index';

export default function (UIkit) {

    UIkit.component('navbar', {

        props: {
            dropdown: String,
            pos: String,
            offset: Number,
            justify: String,
            target: String,
            cls: String,
            overlay: Boolean,
            duration: Number
        },

        defaults: {
            dropdown: '.uk-navbar-nav > li:not([uk-drop], [uk-dropdown])',
            pos: 'bottom-left',
            offset: 0,
            justify: false,
            target: '.uk-navbar-dropdown',
            cls: 'uk-navbar-dropdown',
            overlay: false,
            duration: 200
        },

        ready() {

            UIkit.drop(this.$el.find(this.dropdown), {pos: this.pos, offset: this.offset, justify: this.justify, target: this.target, cls: this.cls, flip: 'x', boundary: this.$el});

            if (!this.overlay) {
                return;
            }

            this.overlay = typeof this.overlay === 'string' ? $(this.overlay) : this.overlay;

            if (!this.overlay.length) {
                this.overlay = $('<div class="uk-dropdown-overlay"></div>').insertAfter(this.$el);
            }

            var height, transition;

            this.$el.on({

                show: (e, drop) => {

                    drop.$el.removeClass('uk-open');

                    var newHeight = drop.drop.outerHeight(true);
                    if (height === newHeight) {

                        if (transition && transition.state() !== 'pending') {
                            drop.$el.addClass('uk-open');
                        }

                        return;
                    }
                    height = newHeight;

                    transition = Transition.start(this.overlay, {height: drop.drop.outerHeight(true)}, this.duration).then(() => {
                        var active = this.getActive();
                        if (active) {
                            active.$el.addClass('uk-open');
                            active.$update();
                        }
                    });

                },

                hide: () => {
                    requestAnimationFrame(() => {
                        if (!this.getActive()) {
                            Transition.stop(this.overlay).start(this.overlay, {height: 0}, this.duration);
                            height = 0;
                        }
                    });
                }

            });

            this.overlay.on({

                mouseenter: () => {
                    var active = this.getActive();
                    if (active) {
                        active.clearTimers();
                    }
                },

                mouseleave: (e) => {
                    var active = this.getActive();
                    if (active && !isWithin(e.relatedTarget, active.$el)) {
                        active.hide();
                    }
                }

            });

        },

        methods: {

            getActive() {
                var active = UIkit.drop.getActive();
                if (active && isWithin(active.$el, this.$el)) {
                    return active;
                }
            }

        }

    });

}
