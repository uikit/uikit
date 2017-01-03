import { $, Animation, isNumeric, isString, query, requestAnimationFrame } from '../util/index';

export default function (UIkit) {

    UIkit.component('sticky', {

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

        connected() {
            this.placeholder = $('<div class="uk-sticky-placeholder"></div>').insertAfter(this.$el).attr('hidden', true);
            this._widthElement = this.widthElement || this.placeholder;
        },

        ready() {

            this.topProp = this.top;
            this.bottomProp = this.bottom;

            var scroll = $(window).scrollTop();
            if (location.hash && scroll > 0 && this.target) {

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

        update: {

            handler({type, dir}) {

                var isActive = this.$el.hasClass(this.clsActive) && !this.$el.hasClass('uk-animation-leave'), el;

                if (type !== 'scroll') {

                    var outerHeight = this.$el.outerHeight();

                    this.placeholder.css({
                        height: this.$el.css('position') !== 'absolute' ? outerHeight : '',
                        marginTop: this.$el.css('marginTop'),
                        marginBottom: this.$el.css('marginBottom'),
                        marginLeft: this.$el.css('marginLeft'),
                        marginRight: this.$el.css('marginRight')
                    });

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
                }

                var scroll = $(window).scrollTop();

                if (scroll < 0 || !this.$el.is(':visible') || this.disabled) {
                    return;
                }

                if (this.inactive
                    || scroll < this.top
                    || this.showOnUp && (dir !== 'up' || dir === 'up' && !isActive && scroll <= this.bottomOffset)
                ) {
                    if (isActive) {

                        var hide = () => {
                            this.$el
                                .removeClass(this.clsActive)
                                .addClass(this.clsInactive)
                                .css({position: '', top: '', width: ''})
                                .trigger('inactive');
                            this.placeholder.attr('hidden', true);
                        };

                        if (this.animation && this.bottomOffset < this.$el.offset().top) {
                            Animation.cancel(this.$el).then(() => Animation.out(this.$el, this.animation).then(hide));
                        } else {
                            hide();
                        }

                    }

                    return;
                }

                var top = Math.max(0, this.offset);
                if (this.bottom && scroll > this.bottom - this.offset) {
                    top = this.bottom - scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: top + 'px',
                    width: this._widthElement[0].getBoundingClientRect().width
                });

                if (isActive) {
                    return;
                }

                var show = () => {
                    this.$el
                        .addClass(this.clsActive)
                        .removeClass(this.clsInactive)
                        .trigger('active');
                    this.placeholder.attr('hidden', false);
                };

                if (this.animation) {

                    Animation.cancel(this.$el).then(() => {
                        show();
                        Animation.in(this.$el, this.animation);
                    });

                } else {
                    show();
                }

            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        },

        disconnected() {
            this.placeholder.remove();
            this.placeholder = null;
            this._widthElement = null;
        }

    });

}
