import $ from 'jquery';
import {Animation, isInView, toJQuery, requestAnimationFrame} from '../util/index';

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
            widthElement: String,
            showOnUp: Boolean,
            media: Number,
            target: Number,
            disabled: Boolean
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
            target: false,
            disabled: false
        },

        ready() {

            this.placeholder = $('<div class="uk-sticky-placeholder"></div>')
                .insertAfter(this.$el)
                .css({
                    height: this.$el.css('position') !== 'absolute' ? this.$el.outerHeight() : '',
                    margin: this.$el.css('margin')
                }).attr('hidden', true);

            this.widthElement = toJQuery(this.widthElement) || this.placeholder;
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

            handler(e) {

                var isActive = this.$el.hasClass(this.clsActive);

                if (e.type !== 'scroll') {

                    this.offsetTop = (isActive ? this.placeholder.offset() : this.$el.offset()).top;

                    this.top = this.topProp;

                    if (this.topProp && typeof(this.topProp) === 'string') {
                        if (this.topProp.match(/^-?\d+vh$/)) {
                            this.top = window.innerHeight * parseInt(this.topProp, 10) / 100;
                        } else {
                            var el = toJQuery(this.topProp);
                            if (el) {
                                this.top = el[0].offsetTop + el[0].offsetHeight;
                            }
                        }
                    }

                    this.top = Math.max(parseInt(this.top, 10), this.offsetTop);

                    var bottom = false;

                    if (this.bottomProp === true || this.bottomProp[0] === '!') {
                        bottom = this.bottomProp === true ? this.$el.parent() : this.$el.closest(this.bottomProp.substr(1));
                        bottom = bottom.offset().top + bottom.height() + parseInt(bottom.css('padding-top'), 10);
                    } else if (typeof this.bottomProp === 'string') {
                        bottom = toJQuery(this.bottomProp);
                        if (bottom) {
                            bottom = bottom.offset().top;
                        }
                    }

                    this.bottom = bottom ? bottom - this.$el.height() : bottom;

                    this.mediaActive = !this.media
                        || typeof(this.media) === 'number' && window.innerWidth >= this.media
                        || typeof(this.media) === 'string' && window.matchMedia(this.media).matches;
                }

                if ($(window).scrollTop() < 0 || !this.$el.is(':visible') || this.disabled) {
                    return;
                }

                var scroll = $(window).scrollTop();

                if (!(this.mediaActive
                    && scroll >= this.top - this.offset
                    && !(this.showOnUp && (e.dir === 'down' || e.dir === 'up' && !isActive && scroll <= this.offsetTop + this.$el.height())))
                ) {
                    if (isActive) {
                        this.reset();
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

            events: ['scroll', 'resize', 'orientationchange']

        },

        methods: {

            reset() {

                Animation.cancel(this.$el);

                this.$el.css({position: '', top: '', width: '', left: '', margin: ''})
                    .removeClass(this.clsActive)
                    .addClass(this.clsInactive)
                    .trigger('inactive');

                this.placeholder.attr('hidden', true);

            },

            enable: function () {
                this.disabled = false;
                this.update();
            },

            disable: function () {
                this.disabled = true;
                this.reset();
            }

        }

    });

}
