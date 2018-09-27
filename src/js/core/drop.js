import Position from '../mixin/position';
import Togglable from '../mixin/togglable';
import {$$, addClass, Animation, attr, css, includes, isTouch, MouseTracker, offset, on, once, pointerEnter, pointerLeave, pointInRect, query, removeClass, removeClasses, toggleClass, within} from 'uikit-util';

let active;

export default {

    mixins: [Position, Togglable],

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
        boundary: window,
        boundaryAlign: false,
        delayShow: 0,
        delayHide: 800,
        clsDrop: false,
        hoverIdle: 200,
        animation: ['uk-animation-fade'],
        cls: 'uk-open'
    },

    computed: {

        boundary({boundary}, $el) {
            return query(boundary, $el);
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

        const {toggle} = this.$props;
        this.toggle = toggle && this.$create('toggle', query(toggle, this.$el), {
            target: this.$el,
            mode: this.mode
        });

        this.updateAria(this.$el);

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

            handler(e) {

                if (e.defaultPrevented) {
                    return;
                }

                const id = e.target.hash;

                if (!id) {
                    e.preventDefault();
                }

                if (!id || !within(id, this.$el)) {
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
                    this.show(toggle, false);
                }
            }

        },

        {

            name: pointerEnter,

            filter() {
                return includes(this.mode, 'hover');
            },

            handler(e) {

                if (isTouch(e)) {
                    return;
                }

                if (active
                    && active !== this
                    && active.toggle
                    && includes(active.toggle.mode, 'hover')
                    && !within(e.target, active.toggle.$el)
                    && !pointInRect({x: e.pageX, y: e.pageY}, offset(active.$el))
                ) {
                    active.hide(false);
                }

                e.preventDefault();
                this.show(this.toggle);
            }

        },

        {

            name: 'toggleshow',

            handler(e, toggle) {

                if (toggle && !includes(toggle.target, this.$el)) {
                    return;
                }

                e.preventDefault();
                this.show(toggle || this.toggle);
            }

        },

        {

            name: `togglehide ${pointerLeave}`,

            handler(e, toggle) {

                if (isTouch(e) || toggle && !includes(toggle.target, this.$el)) {
                    return;
                }

                e.preventDefault();

                if (this.toggle && includes(this.toggle.mode, 'hover')) {
                    this.hide();
                }
            }

        },

        {

            name: 'beforeshow',

            self: true,

            handler() {
                this.clearTimers();
                Animation.cancel(this.$el);
                this.position();
            }

        },

        {

            name: 'show',

            self: true,

            handler() {
                this.tracker.init();
                if (this.toggle) {
                    addClass(this.toggle.$el, this.cls);
                    attr(this.toggle.$el, 'aria-expanded', 'true');
                }
                registerEvent();
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

                if (this.toggle) {
                    removeClass(this.toggle.$el, this.cls);
                    attr(this.toggle.$el, 'aria-expanded', 'false');
                    this.toggle.$el.blur();
                    $$('a, button', this.toggle.$el).forEach(el => el.blur());
                }

                this.tracker.cancel();
            }

        }

    ],

    update: {

        write() {

            if (this.isToggled() && !Animation.inProgress(this.$el)) {
                this.position();
            }

        },

        events: ['resize']

    },

    methods: {

        show(toggle, delay = true) {

            const show = () => !this.isToggled() && this.toggleElement(this.$el, true);
            const tryShow = () => {

                this.toggle = toggle || this.toggle;

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (delay && active && active !== this && active.isDelaying) {
                    this.showTimer = setTimeout(this.show, 10);
                    return;
                } else if (this.isParentOf(active)) {

                    if (active.hideTimer) {
                        active.hide(false);
                    } else {
                        return;
                    }

                } else if (active && !this.isChildOf(active) && !this.isParentOf(active)) {

                    let prev;
                    while (active && active !== prev && !this.isChildOf(active)) {
                        prev = active;
                        active.hide(false);
                    }

                }

                if (delay && this.delayShow) {
                    this.showTimer = setTimeout(show, this.delayShow);
                } else {
                    show();
                }

                active = this;
            };

            if (toggle && this.toggle && toggle.$el !== this.toggle.$el) {

                once(this.$el, 'hide', tryShow);
                this.hide(false);

            } else {
                tryShow();
            }
        },

        hide(delay = true) {

            const hide = () => this.toggleNow(this.$el, false);

            this.clearTimers();

            this.isDelaying = this.tracker.movesTo(this.$el);

            if (delay && this.isDelaying) {
                this.hideTimer = setTimeout(this.hide, this.hoverIdle);
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

        isChildOf(drop) {
            return drop && drop !== this && within(this.$el, drop.$el);
        },

        isParentOf(drop) {
            return drop && drop !== this && within(drop.$el, this.$el);
        },

        position() {

            removeClasses(this.$el, `${this.clsDrop}-(stack|boundary)`);
            css(this.$el, {top: '', left: '', display: 'block'});
            toggleClass(this.$el, `${this.clsDrop}-boundary`, this.boundaryAlign);

            const boundary = offset(this.boundary);
            const alignTo = this.boundaryAlign ? boundary : offset(this.toggle.$el);

            if (this.align === 'justify') {
                const prop = this.getAxis() === 'y' ? 'width' : 'height';
                css(this.$el, prop, alignTo[prop]);
            } else if (this.$el.offsetWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                addClass(this.$el, `${this.clsDrop}-stack`);
            }

            this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

            css(this.$el, 'display', '');

        }

    }

};

let registered;

function registerEvent() {

    if (registered) {
        return;
    }

    registered = true;
    on(document, 'click', ({target, defaultPrevented}) => {
        let prev;

        if (defaultPrevented) {
            return;
        }

        while (active && active !== prev && !within(target, active.$el) && !(active.toggle && within(target, active.toggle.$el))) {
            prev = active;
            active.hide(false);
        }
    });
}
