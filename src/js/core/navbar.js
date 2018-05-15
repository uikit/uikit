import Class from '../mixin/class';
import {$, $$, addClass, after, assign, css, height, includes, isRtl, isString, isVisible, matches, noop, query, remove, toFloat, Transition, within} from 'uikit-util';

export default {

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

        dropdowns({dropdown, clsDrop}, $el) {
            return $$(`${dropdown} .${clsDrop}`, $el);
        }

    },

    beforeConnect() {

        const {dropbar} = this.$props;

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

        this.$create(
            'drop',
            this.dropdowns.filter(el => !this.getDropdown(el)),
            assign({}, this.$props, {boundary: this.boundary, pos: this.pos, offset: this.dropbar || this.offset})
        );

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

                if (active && !matches(this.dropbar, ':hover')) {
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

                if (!this.dropbar.parentNode) {
                    after(this.dropbarAnchor || this.$el, this.dropbar);
                }

            }
        },

        {
            name: 'show',

            capture: true,

            filter() {
                return this.dropbar;
            },

            handler(_, drop) {

                const {$el, dir} = drop;

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

                const active = this.getActive();

                if (!active || active && active.$el === $el) {
                    this.transitionTo(0);
                }
            }
        }

    ],

    methods: {

        getActive() {
            const [active] = this.dropdowns.map(this.getDropdown).filter(drop => drop.isActive());
            return active && includes(active.mode, 'hover') && within(active.toggle.$el, this.$el) && active;
        },

        transitionTo(newHeight, el) {

            const {dropbar} = this;
            const oldHeight = isVisible(dropbar) ? height(dropbar) : 0;

            el = oldHeight < newHeight && el;

            css(el, {height: oldHeight, overflow: 'hidden'});
            height(dropbar, oldHeight);

            Transition.cancel([el, dropbar]);
            return Transition
                .start([el, dropbar], {height: newHeight}, this.duration)
                .catch(noop)
                .then(() => css(el, {height: '', overflow: ''}));
        },

        getDropdown(el) {
            return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        }

    }

};
