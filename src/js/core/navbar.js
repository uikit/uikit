import $ from 'jquery';
import {Transition, isWithin, requestAnimationFrame, toJQuery} from '../util/index';

export default function (UIkit) {

    UIkit.component('navbar', {

        props: {
            dropdown: String,
            mode: String,
            pos: String,
            offset: Number,
            boundary: Boolean,
            boundaryAlign: Boolean,
            cls: String,
            delayShow: Number,
            delayHide: Number,
            dropbar: Boolean,
            duration: Number,
            dropbarMode: String
        },

        defaults: {
            dropdown: '.uk-navbar-nav > li',
            mode: 'hover',
            pos: 'bottom-left',
            offset: 0,
            boundary: true,
            boundaryAlign: false,
            cls: 'uk-navbar-dropdown',
            delayHide: 800,
            hoverIdle: 200,
            dropbar: false,
            duration: 200,
            dropbarMode: 'hover'
        },

        ready() {

            this.$el.find(this.dropdown + ':not([uk-drop], [uk-dropdown])').each((i, el) => {

                if (!toJQuery('.' + this.cls, el)) {
                    return;
                }

                UIkit.drop(el, {
                    mode: this.mode,
                    pos: this.pos,
                    offset: this.offset,
                    boundary: (this.boundary === true || this.boundaryAlign) ? this.$el : this.boundary,
                    boundaryAlign: this.boundaryAlign,
                    cls: this.cls,
                    flip: 'x',
                    delayShow: this.delayShow,
                    delayHide: this.delayHide
                });

            });

            this.$el.on('mouseenter', this.dropdown, (e) => {
                var active = this.getActive();
                if (active && active.mode !== 'click' && !isWithin(e.target, active.$el) && !active.isDelaying()) {
                    active.hide(true);
                }
            });

            if (!this.dropbar) {
                return;
            }

            this.dropbar = toJQuery(this.dropbar);

            if (!this.dropbar) {
                this.dropbar = $('<div class="uk-navbar-dropbar"></div>').insertAfter(this.$el);
            }

            if (this.dropbarMode === 'hover') {
                this.dropbar.addClass('uk-navbar-dropbar-hover');
            }

            var height, transition;

            this.$el.on({

                beforeshow: (e, drop) => {
                    drop.drop.addClass(`${this.cls}-dropbar`);
                },

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

                    transition = Transition.start(this.dropbar, {height: drop.drop.outerHeight(true)}, this.duration).then(() => {
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
                            Transition.stop(this.dropbar).start(this.dropbar, {height: 0}, this.duration);
                            height = 0;
                        }
                    });
                }

            });

            this.dropbar.on({

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
