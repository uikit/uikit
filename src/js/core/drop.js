import $ from 'jquery';
import {hasTouch, isWithin, removeClass} from '../util/index';

export default function (UIkit) {

    var active, handler;

    UIkit.component('drop', {

        props: {
            mode: String,
            pos: String,
            offset: Number,
            justify: String,
            boundary: String,
            target: String,
            cls: String,
            flip: Boolean,
            delayShow: Number,
            delayHide: Number
        },

        defaults: {
            mode: 'hover',
            pos: 'bottom-left',
            offset: 0,
            justify: false,
            boundary: window,
            target: '.uk-drop',
            cls: 'uk-drop',
            flip: true,
            delayShow: 0,
            delayHide: 800,
            hoverIdle: 200
        },

        ready() {

            this.drop = this.$el.find(this.target);
            this.justify = this.justify && $(this.justify);

            if (this.justify) {
                this.flip = this.flip === true || this.flip === 'y' ? 'y' : false;
            }

            this.boundary = $(this.boundary);
            this.mode = hasTouch ? 'click' : this.mode;
            this.positions = [];

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
                this.$el.on('click', `:not(${this.target}) a[href="#"]`, e => {
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

                if (active === this) {
                    return;
                } else if (!force && active && active !== this && active.isDelaying()) {
                    this.delayShowTimer = setTimeout(this.show.bind(this), 75);
                    return;
                } else if (active) {
                    active.hide(true);
                }

                this.$el.trigger('beforeshow', [this]);

                var show = () => {

                    this.updatePosition();

                    this.$el
                        .addClass('uk-open')
                        .attr('aria-expanded', 'true')
                        .trigger('show', [this]);

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
                    this.$el
                        .trigger('beforehide', [this, force])
                        .removeClass('uk-open')
                        .attr('aria-expanded', 'false')
                        .trigger('hide', [this, force]);

                    active = active === this ? null : active;
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

                // reset
                removeClass(this.drop, this.cls + '-(top|bottom|left|right|stack)').css({
                    'top-left': '',
                    'left': '',
                    'margin-left': '',
                    'margin-right': ''
                });

                if (this.justify) {
                    this.drop.css('min-width', '');
                }

                this.drop.show();

                var pos = getBoundary(this.$el),
                    dim = getBoundary(this.drop),
                    boundary = getBoundary(this.boundary);

                if (dim.width > Math.max(boundary.right - pos.left, pos.right - boundary.left)) {

                    this.drop.addClass(this.cls + '-stack');
                    this.$el.trigger('stack', [this]);

                    dim = getBoundary(this.drop);
                }

                var positions = {
                        'bottom-left': {top: pos.height + this.offset, left: 0},
                        'bottom-right': {top: pos.height + this.offset, left: pos.width - dim.width},
                        'bottom-center': {top: pos.height + this.offset, left: (pos.width - dim.width) / 2},
                        'top-left': {top: -dim.height - this.offset, left: 0},
                        'top-right': {top: -dim.height - this.offset, left: pos.width - dim.width},
                        'top-center': {top: -dim.height - this.offset, left: (pos.width - dim.width) / 2},
                        'left-top': {top: 0, left: -dim.width - this.offset},
                        'left-bottom': {top: pos.height - dim.height, left: -dim.width - this.offset},
                        'left-center': {top: (pos.height - dim.height) / 2, left: -dim.width - this.offset},
                        'right-top': {top: 0, left: pos.width + this.offset},
                        'right-bottom': {top: pos.height - dim.height, left: pos.width + this.offset},
                        'right-center': {top: (pos.height - dim.height) / 2, left: pos.width + this.offset}
                    },
                    position = positions[this.pos];

                this.direction = this.pos.split('-')[0];

                if (this.flip) {

                    var flipTo = this.pos, flip;

                    flipAxis(pos, position, dim, boundary).forEach((dir) => {
                        if (this.flip === true || this.flip === dir) {
                            flip = flipPosition(flipTo, dir);
                            if (flipAxis(pos, positions[flip], dim, boundary).indexOf(dir) === -1) {
                                flipTo = flip;
                            }
                        }
                    });

                    if (flipTo !== this.pos) {
                        this.direction = flipTo.split('-')[0];
                        position = positions[flipTo];
                    }

                }

                if (this.justify) {

                    var justify = getBoundary(this.justify);

                    if (this.direction === 'top' || this.direction === 'bottom') {
                        position.left = 0;
                        position['min-width'] = justify.width - (dim.width - this.drop.width());
                        position['margin-left'] = justify.left - pos.left;
                    } else {
                        position.top = 0;
                        position['min-height'] = justify.height - (dim.height - this.drop.height());
                        position['margin-top'] = justify.top - pos.top;
                    }
                }

                this.drop.css(position).css('display', '').addClass(`${this.cls}-${this.direction}`);
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

                var offset = this.drop.offset(),
                    topLeft = {x: offset.left, y: offset.top},
                    topRight = {x: offset.left + this.drop.outerWidth(), y: topLeft.y},
                    bottomLeft = {x: offset.left, y: offset.top + this.drop.outerHeight()},
                    bottomRight = {x: topRight.x, y: bottomLeft.y};

                if (this.direction === 'left') {
                    this.incPoint = topRight;
                    this.decPoint = bottomRight;
                } else if (this.direction === 'right') {
                    this.incPoint = bottomLeft;
                    this.decPoint = topLeft;
                } else if (this.direction === 'bottom') {
                    this.incPoint = topLeft;
                    this.decPoint = topRight;
                } else if (this.direction === 'top') {
                    this.incPoint = bottomRight;
                    this.decPoint = bottomLeft;
                } else {
                    this.incPoint = 0;
                    this.decPoint = 0;
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
                    delay = !(
                        !position
                        || this.mode !== 'hover'
                        || !this.decPoint
                        || (this.position && position.x === this.position.x && position.y === this.position.y)
                        || slope(position, this.decPoint) > slope(prevPos, this.decPoint)
                        || slope(position, this.incPoint) < slope(prevPos, this.incPoint)
                    );

                this.position = delay ? position : null;
                return delay;
            }

        }

    });

    function flipPosition(pos, dir) {

        if (dir === 'x') {
            return pos.replace(/left|right/, (match) => {
                return match === 'right' ? 'left' : 'right';
            });
        }

        if (dir === 'y') {
            return pos.replace(/bottom|top/, (match) => {
                return match === 'bottom' ? 'top' : 'bottom';
            });
        }

        return pos;
    }

    function flipAxis(pos, offset, dim, boundary) {

        var axis = [], left = pos.left + offset.left, top = pos.top + offset.top;

        if (left < boundary.left || left + dim.width > boundary.right) {
            axis.push('x');
        }

        if (top < boundary.top || top + dim.height > boundary.bottom) {
            axis.push('y');
        }

        return axis;
    }

    function getBoundary(boundary) {
        var width = boundary.outerWidth(),
            height = boundary.outerHeight(),
            offset = boundary.offset(),
            left = offset ? offset.left : boundary.scrollLeft(),
            top = offset ? offset.top : boundary.scrollTop();

        return {width: width, height: height, left: left, top: top, right: left + width, bottom: top + height};
    }


    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }
}
