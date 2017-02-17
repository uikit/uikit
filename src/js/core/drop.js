import { Mouse, Position, Toggable } from '../mixin/index';
import { doc, getDimensions, isWithin, isTouch, pointerEnter, pointerLeave, query, removeClass } from '../util/index';

export default function (UIkit) {

    var active;

    doc.on('click', e => {
        var prev;
        while (active && active !== prev && !isWithin(e.target, active.$el) && (!active.toggle || !isWithin(e.target, active.toggle.$el))) {
            prev = active;
            active.hide(false);
        }
    });

    UIkit.component('drop', {

        mixins: [Mouse, Position, Toggable],

        args: 'pos',

        props: {
            mode: String,
            toggle: Boolean,
            boundary: 'jQuery',
            boundaryAlign: Boolean,
            delayShow: Number,
            delayHide: Number,
            clsDrop: String
        },

        defaults: {
            mode: 'hover',
            toggle: '- :first',
            boundary: window,
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: 'uk-animation-fade',
            cls: 'uk-open'
        },

        init() {
            this.clsDrop = this.clsDrop || `uk-${this.$options.name}`;
            this.clsPos = this.clsDrop;

            this.$el.addClass(this.clsDrop);
        },

        ready() {

            this.updateAria(this.$el);

            if (this.toggle) {
                this.toggle = UIkit.toggle(query(this.toggle, this.$el), {target: this.$el, mode: this.mode})[0];
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

                name: 'toggle',

                handler(e, toggle) {

                    if (toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.isToggled(this.$el)) {
                        this.hide(false);
                    } else {
                        this.show(toggle, false);
                    }
                }

            },

            {

                name: pointerEnter,

                filter() {
                    return this.mode === 'hover';
                },

                handler(e) {

                    if (isTouch(e)) {
                        return;
                    }

                    if (active
                        && active !== this
                        && active.toggle
                        && active.toggle.mode === 'hover'
                        && !isWithin(e.target, active.$el)
                        && !isWithin(e.target, active.toggle.$el)
                    ) {
                        active.hide(false);
                    }

                    e.preventDefault();
                    this.show(this.toggle);
                }

            },

            {

                name: 'toggleShow',

                handler(e, toggle) {

                    if (toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();
                    this.show(toggle || this.toggle);
                }

            },

            {

                name: `toggleHide ${pointerLeave}`,

                handler(e, toggle) {

                    if (isTouch(e) || toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.toggle && this.toggle.mode === 'hover') {
                        this.hide();
                    }
                }

            },

            {

                name: 'show',

                handler({target}) {

                    if (!this.$el.is(target)) {
                        return;
                    }

                    this.initMouseTracker();
                    this.toggle.$el.addClass(this.cls).attr('aria-expanded', 'true');
                    this.clearTimers();
                }

            },

            {

                name: 'hide',

                handler({target}) {

                    if (!this.$el.is(target)) {
                        active = active === null && isWithin(target, this.$el) && this.isToggled(this.$el) ? this : active;
                        return;
                    }

                    active = this.isActive() ? null : active;
                    this.toggle.$el.removeClass(this.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
                    this.cancelMouseTracker();
                    this.clearTimers();
                }

            }

        ],

        update: {

            write() {

                if (!this.$el.hasClass(this.cls)) {
                    return;
                }

                removeClass(this.$el, `${this.clsDrop}-(stack|boundary)`).css({top: '', left: ''});

                this.$el.toggleClass(`${this.clsDrop}-boundary`, this.boundaryAlign);

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var boundary = getDimensions(this.boundary), alignTo = this.boundaryAlign ? boundary : getDimensions(this.toggle.$el);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    this.$el.css(prop, alignTo[prop]);
                } else if (this.$el.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.$el.addClass(`${this.clsDrop}-stack`);
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            show(toggle, delay = true) {

                var show = () => !this.isToggled(this.$el) && this.toggleElement(this.$el, true),
                    tryShow = () => {

                    this.toggle = toggle || this.toggle;

                    this.clearTimers();

                    if (this.isActive()) {
                        return;
                    } else if (delay && active && active !== this && active.isDelaying) {
                        this.showTimer = setTimeout(this.show, 75);
                        return;
                    } else if (this.isParentOf(active)) {

                        if (active.hideTimer) {
                            active.hide(false);
                        } else {
                            return;
                        }

                    } else if (active && !this.isChildOf(active) && !this.isParentOf(active)) {
                        var prev;
                        while (active && active !== prev) {
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

                if (toggle && this.toggle && !this.toggle.$el.is(toggle.$el)) {

                    this.$el.one('hide', tryShow);
                    this.hide(false);

                } else {
                    tryShow();
                }
            },

            hide(delay = true) {

                var hide = () => this.toggleNow(this.$el, false);

                this.clearTimers();

                this.isDelaying = this.movesTo(this.$el);

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
                return drop && drop !== this && isWithin(this.$el, drop.$el);
            },

            isParentOf(drop) {
                return drop && drop !== this && isWithin(drop.$el, this.$el);
            }

        }

    });

    UIkit.drop.getActive = () => active;
}
