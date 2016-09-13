import { $, extend, isWithin, toJQuery, Transition } from '../util/index';
import { Class } from '../mixin/index';

export default function (UIkit) {

    UIkit.component('navbar', {

        mixins: [Class],

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
            }).on('mouseenter', ({target}) => {
                var active = UIkit.drop.getActive();
                if (active && active.mode !== 'click' && isWithin(active.toggle.$el, this.$el) && !isWithin(target, active.toggle.$el) && !active.isDelaying) {
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

            this.dropbar.on({
                mouseleave: () => {
                    var active = UIkit.drop.getActive();
                    if (active && isWithin(active.toggle.$el, this.$el) && !this.dropbar.is(':hover')) {
                        active.hide();
                    }
                },
                beforeshow: (e, {$el}) => {
                    $el.addClass(`${this.clsDrop}-dropbar`);
                    this.transitionTo($el.outerHeight(true));
                },
                beforehide: () => {
                    if (this.dropbar.is(':hover')) {
                        return false;
                    }
                },
                hide: () => {
                    this.transitionTo(0);
                }
            });

        },

        events: {

            beforeshow(e, {$el}) {
                if (this.dropbar && !isWithin($el, this.dropbar)) {
                    $el.appendTo(this.dropbar);
                    this.dropbar.trigger('beforeshow', [{$el}]);
                }
            }

        },

        methods: {

            transitionTo(height) {
                var current = this.dropbar[0].offsetHeight ? this.dropbar.height() : 0;
                Transition.stop(this.dropbar);
                this.dropbar.height(current);
                return Transition.start(this.dropbar, {height}, this.duration);
            }

        }

    });

}
