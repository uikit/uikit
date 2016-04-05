import $ from 'jquery';
import {hasTouch, isString, isWithin, removeClass, getDimensions, toJQuery} from '../util/index';

export default function (UIkit) {

    var active;

    $(document).on(hasTouch ? 'tap' : 'click', e => {
        if (active && !isWithin(e.target, active.$el) && !e.isDefaultPrevented()) {
            active.hide(false);
        }
    });

    UIkit.component('drop', {

        mixins: [UIkit.mixin.position, UIkit.mixin.toggable, UIkit.mixin.mouse],

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
            toggle: true,
            boundary: window,
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: 'uk-animation-fade',
            cls: 'uk-open'
        },

        ready() {

            this.mode = hasTouch ? 'click' : this.mode;
            this.clsDrop = this.clsDrop || 'uk-' + this.$options.name;
            this.clsPos = this.clsDrop;

            this.updateAria(this.$el);

            this.$el.on('click', `.${this.clsDrop}-close`, e => {
                e.preventDefault();
                this.hide(false)
            });

            if (this.mode === 'hover') {
                this.$el.on('toggleenter mouseenter', (e, toggle) => {
                    e.preventDefault();
                    this.show(toggle);
                }).on('toggleleave mouseleave', e => {
                    e.preventDefault();
                    this.hide();
                });
            }

            if (this.toggle) {
                this.toggle = isString(this.toggle) ? toJQuery(this.toggle) : this.$el.prev();

                if (this.toggle) {
                    UIkit.toggle(this.toggle, {target: this.$el});
                }
            }

        },

        update: {

            handler() {

                removeClass(this.$el, this.clsDrop + '-(stack|boundary)').css({top: '', left: '', width: '', height: ''});

                this.$el.toggleClass(`${this.clsDrop}-boundary`, this.boundaryAlign);

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var boundary = getDimensions(this.boundary), alignTo = this.boundaryAlign ? boundary : getDimensions(this.toggle);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    this.$el.css(prop, alignTo[prop]);
                } else if (this.$el.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.$el.addClass(this.clsDrop + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle, this.boundary);

            },

            events: ['resize', 'orientationchange']

        },

        events: {

            beforeshow() {
                this.initMouseTracker();
                this.toggle.addClass(this.cls).attr('aria-expanded', 'true');
            },

            beforehide() {
                this.cancelMouseTracker();
                this.toggle.removeClass(this.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
            },

            toggle(e, toggle) {
                e.preventDefault();

                if (this.isToggled(this.$el)) {
                    this.hide(false);
                } else {
                    this.show(toggle, false);
                }
            }

        },

        methods: {

            show(toggle, delay = true) {

                if (toggle && this.toggle && !this.toggle.is(toggle)) {
                    this.hide(false);
                }

                this.toggle = toggle || this.toggle;

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (delay && active && active !== this && active.isDelaying) {
                    this.showTimer = setTimeout(this.show.bind(this), 75);
                    return;
                } else if (active) {
                    active.hide(false);
                }

                var show = () => this.toggleElement(this.$el, true);

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
                    active = this.isActive() ? null : active;
                    this.toggleNow(this.$el, false);
                };

                this.isDelaying = this.movesTo(this.$el);

                if (delay && this.isDelaying) {
                    this.hideTimer = setTimeout(this.hide.bind(this), this.hoverIdle);
                } else if (delay && this.delayHide) {
                    this.hideTimer = setTimeout(hide, this.delayHide);
                } else {
                    hide();
                }
            },

            clearTimers() {
                clearTimeout(this.showTimer);
                clearTimeout(this.hideTimer);
            },

            isActive() {
                return active === this;
            }

        }

    });

    UIkit.drop.getActive = () => active;
}
