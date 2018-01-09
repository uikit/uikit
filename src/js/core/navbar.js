import { Class } from '../mixin/index';
import { $, $$, addClass, after, assign, css, height, includes, isRtl, isString, isVisible, matches, noop, query, remove, toFloat, Transition, within } from '../util/index';

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
            dropbarAnchor: 'query',
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

            boundary({boundary, boundaryAlign}, $el) {
                return (boundary === true || boundaryAlign) ? $el : boundary;
            },

            pos({align}) {
                return `bottom-${align}`;
            }

        },

        connected() {

            var dropbar = this.$props.dropbar;

            this.dropbar = dropbar && (isString(dropbar) && query(dropbar, this.$el) || $('<div></div>'));

            if (this.dropbar) {

                addClass(this.dropbar, 'uk-navbar-dropbar');

                if (this.dropbarMode === 'slide') {
                    addClass(this.dropbar, 'uk-navbar-dropbar-slide');
                }
            }

        },

        disconnected() {
            this.dropbar && remove(this.dropbar);
        },

        update() {

            UIkit.drop(
                $$(`${this.dropdown} .${this.clsDrop}`, this.$el).filter(el => !UIkit.getComponent(el, 'drop') && !UIkit.getComponent(el, 'dropdown')),
                assign({}, this.$props, {boundary: this.boundary, pos: this.pos})
            );

        },

        events: [

            {
                name: 'mouseover',

                delegate() {
                    return this.dropdown;
                },

                handler({current}) {
                    var active = this.getActive();
                    if (active && active.toggle && !within(active.toggle.$el, current) && !active.tracker.movesTo(active.$el)) {
                        active.hide(false);
                    }
                }

            },

            {
                name: 'mouseleave',

                el() {
                    return this.dropbar;
                },

                handler() {
                    var active = this.getActive();

                    if (active && !matches(this.dropbar, ':hover')) {
                        active.hide();
                    }
                }
            },

            {
                name: 'show',

                filter() {
                    return this.dropbar;
                },

                handler(_, drop) {

                    var $el = drop.$el;

                    this.clsDrop && addClass($el, `${this.clsDrop}-dropbar`);

                    if (drop.$props.offset === false) {
                        drop.offset = toFloat(css($el, 'margin-top'));
                    }

                    this.transitionTo($el.offsetHeight + toFloat(css($el, 'margin-top')) + toFloat(css($el, 'margin-bottom')), $el);
                }
            },

            {
                name: 'beforehide',

                filter() {
                    return this.dropbar;
                },

                handler(e, {$el}) {

                    var active = this.getActive();

                    if (matches(this.dropbar, ':hover') && active && active.$el === $el) {
                        e.preventDefault();
                    }
                }
            },

            {
                name: 'hide',

                filter() {
                    return this.dropbar;
                },

                handler(_, {$el}) {

                    var active = this.getActive();

                    if (!active || active && active.$el === $el) {
                        this.transitionTo(0);
                    }
                }
            }

        ],

        methods: {

            getActive() {
                var active = UIkit.drop.getActive();
                return active && includes(active.mode, 'hover') && within(active.toggle.$el, this.$el) && active;
            },

            transitionTo(newHeight, el) {

                var dropbar = this.dropbar;

                if (!dropbar.parentNode) {
                    after(this.dropbarAnchor || this.$el, dropbar);
                }

                var oldHeight = isVisible(dropbar) ? height(dropbar) : 0;

                el = oldHeight < newHeight && el;

                css(el, {height: oldHeight, overflow: 'hidden'});
                height(dropbar, oldHeight);

                Transition.cancel([el, dropbar]);
                return Transition
                    .start([el, dropbar], {height: newHeight}, this.duration)
                    .catch(noop)
                    .finally(() => css(el, {height: '', overflow: ''}));
            }

        }

    });

}
