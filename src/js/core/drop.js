import $ from 'jquery';
import {isWithin, hasTouch, removeClass, getDimensions, toJQuery} from '../util/index';

export default function (UIkit) {

    var active;

    $(document).on('click', e => {
        if (active && !isWithin(e.target, active.$el)) {
            active.hide(true);
        }
    });

    UIkit.component('drop', {

        mixins: [UIkit.mixin.position, UIkit.mixin.toggle, UIkit.mixin.mouse],

        props: {
            mode: String,
            target: 'jQuery',
            boundary: 'jQuery',
            boundaryAlign: Boolean,
            delayShow: Number,
            delayHide: Number,
            clsDrop: String
        },

        defaults: {
            mode: 'hover',
            target: false,
            boundary: $(window),
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: 'uk-animation-fade'
        },

        ready() {

            this.cls = 'uk-open';
            this.clsDrop = this.clsDrop || 'uk-' + this.$options.name;
            this.clsPos = this.clsDrop;
            this.drop = this.target || toJQuery(`.${this.clsDrop}:first`, this.$el) || toJQuery(this.$el.nextAll(`.${this.clsDrop}:first`));

            if (!this.drop) {
                return;
            }

            this.mode = hasTouch ? 'click' : this.mode;

            this.$el.on('click', e => {

                if (isWithin('a[href="#"]', e.target) && !isWithin(e.target, this.drop)) {
                    e.preventDefault();
                }

                if (this.isActive()) {
                    this.hide(true);
                } else {
                    this.show(true);
                }
            });

            this.$el.attr('aria-expanded', false);
            this.updateAria(this.drop);

            this.drop.on('click', `.${this.clsDrop}-close`, () => {
                this.hide(true);
            });

            if (this.mode === 'hover') {

                this.$el.on('mouseenter', () => {
                    this.show();
                }).on('mouseleave', () => {
                    this.hide();
                });

                this.drop.on('mouseenter', () => {
                    if (this.isActive()) {
                        this.show()
                    }
                }).on('mouseleave', () => {
                    if (this.isActive()) {
                        this.hide();
                    }
                });

            }

        },

        update: {

            handler() {

                removeClass(this.drop, this.clsDrop + '-(stack|boundary)').css({top: '', left: '', width: '', height: ''});

                this.drop.toggleClass(`${this.clsDrop}-boundary`, this.boundaryAlign);

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var boundary = getDimensions(this.boundary),
                    alignTo = this.boundaryAlign ? boundary : getDimensions(this.$el);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    this.drop.css(prop, alignTo[prop]);
                } else if (this.drop.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.drop.addClass(this.clsDrop + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.drop, this.boundaryAlign ? this.boundary : this.$el, this.boundary);

            },

            events: ['resize', 'orientationchange']

        },

        methods: {

            show(force) {

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (!force && active && active !== this && active.isDelaying) {
                    this.showTimer = setTimeout(this.show.bind(this), 75);
                    return;
                } else if (active) {
                    active.hide(true);
                }

                var show = () => {

                    this.$el.trigger('beforeshow', [this]);
                    this.toggleState(this.drop);
                    this._callUpdate();
                    this.$el.addClass(this.cls).attr('aria-expanded', 'true').trigger('show', [this]);

                    if (this.mode === 'hover') {
                        this.initMouseTracker(this.drop, this.dir);
                    }
                };

                if (!force && this.delayShow) {
                    this.showTimer = setTimeout(show, this.delayShow);
                } else {
                    show();
                }

                active = this;
            },

            hide(force) {

                this.clearTimers();

                var hide = () => {

                    if (!this.isActive()) {
                        return;
                    }

                    active = null;

                    this.cancelMouseTracker();

                    this.$el.trigger('beforehide', [this, force]).removeClass('uk-open').find('a, button').blur();
                    this.toggleState(this.drop, false);
                    this.$el.attr('aria-expanded', 'false').trigger('hide', [this, force]);

                };

                this.isDelaying = this.movesTowardsTarget();

                if (!force && this.isDelaying) {
                    this.hideTimer = setTimeout(this.hide.bind(this), this.hoverIdle);
                } else if (!force && this.delayHide) {
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

    UIkit.drop.getActive = function () {
        return active;
    };
}
