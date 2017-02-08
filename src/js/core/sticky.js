import { Class } from '../mixin/index';
import { $, Animation, isNumeric, isString, query, requestAnimationFrame, win } from '../util/index';

export default function (UIkit) {

    UIkit.component('sticky', {

        mixins: [Class],

        props: {
            top: null,
            bottom: Boolean,
            offset: Number,
            animation: String,
            clsActive: String,
            clsInactive: String,
            widthElement: 'jQuery',
            showOnUp: Boolean,
            media: 'media',
            target: Number
        },

        defaults: {
            top: 0,
            bottom: false,
            offset: 0,
            animation: '',
            clsActive: 'uk-active',
            clsInactive: '',
            widthElement: false,
            showOnUp: false,
            media: false,
            target: false
        },

        init() {
            this.$el.addClass(this.clsInactive);
        },

        connected() {
            this.placeholder = $('<div class="uk-sticky-placeholder"></div>').insertAfter(this.$el).attr('hidden', true);
            this._widthElement = this.widthElement || this.placeholder;
        },

        ready() {

            this.topProp = this.top;
            this.bottomProp = this.bottom;

            if (this.target && location.hash && win.scrollTop() > 0) {

                var target = query(location.hash);

                if (target) {
                    requestAnimationFrame(() => {

                        var top = target.offset().top,
                            elTop = this.$el.offset().top,
                            elHeight = this.$el.outerHeight(),
                            elBottom = elTop + elHeight;

                        if (elBottom >= top && elTop <= top + target.outerHeight()) {
                            window.scrollTo(0, top - elHeight - this.target - this.offset);
                        }

                    });
                }
            }

        },

        update: [

            {

                write() {

                    var outerHeight = this.$el.outerHeight(), isActive = this.isActive(), el;

                    this.placeholder
                        .css('height', this.$el.css('position') !== 'absolute' ? outerHeight : '')
                        .css(this.$el.css(['marginTop', 'marginBottom', 'marginLeft', 'marginRight']));

                    this.width = this._widthElement.attr('hidden', null).outerWidth();
                    this._widthElement.attr('hidden', !isActive);

                    this.topOffset = (isActive ? this.placeholder.offset() : this.$el.offset()).top;
                    this.bottomOffset = this.topOffset + outerHeight;

                    ['top', 'bottom'].forEach(prop => {

                        this[prop] = this[`${prop}Prop`];

                        if (!this[prop]) {
                            return;
                        }

                        if (isNumeric(this[prop])) {

                            this[prop] = this[`${prop}Offset`] + parseFloat(this[prop]);

                        } else {

                            if (isString(this[prop]) && this[prop].match(/^-?\d+vh$/)) {
                                this[prop] = window.innerHeight * parseFloat(this[prop]) / 100;
                            } else {

                                el = this[prop] === true ? this.$el.parent() : query(this[prop], this.$el);

                                if (el) {
                                    this[prop] = el.offset().top + el.outerHeight();
                                }

                            }

                        }

                    });

                    this.top = Math.max(parseFloat(this.top), this.topOffset) - this.offset;
                    this.bottom = this.bottom && this.bottom - outerHeight;
                    this.inactive = this.media && !window.matchMedia(this.media).matches;

                    if (isActive) {
                        this.update();
                    }
                },

                events: ['load', 'resize', 'orientationchange']

            },

            {

                write({dir} = {}) {

                    var isActive = this.isActive(), scroll = win.scrollTop();

                    if (scroll < 0 || !this.$el.is(':visible') || this.disabled) {
                        return;
                    }

                    if (this.inactive
                        || scroll < this.top
                        || this.showOnUp && (dir !== 'up' || dir === 'up' && !isActive && scroll <= this.bottomOffset)
                    ) {

                        if (!isActive) {
                            return;
                        }

                        isActive = false;

                        if (this.animation && this.bottomOffset < this.$el.offset().top) {
                            Animation.cancel(this.$el).then(() => Animation.out(this.$el, this.animation).then(() => this.hide()));
                        } else {
                            this.hide();
                        }

                    } else if (isActive) {

                        this.update();

                    } else if (this.animation) {

                        Animation.cancel(this.$el).then(() => {
                            this.show();
                            Animation.in(this.$el, this.animation);
                        });

                    } else {
                        this.show();
                    }

                },

                events: ['scroll']

            },

        ],

        methods: {

            show() {

                this.update();

                this.$el
                    .removeClass(this.clsInactive)
                    .addClass(this.clsActive)
                    .trigger('active');

                this.placeholder.attr('hidden', null);

            },

            hide() {

                this.$el
                    .addClass(this.clsInactive)
                    .removeClass(this.clsActive)
                    .css({position: '', top: '', width: ''})
                    .trigger('inactive');

                this.placeholder.attr('hidden', true);
            },

            update() {

                var top = Math.max(0, this.offset), scroll = win.scrollTop();

                if (this.bottom && scroll > this.bottom - this.offset) {
                    top = this.bottom - scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: `${top}px`,
                    width: this.width
                });

            },

            isActive() {
                return this.$el.hasClass(this.clsActive) && !(this.animation && this.$el.hasClass('uk-animation-leave'));
            }

        },

        disconnected() {
            this.placeholder.remove();
            this.placeholder = null;
            this._widthElement = null;
        }

    });

}
