import { $, extend, isWithin, query, toJQuery, Transition } from '../util/index';
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
            dropbarMode: String,
            dropbarAnchor: 'jQuery',
            duration: Number
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
            dropbarMode: 'slide',
            dropbarAnchor: false,
            duration: 200,
        },

        ready() {

            var drop;

            this.boundary = (this.boundary === true || this.boundaryAlign) ? this.$el : this.boundary;
            this.pos = `bottom-${this.align}`;

            $(this.dropdown, this.$el).each((i, el) => {

                drop = toJQuery(`.${this.clsDrop}`, el);

                if (drop && !UIkit.getComponent(drop, 'drop') && !UIkit.getComponent(drop, 'dropdown')) {
                    UIkit.drop(drop, extend({}, this));
                }
            }).on('mouseenter', ({target}) => {
                var active = this.getActive();
                if (active && !isWithin(target, active.toggle.$el) && !active.isDelaying) {
                    active.hide(false);
                }
            });

            if (!this.dropbar) {
                return;
            }

            this.dropbar = query(this.dropbar, this.$el) || $('<div class="uk-navbar-dropbar"></div>').insertAfter(this.dropbarAnchor || this.$el);

            if (this.dropbarMode === 'slide') {
                this.dropbar.addClass('uk-navbar-dropbar-slide');
            }

            this.dropbar.on({

                mouseleave: () => {

                    var active = this.getActive();

                    if (active && !this.dropbar.is(':hover')) {
                        active.hide();
                    }
                },

                beforeshow: (e, {$el}) => {
                    $el.addClass(`${this.clsDrop}-dropbar`);
                    this.transitionTo($el.outerHeight(true));
                },

                beforehide: (e, {$el}) => {

                    var active = this.getActive();

                    if (this.dropbar.is(':hover') && active && active.$el.is($el)) {
                        return false;
                    }
                },

                hide: (e, {$el}) => {

                    var active = this.getActive();

                    if (!active || active && active.$el.is($el)) {
                        this.transitionTo(0);
                    }
                }

            });

        },

        events: {

            beforeshow(e, {$el, dir}) {
                if (this.dropbar && dir === 'bottom' && !isWithin($el, this.dropbar)) {
                    $el.appendTo(this.dropbar);
                    this.dropbar.trigger('beforeshow', [{$el}]);
                }
            }

        },

        methods: {

            getActive() {
                var active = UIkit.drop.getActive();
                return active && active.mode !== 'click' && isWithin(active.toggle.$el, this.$el) && active;
            },

            transitionTo(height) {
                this.dropbar.height(this.dropbar[0].offsetHeight ? this.dropbar.height() : 0);
                return Transition.cancel(this.dropbar).start(this.dropbar, {height}, this.duration);
            }

        }

    });

}
