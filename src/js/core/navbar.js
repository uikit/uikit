import Class from '../mixin/class';
import FlexBug from '../mixin/flex-bug';
import {$, $$, addClass, after, assign, css, height, includes, isRtl, isVisible, matches, noop, Promise, query, remove, toFloat, Transition, within} from 'uikit-util';

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

        dropdowns({dropdown, clsDrop}, $el) {
            return $$(`${dropdown} .${clsDrop}`, $el);
        }

    },

    beforeConnect() {

        const {dropbar} = this.$props;

        this.dropbar = dropbar && (query(dropbar, this.$el) || $('+ .uk-navbar-dropbar', this.$el) || $('<div></div>'));

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
