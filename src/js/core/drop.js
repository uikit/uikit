import Container from '../mixin/container';
import Position from '../mixin/position';
import Togglable from '../mixin/togglable';
import {addClass, append, apply, attr, css, hasClass, includes, isTouch, matches, MouseTracker, offset, on, once, parent, pointerCancel, pointerDown, pointerEnter, pointerLeave, pointerUp, query, removeClass, toggleClass, within} from 'uikit-util';

export let active;

export default {

    mixins: [Container, Position, Togglable],

    args: 'pos',

    props: {
        mode: 'list',
        toggle: Boolean,
        boundary: Boolean,
        boundaryAlign: Boolean,
        delayShow: Number,
        delayHide: Number,
        clsDrop: String
    },

    data: {
        mode: ['click', 'hover'],
        toggle: '- *',
        boundary: true,
        boundaryAlign: false,
        delayShow: 0,
        delayHide: 800,
        clsDrop: false,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
        container: false
    },

    computed: {

        boundary({boundary}, $el) {
            return boundary === true ? window : query(boundary, $el);
        },

        clsDrop({clsDrop}) {
            return clsDrop || `uk-${this.$options.name}`;
        },

        clsPos() {
            return this.clsDrop;
        }

    },

    created() {
        this.tracker = new MouseTracker();
    },

    connected() {

        addClass(this.$el, this.clsDrop);

        if (this.toggle && !this.target) {
            this.target = this.$create('toggle', query(this.toggle, this.$el), {
                target: this.$el,
                mode: this.mode
            }).$el;
            attr(this.target, 'aria-haspopup', true);
        }

    },

    disconnected() {
        if (this.isActive()) {
            active = null;
        }
    },

    events: [

        {

            name: 'click',

            delegate() {
                return `.${this.clsDrop}-close`;
            },

            handler(e) {
                e.preventDefault();
                this.hide(false);
            }

        },

        {

            name: 'click',

            delegate() {
                return 'a[href^="#"]';
            },

            handler({defaultPrevented, current: {hash}}) {
                if (!defaultPrevented && hash && !within(hash, this.$el)) {
                    this.hide(false);
                }
            }

        },

        {

            name: 'beforescroll',

            handler() {
                this.hide(false);
            }

        },

        {

            name: 'toggle',

            self: true,

            handler(e, toggle) {

                e.preventDefault();

                if (this.isToggled()) {
                    this.hide(false);
                } else {
                    this.show(toggle.$el, false);
                }
            }

        },

        {

            name: 'toggleshow',

            self: true,

            handler(e, toggle) {
                e.preventDefault();
                this.show(toggle.$el);
            }

        },

        {

            name: 'togglehide',

            self: true,

            handler(e) {
                e.preventDefault();
                if (!matches(this.$el, ':focus,:hover')) {
                    this.hide();
                }
            }

        },

        {

            name: `${pointerEnter} focusin`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (!isTouch(e)) {
                    this.clearTimers();
                }
            }

        },

        {

            name: `${pointerLeave} focusout`,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {
                if (!isTouch(e) && e.relatedTarget) {
                    this.hide();
                }
            }

        },

        {

            name: 'toggled',

            self: true,

            handler(e, toggled) {

                if (!toggled) {
                    return;
                }

                this.clearTimers();
                this.position();
            }

        },

        {

            name: 'show',

            self: true,

            handler() {

                active = this;

                this.tracker.init();

                once(this.$el, 'hide', on(document, pointerDown, ({target}) =>
                    !within(target, this.$el) && once(document, `${pointerUp} ${pointerCancel} scroll`, ({defaultPrevented, type, target: newTarget}) => {
                        if (!defaultPrevented && type === pointerUp && target === newTarget && !(this.target && within(target, this.target))) {
                            this.hide(false);
                        }
                    }, true)
                ), {self: true});

                once(this.$el, 'hide', on(document, 'keydown', e => {
                    if (e.keyCode === 27) {
                        this.hide(false);
                    }
                }), {self: true});

            }

        },

        {

            name: 'beforehide',

            self: true,

            handler() {
                this.clearTimers();
            }

        },

        {

            name: 'hide',

            handler({target}) {

                if (this.$el !== target) {
                    active = active === null && within(target, this.$el) && this.isToggled() ? this : active;
                    return;
                }

                active = this.isActive() ? null : active;
                this.tracker.cancel();
            }

        }

    ],

    update: {

        write() {

            if (this.isToggled() && !hasClass(this.$el, this.clsEnter)) {
                this.position();
            }

        },

        events: ['resize']

    },

    methods: {

        show(target = this.target, delay = true) {

            if (this.isToggled() && target && this.target && target !== this.target) {
                this.hide(false);
            }

            this.target = target;

            this.clearTimers();

            if (this.isActive()) {
                return;
            }

            if (active) {

                if (delay && active.isDelaying) {
                    this.showTimer = setTimeout(this.show, 10);
                    return;
                }

                let prev;
                while (active && prev !== active && !within(this.$el, active.$el)) {
                    prev = active;
                    active.hide(false);
                }

            }

            if (this.container && parent(this.$el) !== this.container) {
                append(this.container, this.$el);
            }

            this.showTimer = setTimeout(() => this.toggleElement(this.$el, true), delay && this.delayShow || 0);

        },

        hide(delay = true) {

            const hide = () => this.toggleElement(this.$el, false, false);

            this.clearTimers();

            this.isDelaying = getPositionedElements(this.$el).some(el => this.tracker.movesTo(el));

            if (delay && this.isDelaying) {
                this.hideTimer = setTimeout(this.hide, 50);
            } else if (delay && this.delayHide) {
                this.hideTimer = setTimeout(hide, this.delayHide);
            } else {
                hide();
            }
        },

        clearTimers() {
            clearTimeout(this.showTimer);
            clearTimeout(this.hideTimer);
            this.showTimer = null;
            this.hideTimer = null;
            this.isDelaying = false;
        },

        isActive() {
            return active === this;
        },

        position() {

            removeClass(this.$el, `${this.clsDrop}-stack`);
            toggleClass(this.$el, `${this.clsDrop}-boundary`, this.boundaryAlign);

            const boundary = offset(this.boundary);
            const alignTo = this.boundaryAlign ? boundary : offset(this.target);

            if (this.align === 'justify') {
                const prop = this.getAxis() === 'y' ? 'width' : 'height';
                css(this.$el, prop, alignTo[prop]);
            } else if (this.boundary && this.$el.offsetWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                addClass(this.$el, `${this.clsDrop}-stack`);
            }

            this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.target, this.boundary);

        }

    }

};

function getPositionedElements(el) {
    const result = [];
    apply(el, el => css(el, 'position') !== 'static' && result.push(el));
    return result;
}
