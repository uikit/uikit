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
            hoverIdle: 250,
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
                    this.initMouseTracker();
                    this.show();
                }).on('mouseleave', () => {
                    this.$el.trigger('pointerleave', [this]);
                    this.hide();
                    this.cancelMouseTracker();
                });

            }

        },

        methods: {

            show(force) {

                this.clearTimers();

                if (active === this) {
                    return;
                } else if (!force && active && active !== this && active.hoverTimer) {
                    this.delayShowTimer = setTimeout(() => {
                        this.show(active && !active.hoverTimer);
                    }, this.hoverIdle);
                    return;
                } else if (active) {
                    active.hide(true);
                }

                this.$el.trigger('beforeshow', [this]);

                this.updatePosition();

                var show = () => {
                    this.$el
                        .addClass('uk-open')
                        .attr('aria-expanded', 'true')
                        .trigger('show', [this]);

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

                if (this.hoverTimer) {
                    return;
                }

                this.clearTimers();

                var hide = () => {
                    this.$el
                        .trigger('beforehide', [this, force])
                        .removeClass('uk-open')
                        .attr('aria-expanded', 'false')
                        .trigger('hide', [this, force]);

                    active = active === this ? null : active;
                };

                if (!force && this.delayDeactivation()) {

                    this.hoverTimer = setTimeout(() => {
                        delete this.hoverTimer;
                        this.hide();
                    }, this.hoverIdle);
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

            initMouseTracker() {
                this.positions = [];
                this.position = null;

                this.mouseHandler = (e) => {
                    this.positions.push({x: e.pageX, y: e.pageY});

                    if (this.positions.length > 3) {
                        this.positions.shift();
                    }
                };

                $(document).on('mousemove', this.mouseHandler);
            },

            cancelMouseTracker() {
                if (this.mouseHandler) {
                    $(document).off('mousemove', this.mouseHandler);
                }
            },

            delayDeactivation() {

                var position = this.positions[this.positions.length - 1], prevPos = this.positions[0];

                if (!position
                    || this.mode !== 'hover'
                    || this.position && position.x === this.position.x && position.y === this.position.y
                ) {
                    return false;
                }

                if (!prevPos) {
                    prevPos = position;
                }

                var offset = this.drop.offset(),
                    topLeft = {x: offset.left, y: offset.top},
                    topRight = {x: offset.left + this.drop.outerWidth(), y: topLeft.y},
                    bottomLeft = {x: offset.left, y: offset.top + this.drop.outerHeight()},
                    bottomRight = {x: offset.left + this.drop.outerWidth(), y: bottomLeft.y},
                    decreasingCorner, increasingCorner;

                if (this.direction == 'left') {
                    increasingCorner = topRight;
                    decreasingCorner = bottomRight;
                } else if (this.direction == 'right') {
                    increasingCorner = bottomLeft;
                    decreasingCorner = topLeft;
                } else if (this.direction == 'bottom') {
                    increasingCorner = topLeft;
                    decreasingCorner = topRight;
                } else if (this.direction == 'top') {
                    increasingCorner = bottomRight;
                    decreasingCorner = bottomLeft;
                } else {
                    return false;
                }

                if (slope(position, decreasingCorner) < slope(prevPos, decreasingCorner)
                    && slope(position, increasingCorner) > slope(prevPos, increasingCorner)
                ) {
                    this.position = position;
                    return true;
                }

                this.position = null;
                return false;

                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
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

                this.direction = pp[0];

                // TODO ?
                if (width > boundaryWidth) {
                    this.drop.addClass(this.cls + '-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.drop.css(css).css('display', '').addClass(`${this.cls}-${pp[0]}`);
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

}
