import $ from 'jquery';
import {extend, isWithin, toJQuery, Transition} from '../util/index';

export default function (UIkit) {

    UIkit.component('navbar', {

        mixins: [UIkit.mixin.class],

        props: {
            dropdown: String,
            mode: String,
            align: String,
            offset: Number,
            boundary: Boolean,
            boundaryAlign: Boolean,
            clsDrop: String,
            delayShow: Number,
            delayHide: Number,
            dropbar: Boolean,
            duration: Number,
            dropbarMode: String
        },

        defaults: {
            dropdown: '.uk-navbar-nav > li',
            mode: 'hover',
            align: 'left',
            offset: false,
            boundary: true,
            boundaryAlign: false,
            clsDrop: 'uk-navbar-dropdown',
            delayShow: 0,
            delayHide: 800,
            flip: 'x',
            dropbar: false,
            duration: 200,
            dropbarMode: 'overlay'
        },

        ready() {

            var drop;

            this.boundary = (this.boundary === true || this.boundaryAlign) ? this.$el : this.boundary;
            this.pos = `bottom-${this.align}`;

            this.$el.find(this.dropdown).each((i, el) => {

                drop = toJQuery(`.${this.clsDrop}`, el);

                if (drop && !UIkit.getComponent(drop, 'drop') && !UIkit.getComponent(drop, 'dropdown')) {
                    UIkit.drop(drop, extend({}, this));
                }
            });

            this.$el.on('mouseenter', this.dropdown, ({target}) => {
                var active = this.getActive();
                if (active && active.mode !== 'click' && !isWithin(target, active.toggle.$el) && !active.isDelaying) {
                    active.hide(false);
                }
            });

            if (!this.dropbar) {
                return;
            }

            this.dropbar = toJQuery(this.dropbar);

            if (!this.dropbar) {
                this.dropbar = $('<div class="uk-navbar-dropbar"></div>').insertAfter(this.$el);
            }

            if (this.dropbarMode === 'overlay') {
                this.dropbar.addClass('uk-navbar-dropbar-overlay');
            }

            this.dropbar
                .on('mouseenter', () => {
                    var active = this.getActive();
                    if (active) {
                        active.clearTimers();
                    }
                })
                .on('mouseleave', ({relatedTarget}) => {
                    var active = this.getActive();
                    if (active && !isWithin(relatedTarget, active.toggle.$el)) {
                        active.hide();
                    }
                });

        },

        events: {

            mouseenter({target}) {
                var active = this.getActive();
                if (active && active.mode !== 'click' && isWithin(target, this.dropdown) && !isWithin(target, active.toggle.$el) && !active.isDelaying) {
                    active.hide(false);
                }
            },

            beforeshow(e, {$el}) {
                if (this.dropbar) {
                    $el.addClass(`${this.clsDrop}-dropbar`);
                    this.transitionTo($el.outerHeight(true));
                }
            },

            hide() {
                if (this.dropbar) {
                    this.transitionTo(0);
                }
            }

        },

        methods: {

            getActive() {
                var active = UIkit.drop.getActive();
                if (active && isWithin(active.toggle.$el, this.$el)) {
                    return active;
                }
            },

            transitionTo(height) {
                var current = this.dropbar[0].offsetHeight ? this.dropbar.height() : 0;
                Transition.stop(this.dropbar);
                this.dropbar.height(current);
                return Transition.start(this.dropbar, {height}, this.duration);
            }

        }

    });

}
