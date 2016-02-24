import $ from 'jquery';
import {Animation, toJQuery, requestAnimationFrame} from '../util/index';

export default function (UIkit) {

    UIkit.component('sticky', {

        props: {
            top: null,
            bottom: Boolean,
            offset: Number,
            animation: String,
            clsInit: String,
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
            clsInit: 'uk-sticky-init',
            clsActive: 'uk-active',
            clsInactive: '',
            widthElement: false,
            showOnUp: false,
            media: false,
            target: false
        },

        ready() {

            this.placeholder = $('<div class="uk-sticky-placeholder"></div>')
                .insertAfter(this.$el)
                .css({
                    height: this.$el.css('position') !== 'absolute' ? this.$el.outerHeight() : '',
                    margin: this.$el.css('margin')
                }).attr('hidden', true);

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

                var isActive = this.$el.hasClass(this.clsActive);

                if (type !== 'scroll') {

                    this.offsetTop = (isActive ? this.placeholder.offset() : this.$el.offset()).top;

                    this.top = this.topProp;

                    if (this.topProp && typeof(this.topProp) === 'string') {
                        if (this.topProp.match(/^-?\d+vh$/)) {
                            this.top = window.innerHeight * parseFloat(this.topProp) / 100;
                        } else {
                            var el = toJQuery(this.topProp);
                            if (el) {
                                this.top = el[0].offsetTop + el[0].offsetHeight;
                            }
                        }
                    }

                    this.top = Math.max(parseFloat(this.top), this.offsetTop) - this.offset;

                    if (this.bottomProp === true || this.bottomProp[0] === '!') {
                        this.bottom = this.bottomProp === true ? this.$el.parent() : this.$el.closest(this.bottomProp.substr(1));
                        this.bottom = this.bottom.offset().top + this.bottom.height() + parseFloat(this.bottom.css('padding-top'));
                    } else if (typeof this.bottomProp === 'string') {
                        this.bottom = toJQuery(this.bottomProp);
                        if (this.bottom) {
                            this.bottom = this.bottom.offset().top;
                        }
                    }

                    this.bottom = this.bottom ? this.bottom - this.$el.height() : this.bottom;

                    this.mediaInactive = this.media
                        && !(typeof(this.media) === 'number' && window.innerWidth >= this.media
                        || typeof(this.media) === 'string' && window.matchMedia(this.media).matches);
                }

                if ($(window).scrollTop() < 0 || !this.$el.is(':visible') || this.disabled) {
                    return;
                }

                var scroll = $(window).scrollTop();

                if (this.mediaInactive
                    || scroll < this.top
                    || this.showOnUp && (dir === 'down' || dir === 'up' && !isActive && scroll <= this.offsetTop + this.$el.height())
                ) {
                    if (isActive) {

                        Animation.cancel(this.$el);

                        this.$el.css({position: '', top: '', width: '', left: '', margin: ''})
                            .removeClass(this.clsActive)
                            .addClass(this.clsInactive)
                            .trigger('inactive');

                        this.placeholder.attr('hidden', true);

                    }

                    return;
                }

                this.placeholder.attr('hidden', false);

                var top = Math.max(0, this.offset);
                if (this.bottom && scroll > this.bottom) {
                    top = this.bottom - scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: top + 'px',
                    width: this.widthElement.width()
                });

                if (isActive) {
                    return;
                }

                if (this.animation) {
                    Animation.cancel(this.$el).in(this.$el, this.animation);
                }

                this.$el
                    .addClass(this.clsInit)
                    .addClass(this.clsActive)
                    .removeClass(this.clsInactive)
                    .trigger('active');

            },

            events: ['scroll', 'load', 'resize', 'orientationchange']

        }

    });

}
