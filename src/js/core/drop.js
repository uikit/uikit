import { doc, isWithin, removeClass, getDimensions, query } from '../util/index';
import { Mouse, Position, Toggable } from '../mixin/index';

export default function (UIkit) {

    var active;

    doc.on('click', e => {
        if (active && !isWithin(e.target, active.$el) && (!active.toggle || !isWithin(e.target, active.toggle.$el))) {
            active.hide(false);
        }
    });

    UIkit.component('drop', {

        mixins: [Mouse, Position, Toggable],

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

            this.$el.on('click', `.${this.clsDrop}-close`, e => {
                e.preventDefault();
                this.hide(false);
            });

            if (this.toggle) {

                this.toggle = query(this.toggle, this.$el);

                if (this.toggle) {
                    this.toggle = UIkit.toggle(this.toggle, {target: this.$el, mode: this.mode})[0];
                }
            }

        },

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
                    this.$el.addClass(this.clsDrop + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            toggle(e, toggle) {
                e.preventDefault();

                if (this.isToggled(this.$el)) {
                    this.hide(false);
                } else {
                    this.show(toggle, false);
                }
            },

            'toggleShow mouseenter'(e, toggle) {
                e.preventDefault();
                this.show(toggle || this.toggle);
            },

            'toggleHide mouseleave'(e) {
                e.preventDefault();

                if (this.toggle && this.toggle.mode === 'hover') {
                    this.hide();
                }
            }

        },

        methods: {

            show(toggle, delay = true) {

                if (toggle && this.toggle && !this.toggle.$el.is(toggle.$el)) {
                    this.hide(false);
                }

                this.toggle = toggle || this.toggle;

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (delay && active && active !== this && active.isDelaying) {
                    this.showTimer = setTimeout(this.show, 75);
                    return;
                } else if (active) {
                    active.hide(false);
                }

                var show = () => {
                    if (this.toggleElement(this.$el, true).state() !== 'rejected') {
                        this.initMouseTracker();
                        this.toggle.$el.addClass(this.cls).attr('aria-expanded', 'true');
                        this.clearTimers();
                    }
                };

                if (delay && this.delayShow) {
                    this.showTimer = setTimeout(show, this.delayShow);
                } else {
                    show();
                }

                active = this;
            },

            hide(delay = true) {

                this.clearTimers();

                var hide = () => {
                    if (this.toggleElement(this.$el, false, false).state() !== 'rejected') {
                        active = this.isActive() ? null : active;
                        this.toggle.$el.removeClass(this.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
                        this.cancelMouseTracker();
                        this.clearTimers();
                    }
                };

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
            },

            isActive() {
                return active === this;
            }

        }

    });

    UIkit.drop.getActive = () => active;
}
