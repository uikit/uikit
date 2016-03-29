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
            pos: 'bottom-left',
            offset: 0,
            boundary: true,
            boundaryAlign: false,
            clsDrop: 'uk-navbar-dropdown',
            delayHide: 800,
            dropbar: false,
            duration: 200,
            dropbarMode: 'overlay'
        },

        ready() {

            var drop;

            this.$el.find(this.dropdown + ':not([uk-drop], [uk-dropdown])').each((i, el) => {

                drop = toJQuery('.' + this.clsDrop, el);

                if (!drop) {
                    return;
                }

                UIkit.drop(drop, {
                    mode: this.mode,
                    pos: this.pos,
                    offset: this.offset,
                    boundary: (this.boundary === true || this.boundaryAlign) ? this.$el : this.boundary,
                    boundaryAlign: this.boundaryAlign,
                    clsDrop: this.clsDrop,
                    flip: 'x',
                    delayShow: !this.delayShow && this.dropbar && 100,
                    delayHide: this.delayHide
                });

            });

            this.$el.on('mouseenter', this.dropdown, ({target}) => {
                var active = this.getActive();
                if (active && active.mode !== 'click' && !isWithin(target, active.toggle) && !active.isDelaying) {
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

            if (this.dropbarMode === 'overlay') {
                this.dropbar.addClass('uk-navbar-dropbar-overlay');
            }

            this.$el.on({

                beforeshow: (e, {$el}) => {
                    $el.addClass(`${this.clsDrop}-dropbar`);

                    var height = this.dropbar[0].offsetHeight ? this.dropbar.height() : 0;
                    Transition.stop(this.dropbar);
                    this.dropbar.height(height);
                    Transition.start(this.dropbar, {height: $el.outerHeight(true)}, this.duration);
                },

                hide: () => {

                    requestAnimationFrame(() => {

                        if (!this.getActive()) {
                            var height = this.dropbar[0].offsetHeight ? this.dropbar.height() : 0;
                            Transition.stop(this.dropbar);
                            this.dropbar.height(height);
                            Transition.start(this.dropbar, {height: 0}, this.duration);
                        }

                    })
                }

            });

            this.dropbar.on({

                mouseenter: () => {
                    var active = this.getActive();
                    if (active) {
                        active.clearTimers();
                    }
                },

                mouseleave: ({relatedTarget}) => {
                    var active = this.getActive();
                    if (active && !isWithin(relatedTarget, active.toggle)) {
                        active.hide();
                    }
                }

            });

        },

        methods: {

            getActive() {
                var active = UIkit.drop.getActive();
                if (active && isWithin(active.toggle, this.$el)) {
                    return active;
                }
            }

        }

    });

}
