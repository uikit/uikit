import $ from 'jquery';
import {hasTouch, isWithin, removeClass, toJQuery} from '../util/index';

export default function (UIkit) {

    var active, handler;

    UIkit.component('drop', {

        props: {
            cls: String,
            mode: String,
            pos: String,
            offset: Number,
            boundary: 'jQuery',
            boundaryAlign: Boolean,
            flip: Boolean,
            delayShow: Number,
            delayHide: Number
        },

        defaults: {
            cls: 'uk-drop',
            mode: 'hover',
            pos: 'bottom-left',
            offset: 0,
            boundary: $(window),
            boundaryAlign: false,
            flip: true,
            delayShow: 0,
            delayHide: 800,
            hoverIdle: 200
        },

        ready() {

            this.drop = toJQuery(this.$el.find('.' + this.cls));

            this.mode = hasTouch ? 'click' : this.mode;
            this.positions = [];
            this.pos = (this.pos + (this.pos.indexOf('-') === -1 ? '-center' : '')).split('-');

            // Init ARIA
            this.$el.attr({
                'aria-haspopup': 'true',
                'aria-expanded': this.$el.hasClass('uk-open')
            });

            if (!handler) {
                $('html').on('click', e => {
                    if (active && !active.$el.find(e.target).length) {
                        active.hide(true);
                    }
                });
            }

            this.$el.on('click', e => {
                if (!this.$el.hasClass('uk-open')) {
                    this.show(true);
                } else if (!isWithin(e.target, this.drop) || isWithin(e.target, `.${this.cls}-close`)) {
                    this.hide(true);
                }
            });

            if (this.mode === 'click') {
                this.$el.on('click', `> a[href="#"], :not(.${this.cls}) a[href="#"]`, e => {
                    e.preventDefault();
                });
            } else {
                this.$el.on('mouseenter', () => {
                    this.$el.trigger('pointerenter', [this]);
                    this.show();
                }).on('mouseleave', () => {
                    this.$el.trigger('pointerleave', [this]);
                    this.hide();
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

                    this.$el.trigger('beforeshow', [this]);

                    this.updatePosition();

                    this.$el.addClass('uk-open').attr('aria-expanded', 'true');

                    this.initMouseTracker();

                    this.$el.trigger('show', [this]);
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

                    active = active === this ? null : active;

                    this.$el
                        .trigger('beforehide', [this, force])
                        .removeClass('uk-open')
                        .attr('aria-expanded', 'false')
                        .trigger('hide', [this, force]);

                    this.cancelMouseTracker();
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

                removeClass(this.drop, this.cls + '-(top|bottom|left|right|stack)(-[a-z])?').css({top: '', left: ''});

                this.drop.show();

                this.dir = this.pos[0];
                this.align = this.pos[1];

                var drop = getBoundary(this.drop),
                    el = getBoundary(this.$el),
                    boundary = offsetBy(getBoundary(this.boundary), el),
                    alignTo = this.boundaryAlign ? boundary : offsetBy(el, el),
                    justify = this.align === 'justify';

                if (justify) {
                    if (this.getAxis() === 'y') {
                        this.drop.css('width', alignTo.width);
                        this.align = 'left';
                    } else {
                        this.drop.css('height', alignTo.height);
                        this.align = 'top';
                    }

                    drop = getBoundary(this.drop);
                }

                if (drop.width > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {

                    this.drop.addClass(this.cls + '-stack');
                    this.$el.trigger('stack', [this]);

                    drop = getBoundary(this.drop);
                }

                var dirs = {
                        bottom: alignTo.height + this.offset,
                        top: -drop.height - this.offset,
                        left: -drop.width - this.offset,
                        right: alignTo.width + this.offset,
                        y: alignTo.width - drop.width,
                        x: alignTo.height - drop.height
                    },
                    positions = {
                        bottom: {
                            left: {top: dirs.bottom, left: 0},
                            right: {top: dirs.bottom, left: dirs.y},
                            center: {top: dirs.bottom, left: dirs.y / 2}
                        },
                        top: {
                            left: {top: dirs.top, left: 0},
                            right: {top: dirs.top, left: dirs.y},
                            center: {top: dirs.top, left: dirs.y / 2}
                        },
                        left: {
                            top: {top: 0, left: dirs.left},
                            bottom: {top: dirs.x, left: dirs.left},
                            center: {top: dirs.x / 2, left: dirs.left}
                        },
                        right: {
                            top: {top: 0, left: dirs.right},
                            bottom: {top: dirs.x, left: dirs.right},
                            center: {top: dirs.x / 2, left: dirs.right}
                        }
                    };

                var position = positions[this.dir][this.align];

                if (this.flip) {

                    var axis = this.getAxis(), dir, align;

                    if (this.flip === true || this.flip === axis) {
                        dir = flipAxis(position, drop, boundary, axis);

                        if (dir && !flipAxis(positions[dir][this.align], drop, boundary, axis)) {
                            this.dir = dir;
                        }
                    }

                    axis = axis === 'x' ? 'y' : 'x';
                    if (this.flip === true || this.flip === axis) {
                        align = flipPosition(flipAxis(position, drop, boundary, axis));
                        if (align && !flipAxis(positions[this.dir][align], drop, boundary, axis)) {
                            this.align = align;
                        }
                    }

                    position = positions[this.dir][this.align]
                }

                position.top += alignTo.top;
                position.left += alignTo.left;

                this.drop.css(position).css('display', '').addClass(`${this.cls}-${this.dir}-${justify ? 'justify' : this.align}`);
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

                var boundary = getBoundary(this.drop),
                    topLeft = {x: boundary.left, y: boundary.top},
                    topRight = {x: boundary.left + boundary.width, y: topLeft.y},
                    bottomLeft = {x: boundary.left, y: boundary.top + boundary.height},
                    bottomRight = {x: topRight.x, y: bottomLeft.y};

                if (this.dir === 'left') {
                    this.points = [[topLeft, bottomRight], [topRight, bottomLeft]];
                } else if (this.dir === 'right') {
                    this.points = [[bottomRight, topLeft], [bottomLeft, topRight]];
                } else if (this.dir === 'bottom') {
                    this.points = [[bottomLeft, topRight], [topLeft, bottomRight]];
                } else if (this.dir === 'top') {
                    this.points = [[topRight, bottomLeft], [bottomRight, topLeft]];
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
                        return result - (slope(position, point[0]) < slope(prevPos, point[0]) || slope(position, point[1]) > slope(prevPos, point[1]));
                    }, 2);
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

    function flipAxis(offset, drop, boundary, axis) {
        return axis === 'x' && offset.left < boundary.left
            ? 'right'
                : axis === 'x' && offset.left + drop.width > boundary.right
                ? 'left'
                    : axis === 'y' && offset.top < boundary.top
                    ? 'bottom'
                        : axis === 'y' && offset.top + drop.height > boundary.bottom
                        ? 'top'
                            : false;
    }

    function getBoundary(boundary) {
        var width = boundary.outerWidth(),
            height = boundary.outerHeight(),
            offset = boundary.offset(),
            left = offset ? offset.left : boundary.scrollLeft(),
            top = offset ? offset.top : boundary.scrollTop();

        return {width: width, height: height, left: left, top: top, right: left + width, bottom: top + height};
    }

    function offsetBy(boundary, offset) {
        boundary.top = -offset.top + boundary.top;
        boundary.bottom = boundary.top + boundary.height;
        boundary.left = -offset.left + boundary.left;
        boundary.right = boundary.left + boundary.width;

        return boundary
    }

    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }
}
