import $ from 'jquery';
import {Animation, isNumber, isString, toJQuery, requestAnimationFrame} from '../util/index';

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
            media: Number,
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

        ready() {

            this.placeholder = $('<div class="uk-sticky-placeholder"></div>').insertAfter(this.$el).attr('hidden', true);
            this.widthElement = this.widthElement || this.placeholder;
            this.topProp = this.top;
            this.bottomProp = this.bottom;

            var scroll = $(window).scrollTop();
            if (location.hash && scroll > 0 && this.target) {

                var target = toJQuery(location.hash);

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

                var isActive = this.$el.hasClass(this.clsActive), el;

                if (type !== 'scroll') {

                    this.placeholder.css({
                        height: this.$el.css('position') !== 'absolute' ? this.$el.outerHeight() : '',
                        marginTop: this.$el.css('marginTop'),
                        marginBottom: this.$el.css('marginBottom'),
                        marginLeft: this.$el.css('marginLeft'),
                        marginRight: this.$el.css('marginRight')
                    });

                    this.offsetTop = (isActive ? this.placeholder.offset() : this.$el.offset()).top;

                    this.top = this.topProp;

                    if (this.top && !isNumber(this.top)) {
                        if (isString(this.top) && this.top.match(/^-?\d+vh$/)) {
                            this.top = window.innerHeight * parseFloat(this.top) / 100;
                        } else {

                            el = toJQuery(this.top);

                            if (el) {
                                this.top = el[0].offsetTop + el[0].offsetHeight;
                            }
                        }
                    }

                    this.top = Math.max(parseFloat(this.top), this.offsetTop) - this.offset;

                    this.bottom = this.bottomProp;

                    if (this.bottom === true || this.bottom[0] === '!') {
                        this.bottom = this.bottom === true ? this.$el.parent() : this.$el.closest(this.bottom.substr(1));
                        this.bottom = this.bottom.offset().top + this.bottom.height() + parseFloat(this.bottom.css('padding-top'));
                    } else if (this.bottom && !isNumber(this.bottom)) {
                        if (isString(this.bottom) && this.bottom.match(/^-?\d+vh$/)) {
                            this.top = window.innerHeight * parseFloat(this.bottom) / 100;
                        } else {

                            el = toJQuery(this.bottom);

                            if (el) {
                                this.bottom = el[0].offsetTop + el[0].offsetHeight;
                            }
                        }
                    }

                    this.bottom = this.bottom ? this.bottom - this.$el.outerHeight() : this.bottom;

                    this.mediaInactive = this.media
                        && !(isNumber(this.media) && window.innerWidth >= this.media
                        || isString(this.media) && window.matchMedia(this.media).matches);
                }

                var scroll = $(window).scrollTop();

                if (scroll < 0 || !this.$el.is(':visible') || this.disabled) {
                    return;
                }

                if (this.mediaInactive
                    || scroll < this.top
                    || this.showOnUp && (dir !== 'up' || dir === 'up' && !isActive && scroll <= this.offsetTop + this.$el.outerHeight())
                ) {
                    if (isActive) {

                        this.$el.removeClass(this.clsActive).addClass(this.clsInactive);

                        var hide = () => {
                            this.$el.css({position: '', top: '', width: ''}).trigger('inactive');
                            this.placeholder.attr('hidden', true);
                        };

                        if (this.animation) {
                            Animation.cancel(this.$el).out(this.$el, this.animation).then(hide);
                        } else {
                            hide();
                        }

                    }

                    return;
                }

                this.placeholder.attr('hidden', false);

                var top = Math.max(0, this.offset);
                if (this.bottom && scroll > this.bottom - this.offset) {
                    top = this.bottom - scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: top + 'px',
                    width: this.widthElement[0].getBoundingClientRect().width
                });

                if (isActive) {
                    return;
                }

                if (this.animation) {
                    Animation.cancel(this.$el).in(this.$el, this.animation);
                }

                this.$el
                    .addClass(this.clsActive)
                    .removeClass(this.clsInactive)
                    .trigger('active');

            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        }

    });

}
