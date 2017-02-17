import { Class } from '../mixin/index';
import { $, extend, isRtl, isWithin, pointerEnter, query, toJQuery, Transition } from '../util/index';

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
            align: !isRtl ? 'left' : 'right',
            clsDrop: 'uk-navbar-dropdown',
            mode: undefined,
            offset: undefined,
            delayShow: undefined,
            delayHide: undefined,
            boundaryAlign: undefined,
            flip: 'x',
            boundary: true,
            dropbar: false,
            dropbarMode: 'slide',
            dropbarAnchor: false,
            duration: 200,
        },

        init() {
            this.boundary = (this.boundary === true || this.boundaryAlign) ? this.$el : this.boundary;
            this.pos = `bottom-${this.align}`;
        },

        ready() {

            this.$el.on(pointerEnter, this.dropdown, ({target}) => {
                var active = this.getActive();
                if (active && !isWithin(target, active.toggle.$el) && !active.isDelaying) {
                    active.hide(false);
                }
            });

            if (this.dropbar) {
                this.dropbar = query(this.dropbar, this.$el) || $('<div></div>').insertAfter(this.dropbarAnchor || this.$el);
                UIkit.navbarDropbar(this.dropbar, {clsDrop: this.clsDrop, mode: this.dropbarMode, duration: this.duration, navbar: this});
            }

        },

        update() {

            $(this.dropdown, this.$el).each((i, el) => {

                var drop = toJQuery(`.${this.clsDrop}`, el);

                if (drop && !UIkit.getComponent(drop, 'drop') && !UIkit.getComponent(drop, 'dropdown')) {
                    UIkit.drop(drop, extend({}, this));
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
            }

        }

    });

    UIkit.component('navbar-dropbar', {

        mixins: [Class],

        defaults: {
            clsDrop: '',
            mode: 'slide',
            navbar: null,
            duration: 200
        },

        init() {

            if (this.mode === 'slide') {
                this.$el.addClass('uk-navbar-dropbar-slide');
            }

        },

        events: {

            mouseleave() {

                var active = this.navbar.getActive();

                if (active && !this.$el.is(':hover')) {
                    active.hide();
                }
            },

            beforeshow(e, {$el}) {
                this.clsDrop && $el.addClass(`${this.clsDrop}-dropbar`);
                this.transitionTo($el.outerHeight(true));
            },

            beforehide(e, {$el}) {

                var active = this.navbar.getActive();

                if (this.$el.is(':hover') && active && active.$el.is($el)) {
                    return false;
                }
            },

            hide(e, {$el}) {

                var active = this.navbar.getActive();

                if (!active || active && active.$el.is($el)) {
                    this.transitionTo(0);
                }
            }

        },

        methods: {

            transitionTo(height) {
                this.$el.height(this.$el[0].offsetHeight ? this.$el.height() : 0);
                return Transition.cancel(this.$el).then(() => Transition.start(this.$el, {height}, this.duration));
            }

        }

    });

}
