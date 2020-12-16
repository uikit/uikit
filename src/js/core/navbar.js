import Class from '../mixin/class';
import FlexBug from '../mixin/flex-bug';
import {$, $$, addClass, after, assign, css, hasClass, height, includes, isRtl, isVisible, matches, noop, parent, Promise, query, remove, toFloat, Transition, within} from 'uikit-util';

export default {

    mixins: [Class, FlexBug],

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
        dropbarAnchor: Boolean,
        duration: Number
    },

    data: {
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
        forceHeight: true,
        selMinHeight: '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle'
    },

    computed: {

        boundary({boundary, boundaryAlign}, $el) {
            return (boundary === true || boundaryAlign) ? $el : boundary;
        },

        dropbarAnchor({dropbarAnchor}, $el) {
            return query(dropbarAnchor, $el);
        },

        pos({align}) {
            return `bottom-${align}`;
        },

        dropbar: {

            get({dropbar}) {

                if (!dropbar) {
                    return null;
                }

                dropbar = this._dropbar || query(dropbar, this.$el) || $('+ .uk-navbar-dropbar', this.$el);

                return dropbar ? dropbar : (this._dropbar = $('<div></div>'));

            },

            watch(dropbar) {
                addClass(dropbar, 'uk-navbar-dropbar');
            },

            immediate: true

        },

        dropdowns: {

            get({dropdown, clsDrop}, $el) {
                return $$(`${dropdown} .${clsDrop}`, $el);
            },

            watch(dropdowns) {
                this.$create(
                    'drop',
                    dropdowns.filter(el => !this.getDropdown(el)),
                    assign({}, this.$props, {boundary: this.boundary, pos: this.pos, offset: this.dropbar || this.offset})
                );
            },

            immediate: true

        }

    },

    disconnected() {
        this.dropbar && remove(this.dropbar);
        delete this._dropbar;
    },

    events: [

        {
            name: 'mouseover',

            delegate() {
                return this.dropdown;
            },

            handler({current}) {
                const active = this.getActive();
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
                const active = this.getActive();

                if (active && !this.dropdowns.some(el => matches(el, ':hover'))) {
                    active.hide();
                }
            }
        },

        {
            name: 'beforeshow',

            capture: true,

            filter() {
                return this.dropbar;
            },

            handler() {

                if (!parent(this.dropbar)) {
                    after(this.dropbarAnchor || this.$el, this.dropbar);
                }

            }
        },

        {
            name: 'show',

            filter() {
                return this.dropbar;
            },

            handler(_, {$el, dir}) {
                if (!hasClass($el, this.clsDrop)) {
                    return;
                }

                if (this.dropbarMode === 'slide') {
                    addClass(this.dropbar, 'uk-navbar-dropbar-slide');
                }

                this.clsDrop && addClass($el, `${this.clsDrop}-dropbar`);

                if (dir === 'bottom') {
                    this.transitionTo($el.offsetHeight + toFloat(css($el, 'marginTop')) + toFloat(css($el, 'marginBottom')), $el);
                }
            }
        },

        {
            name: 'beforehide',

            filter() {
                return this.dropbar;
            },

            handler(e, {$el}) {

                const active = this.getActive();

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
                if (!hasClass($el, this.clsDrop)) {
                    return;
                }

                const active = this.getActive();

                if (!active || active && active.$el === $el) {
                    this.transitionTo(0);
                }
            }
        }

    ],

    methods: {

        getActive() {
            const [active] = this.dropdowns.map(this.getDropdown).filter(drop => drop && drop.isActive());
            return active && includes(active.mode, 'hover') && within(active.toggle.$el, this.$el) && active;
        },

        transitionTo(newHeight, el) {

            const {dropbar} = this;
            const oldHeight = isVisible(dropbar) ? height(dropbar) : 0;

            el = oldHeight < newHeight && el;

            css(el, 'clip', `rect(0,${el.offsetWidth}px,${oldHeight}px,0)`);

            height(dropbar, oldHeight);

            Transition.cancel([el, dropbar]);
            return Promise.all([
                Transition.start(dropbar, {height: newHeight}, this.duration),
                Transition.start(el, {clip: `rect(0,${el.offsetWidth}px,${newHeight}px,0)`}, this.duration)
            ])
                .catch(noop)
                .then(() => {
                    css(el, {clip: ''});
                    this.$update(dropbar);
                });
        },

        getDropdown(el) {
            return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        }

    }

};
