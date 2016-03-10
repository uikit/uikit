import $ from 'jquery';
import {isWithin, hasTouch, removeClass, position, getDimensions, toJQuery} from '../util/index';

export default function (UIkit) {

    var active;

    $(document).on('click', e => {
        if (active && !isWithin(e.target, active.$el)) {
            active.hide(true);
        }
    });

    UIkit.component('drop', {

        mixins: [UIkit.mixin.position, UIkit.mixin.toggle],

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
            this.positions = [];

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

            this.drop.attr('aria-expanded', false);

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

        methods: {

            show(force) {

                this.clearTimers();

                if (this.isActive()) {
                    return;
                } else if (!force && active && active !== this && active.isDelaying()) {
                    this.showTimer = setTimeout(this.show.bind(this), 75);
                    return;
                } else if (active) {
                    active.hide(true);
                }

                var show = () => {

                    removeClass(this.drop, this.clsDrop + '-(stack|boundary)').css({top: '', left: '', width: '', height: ''});

                    if (this.boundaryAlign) {
                        this.drop.addClass(`${this.clsDrop}-boundary`);
                    }

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
                        this.drop.addClass(this.clsDrop + '-stack');
                        this.$el.trigger('stack', [this]);
                    }

                    this.positionAt(this.drop, this.boundaryAlign ? this.boundary : this.$el, this.boundary);

                    this.$el.trigger('beforeshow', [this]).addClass(this.cls);
                    this.toggleState(this.drop.css('display', ''));
                    this.drop.attr('aria-expanded', 'true');
                    this.$el.trigger('show', [this]);

                    this.initMouseTracker();
                    this.$update();
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

                    this.$el.trigger('beforehide', [this, force]).removeClass('uk-open').find('a').blur();
                    this.toggleState(this.drop, false);
                    this.drop.attr('aria-expanded', 'false');
                    this.$el.trigger('hide', [this, force]);

                };

                if (!force && this.isDelaying()) {
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

            initMouseTracker() {

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

            isActive() {
                return active === this;
            }

        }

    });

    UIkit.drop.getActive = function () {
        return active;
    };

    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }
}
