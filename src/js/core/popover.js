import $ from 'jquery';
import {hasTouch, offsetParent, isWithin} from '../util/index';
import domMixin from '../mixin/dom';

export default function (UIkit) {

    var active, handler;

    UIkit.component('popover', {

        mixins: [domMixin],

        props: {
            mode: String,
            pos: String,
            offset: Number,
            justify: String,
            boundary: String,
            selector: String,
            preventFlip: String,
            delayIn: Number,
            delayOut: Number
        },

        defaults: {
            mode: 'hover',
            pos: 'bottom-left',
            offset: 0,
            justify: false,
            boundary: window,
            selector: '.uk-dropdown,.uk-dropdown-blank',
            preventFlip: false,
            delayIn: 0,
            delayOut: 800,
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

            this.dropdown = this.$el.find(this.selector);
            this.justify = (this.justify = $(this.justify)).length ? this.justify : false;
            this.boundary = $(this.boundary);
            this.mode = hasTouch ? 'click' : this.mode;

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
                } else if (!isWithin(e.target, this.dropdown) || isWithin(e.target, '.uk-dropdown-close')) {
                    this.hide(true);
                }
            });

            if (this.mode === 'click') {
                this.$el.on('click', `:not(${this.selector}) a[href="#"]`, e => {
                    e.preventDefault();
                });
            } else {

                this.$el.on('mouseenter', () => {
                    this.$el.trigger('pointerenter', [this]);
                    this.show();
                }).on('mouseleave', () => {
                    this.hide();
                    this.$el.trigger('pointerleave', [this]);
                });

            }

        },

        methods: {

            show: function (force) {

                if (this.delayOutHandler) {
                    clearTimeout(this.delayOutHandler);
                }

                if (force && this.delayInHandler) {
                    clearTimeout(this.delayInHandler);
                } else if (active === this) {
                    return;
                } else if (active) {
                    active.hide(true);
                }

                this.$el.trigger('beforeshow', [this]);

                this.checkDimensions();

                var show = () => {
                    this.$el
                        .addClass('uk-open')
                        .attr('aria-expanded', 'true')
                        .trigger('show', [this]);

                    this.$update();
                };

                if (!force && this.delayIn) {
                    this.delayInHandler = setTimeout(show, this.delayIn);
                } else {
                    show();
                }

                active = this;
            },

            hide: function (force) {

                if (this.delayInHandler) {
                    clearTimeout(this.delayInHandler);
                }

                var hide = () => {
                    this.$el
                        .trigger('beforehide', [this, force])
                        .removeClass('uk-open')
                        .attr('aria-expanded', 'false')
                        .trigger('hide', [this, force]);

                    active = active === this ? null : active;
                };

                if (!force && this.delayOut) {
                    this.delayOutHandler = setTimeout(hide, this.delayOut);
                } else {
                    hide();
                }
            },

            checkDimensions: function () {

                // reset
                this.dropdown.removeClass('uk-dropdown-top uk-dropdown-bottom uk-dropdown-left uk-dropdown-right uk-dropdown-stack').css({
                    'top-left': '',
                    'left': '',
                    'margin-left': '',
                    'margin-right': ''
                });

                if (this.justify) {
                    this.dropdown.css('min-width', '');
                }

                this.dropdown.show();

                var offset = offsetParent(this.dropdown),
                    pos = $.extend({}, offset.offset(), {width: offset[0].offsetWidth, height: offset[0].offsetHeight}),
                    width = this.dropdown.outerWidth(),
                    height = this.dropdown.outerHeight(),
                    boundaryWidth = this.boundary.width(),
                    variants = {
                        'bottom-left': {top: 0 + pos.height + this.offset, left: 0},
                        'bottom-right': {top: 0 + pos.height + this.offset, left: 0 + pos.width - width},
                        'bottom-center': {top: 0 + pos.height + this.offset, left: pos.width / 2 - width / 2},
                        'top-left': {top: 0 - height - this.offset, left: 0},
                        'top-right': {top: 0 - height - this.offset, left: 0 + pos.width - width},
                        'top-center': {top: 0 - height - this.offset, left: pos.width / 2 - width / 2},
                        'left-top': {top: 0, left: 0 - width - this.offset},
                        'left-bottom': {top: 0 + pos.height - height, left: 0 - width - this.offset},
                        'left-center': {top: pos.height / 2 - height / 2, left: 0 - width - this.offset},
                        'right-top': {top: 0, left: 0 + pos.width + this.offset},
                        'right-bottom': {top: 0 + pos.height - height, left: 0 + pos.width + this.offset},
                        'right-center': {top: pos.height / 2 - height / 2, left: 0 + pos.width + this.offset}
                    },
                    pp = this.pos.split('-'),
                    css = variants[this.pos] ? variants[this.pos] : variants['bottom-left'];

                // justify dropdown
                if (this.justify) {

                    this.justifyElement(this.dropdown.css({left: 0}), this.justify, boundaryWidth);

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
                    this.dropdown.addClass('uk-dropdown-stack');
                    this.$el.trigger('stack', [this]);
                }

                this.dropdown.css(css).css('display', '').addClass('uk-dropdown-' + pp[0]);
            },

            checkBoundary: function (left, top, width, height, boundaryWidth) {

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
