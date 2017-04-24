import { Class } from '../mixin/index';
import { $, extend, isRtl, isWithin, pointerEnter, query, Transition } from '../util/index';

export default function (UIkit) {

    UIkit.component('navbar', {

        mixins: [Class],

        props: {
            dropdown: String,
            mode: 'list',
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

        computed: {

            boundary() {
                return (this.$props.boundary === true || this.boundaryAlign) ? this.$el : this.$props.boundary
            },

            pos() {
                return `bottom-${this.align}`;
            }

        },

        ready() {

            if (this.dropbar) {
                UIkit.navbarDropbar(
                    query(this.dropbar, this.$el) || $('<div></div>').insertAfter(this.dropbarAnchor || this.$el),
                    {clsDrop: this.clsDrop, mode: this.dropbarMode, duration: this.duration, navbar: this}
                );
            }

        },

        update() {

            UIkit.drop($(`${this.dropdown} .${this.clsDrop}`, this.$el), extend({}, this))

        },

        events: [

            {
                name: pointerEnter,

                delegate() {
                    return this.dropdown;
                },

                handler({currentTarget}) {
                    var active = this.getActive();
                    if (active && active.toggle && !isWithin(active.toggle.$el, currentTarget) && !active.tracker.movesTo(active.$el)) {
                        active.hide(false);
                    }
                }

            }

        ],

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

        events: [

            {
                name: 'beforeshow',

                el() {
                    return this.navbar.$el;
                },

                handler(_, drop) {
                    var {$el, dir} = drop;
                    if (dir === 'bottom' && !isWithin($el, this.$el)) {
                        $el.appendTo(this.$el);
                        drop.show();
                        return false;
                    }
                }
            },

            {
                name: 'mouseleave',

                handler() {
                    var active = this.navbar.getActive();

                    if (active && !this.$el.is(':hover')) {
                        active.hide();
                    }
                }
            },

            {
                name: 'beforeshow',

                handler(e, {$el}) {
                    this.clsDrop && $el.addClass(`${this.clsDrop}-dropbar`);
                    this.transitionTo($el.outerHeight(true));
                }
            },

            {
                name: 'beforehide',

                handler(e, {$el}) {

                    var active = this.navbar.getActive();

                    if (this.$el.is(':hover') && active && active.$el.is($el)) {
                        return false;
                    }
                }
            },

            {
                name: 'hide',

                handler(e, {$el}) {

                    var active = this.navbar.getActive();

                    if (!active || active && active.$el.is($el)) {
                        this.transitionTo(0);
                    }
                }
            }

        ],

        methods: {

            transitionTo(height) {
                this.$el.height(this.$el[0].offsetHeight ? this.$el.height() : 0);
                return Transition.cancel(this.$el).then(() => Transition.start(this.$el, {height}, this.duration));
            }

        }

    });

}
