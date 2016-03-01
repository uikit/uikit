import $ from 'jquery';
import {hasTouch, removeClass, position, getDimensions, toJQuery} from '../util/index';

export default function (UIkit) {

    var active, handler;

    UIkit.component('drop', {

        props: {
            mode: String,
            pos: String,
            target: 'jQuery',
            boundary: 'jQuery',
            boundaryAlign: Boolean,
            flip: Boolean,
            offset: Number,
            delayShow: Number,
            delayHide: Number,
            cls: String
        },

        defaults: {
            mode: 'hover',
            pos: 'bottom-left',
            target: false,
            boundary: $(window),
            boundaryAlign: false,
            flip: true,
            offset: 0,
            delayShow: 0,
            delayHide: 800,
            hoverIdle: 200,
            cls: false
        },

        ready() {

            this.cls = this.cls || 'uk-' + this.$options.name;
            this.drop = this.target || toJQuery(this.$el.find(`.${this.cls}:first`)) || toJQuery(this.$el.nextAll(`.${this.cls}:first`));
            this.mode = hasTouch ? 'click' : this.mode;
            this.positions = [];
            this.pos = (this.pos + (this.pos.indexOf('-') === -1 ? '-center' : '')).split('-');

            // Init ARIA
            this.drop.attr('aria-expanded', false);

            if (!handler) {
                $('html').on('click', () => {
                    if (active) {
                        active.hide(true);
                    }
                });
            }

            this.$el.on('click', e => {

                e.preventDefault();
                e.stopPropagation();

                if (this.isActive()) {
                    this.hide(true);
                } else {
                    this.show(true);
                }
            });

            this.drop.on('click', `.${this.cls}-close`, () => {
                this.hide(true);
            });

            if (this.mode === 'hover') {

                this.$el.on('mouseenter', () => {
                    this.$el.trigger('pointerenter', [this]);
                    this.show();
                }).on('mouseleave', () => {
                    this.$el.trigger('pointerleave', [this]);
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

        methods: {

            show(force) {

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (!force && active && active !== this && active.isDelaying()) {
                    this.delayShowTimer = setTimeout(this.show.bind(this), 75);
                    return;
                } else if (active) {
                    active.hide(true);
                }

                var show = () => {

                    this.updatePosition();

                    this.$el.trigger('beforeshow', [this]).addClass('uk-open');
                    this.drop.addClass('uk-open').attr('aria-expanded', 'true');
                    this.$el.trigger('show', [this]);

                    this.initMouseTracker();
                    this.$update();
                };

                if (!force && this.delayShow) {
                    this.delayShowTimer = setTimeout(show, this.delayShow);
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

                    this.$el.trigger('beforehide', [this, force]).removeClass('uk-open').blur();
                    this.drop.removeClass('uk-open').attr('aria-expanded', 'false');
                    this.$el.trigger('hide', [this, force]);

                };

                if (!force && this.isDelaying()) {
                    this.hoverTimer = setTimeout(this.hide.bind(this), this.hoverIdle);
                } else if (!force && this.delayHide) {
                    this.delayHideTimer = setTimeout(hide, this.delayHide);
                } else {
                    hide();
                }
            },

            clearTimers() {

                if (this.delayShowTimer) {
                    clearTimeout(this.delayShowTimer);
                }

                if (this.delayHideTimer) {
                    clearTimeout(this.delayHideTimer);
                }

                if (this.hoverTimer) {
                    clearTimeout(this.hoverTimer);
                    delete this.hoverTimer;
                }
            },

            updatePosition() {

                if (!this.drop) {
                    return;
                }

                removeClass(this.drop, this.cls + '-(top|bottom|left|right|stack)(-[a-z]+)?').css({top: '', left: '', width: '', height: '', position: 'absolute'});

                this.drop.show();

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var boundary = getDimensions(this.boundary),
                    alignTo = this.boundaryAlign ? boundary : getDimensions(this.$el);

                if (this.align === 'justify') {
                    if (this.getAxis() === 'y') {
                        this.drop.css('width', alignTo.width);
                    } else {
                        this.drop.css('height', alignTo.height);
                    }
                }

                if (this.drop.outerWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.drop.addClass(this.cls + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                var flipped = position(
                    this.drop,
                    this.boundaryAlign ? this.boundary : this.$el,
                    this.getAxis() === 'x' ? `${flipPosition(this.dir)} ${this.align}` : `${this.align} ${flipPosition(this.dir)}`,
                    this.getAxis() === 'x' ? `${this.dir} ${this.align}` : `${this.align} ${this.dir}`,
                    this.getAxis() === 'x' ? `${this.offset}` : ` ${this.offset}`,
                    null,
                    this.flip,
                    this.boundary
                );

                this.dir = this.getAxis() === 'x' ? flipped.target.x : flipped.target.y;
                this.align = this.getAxis() === 'x' ? flipped.target.y : flipped.target.x;

                this.drop.css('display', '').addClass(`${this.cls}-${this.dir}-${this.align}`);
            },

            initMouseTracker() {

                if (!this.drop) {
                    return;
                }

                this.positions = [];
                this.position = null;

                if (this.mode !== 'hover') {
                    return;
                }

                this.mouseHandler = (e) => {
                    this.positions.push({x: e.pageX, y: e.pageY});

                    if (this.positions.length > 3) {
                        this.positions.shift();
                    }
                };

                $(document).on('mousemove', this.mouseHandler);

                var p = getDimensions(this.drop);

                this.points = [
                    [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
                    [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
                ];

                if (this.dir === 'right') {
                    this.points[0].reverse();
                    this.points[1].reverse();
                } else if (this.dir === 'top') {
                    this.points[0].reverse();
                } else if (this.dir === 'bottom') {
                    this.points[1].reverse();
                }

            },

            cancelMouseTracker() {
                if (this.mouseHandler) {
                    $(document).off('mousemove', this.mouseHandler);
                }
            },

            isDelaying() {

                if (this.hoverTimer) {
                    return true;
                }

                var position = this.positions[this.positions.length - 1],
                    prevPos = this.positions[0] || position,
                    delay = position && this.mode === 'hover' && this.points && !(this.position && position.x === this.position.x && position.y === this.position.y);

                if (delay) {
                    delay = !!this.points.reduce((result, point) => {
                        return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
                    }, 0);
                }

                this.position = delay ? position : null;
                return delay;
            },

            getAxis() {
                return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
            },

            isActive() {
                return active === this;
            }

        }

    });

    UIkit.drop.getActive = function () {
        return active;
    };

    function flipPosition(pos) {
        switch (pos) {
            case 'left':
                return 'right';
            case 'right':
                return 'left';
            case 'top':
                return 'bottom';
            case 'bottom':
                return 'top';
            default:
                return pos;
        }
    }

    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }
}
