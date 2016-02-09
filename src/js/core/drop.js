import $ from 'jquery';
import {hasTouch, offsetParent, isWithin, removeClass} from '../util/index';
import domMixin from '../mixin/dom';

export default function (UIkit) {

    var active, handler;

    UIkit.component('drop', {

        mixins: [domMixin],

        props: {
            mode: String,
            pos: String,
            offset: Number,
            justify: String,
            boundary: String,
            target: String,
            cls: String,
            preventFlip: String,
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
            preventFlip: false,
            delayShow: 0,
            delayHide: 800,
            hoverIdle: 200,
            flips: {
                x: {
                    'bottom-left': 'bottom-right',
                    'bottom-right': 'bottom-left',
                    'bottom-center': 'bottom-right',
                    'top-left': 'top-right',
                    'top-right': 'top-left',
                    'top-center': 'top-right',
                    'left-top': 'right',
                    'left-bottom': 'right-bottom',
                    'left-center': 'right-center',
                    'right-top': 'left',
                    'right-bottom': 'left-bottom',
                    'right-center': 'left-center'
                },
                y: {
                    'bottom-left': 'top-left',
                    'bottom-right': 'top-right',
                    'bottom-center': 'top-center',
                    'top-left': 'bottom-left',
                    'top-right': 'bottom-right',
                    'top-center': 'bottom-center',
                    'left-top': 'top-left',
                    'left-bottom': 'left-bottom',
                    'left-center': 'top-left',
                    'right-top': 'top-left',
                    'right-bottom': 'bottom-left',
                    'right-center': 'top-left'
                },
                xy: {}
            }
        },

        ready() {

            this.drop = this.$el.find(this.target);
            this.justify = (this.justify = $(this.justify)).length ? this.justify : false;
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

                var offset = offsetParent(this.drop),
                    pos = $.extend({}, offset.offset(), {width: offset[0].offsetWidth, height: offset[0].offsetHeight}),
                    width = this.drop.outerWidth(),
                    height = this.drop.outerHeight(),
                    boundaryWidth = this.boundary.width(),
                    variants = {
                        'bottom-left': {top: pos.height + this.offset, left: 0},
                        'bottom-right': {top: pos.height + this.offset, left: pos.width - width},
                        'bottom-center': {top: pos.height + this.offset, left: (pos.width - width) / 2},
                        'top-left': {top: -height - this.offset, left: 0},
                        'top-right': {top: -height - this.offset, left: pos.width - width},
                        'top-center': {top: -height - this.offset, left: (pos.width - width) / 2},
                        'left-top': {top: 0, left: -width - this.offset},
                        'left-bottom': {top: pos.height - height, left: -width - this.offset},
                        'left-center': {top: (pos.height - height) / 2, left: -width - this.offset},
                        'right-top': {top: 0, left: pos.width + this.offset},
                        'right-bottom': {top: pos.height - height, left: pos.width + this.offset},
                        'right-center': {top: (pos.height - height) / 2, left: pos.width + this.offset}
                    },
                    pp = this.pos.split('-'),
                    css = variants[this.pos] ? variants[this.pos] : variants['bottom-left'];

                // justify popover
                if (this.justify) {

                    this.justifyElement(this.drop.css({left: 0}), this.justify, boundaryWidth);

                } else if (this.preventFlip !== true) {

                    var flipTo, flip = this.checkBoundary(pos.left + css.left, pos.top + css.top, width, height, boundaryWidth);

                    if (flip === 'x' && this.preventFlip !== 'x') {
                        flipTo = this.flips['x'][this.pos] || 'right-top';
                    } else if (flip === 'y' && this.preventFlip !== 'y') {
                        flipTo = this.flips['y'][this.pos] || 'top-left';
                    } else if (flip === 'xy' && !this.preventFlip) {
                        flipTo = this.flips['xy'][this.pos] || 'right-bottom';
                    }

                    if (flipTo) {

                        pp = flipTo.split('-');
                        css = variants[flipTo] ? variants[flipTo] : variants['bottom-left'];

                        // check flipped
                        if (this.checkBoundary(pos.left + css.left, pos.top + css.top, width, height, boundaryWidth)) {
                            pp = this.pos.split('-');
                            css = variants[this.pos] ? variants[this.pos] : variants['bottom-left'];
                        }
                    }

                }

                // TODO ?
                if (width > boundaryWidth) {
                    this.drop.addClass(this.cls + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.drop.css(css).css('display', '').addClass(`${this.cls}-${pp[0]}`);

                this.direction = pp[0];

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
                    bottomRight = {x: offset.left + this.drop.outerWidth(), y: bottomLeft.y};

                if (this.direction == 'left') {
                    this.increasingCorner = topRight;
                    this.decreasingCorner = bottomRight;
                } else if (this.direction == 'right') {
                    this.increasingCorner = bottomLeft;
                    this.decreasingCorner = topLeft;
                } else if (this.direction == 'bottom') {
                    this.increasingCorner = topLeft;
                    this.decreasingCorner = topRight;
                } else if (this.direction == 'top') {
                    this.increasingCorner = bottomRight;
                    this.decreasingCorner = bottomLeft;
                } else {
                    this.increasingCorner = 0;
                    this.decreasingCorner = 0;
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
                        || !this.decreasingCorner
                        || (this.position && position.x === this.position.x && position.y === this.position.y)
                        || slope(position, this.decreasingCorner) > slope(prevPos, this.decreasingCorner)
                        || slope(position, this.increasingCorner) < slope(prevPos, this.increasingCorner)
                    );

                this.position = delay ? position : null;
                return delay;
            },

            checkBoundary(left, top, width, height, boundaryWidth) {

                var axis = '';

                if (left < 0 || ((left - $(window).scrollLeft()) + width) > boundaryWidth) {
                    axis += 'x';
                }

                if ((top - $(window).scrollTop()) < 0 || ((top - $(window).scrollTop()) + height) > window.innerHeight) {
                    axis += 'y';
                }

                return axis;
            }

        }

    });

    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }
}
