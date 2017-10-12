function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$$, $, addClass, assign, attr, css, doc, endsWith, fastdom, getIndex, hasClass, index, noop, off, on, pointerDown, pointerMove, pointerUp, preventClick, Promise, removeClass, toggleClass, Transition, trigger} = UIkit.util;

    var Animations = {

        slide: {

            show(dir) {
                return [
                    {transform: translate3d(dir * -100)},
                    {transform: translate3d()}
                ];
            },

            percent(current) {
                return Animations.translated(current);
            },

            translate(percent, dir) {
                return [
                    {transform: translate3d(dir * -100 * percent)},
                    {transform: translate3d(dir * 100 * (1 - percent))}
                ];
            }

        },

        translated(el) {
            return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth)
        }

    };

    UIkit.mixin.slideshow = {

        attrs: true,

        props: {
            autoplay: Boolean,
            autoplayInterval: Number,
            pauseOnHover: Boolean,
            animation: String,
            transition: String,
            duration: Number
        },

        defaults: {
            autoplay: false,
            autoplayInterval: 7000,
            pauseOnHover: true,
            animation: 'slide',
            transition: 'ease',
            duration: 600,
            index: 0,
            stack: [],
            threshold: 10,
            percent: 0,
            clsActive: 'uk-active',
            forwardDuration: 150,
            initialAnimation: false,
            Animations
        },

        computed: {

            list({selList}, $el) {
                return $(selList, $el);
            },

            slides() {
                return $$(this.list.children);
            },

            animation({animation}) {
                return assign(animation in this.Animations ? this.Animations[animation] : this.Animations.slide, {name: animation});
            }

        },

        init() {
            ['start', 'move', 'end'].forEach(key => {
                var fn = this[key];
                this[key] = e => {

                    this.prevPos = this.pos;
                    this.pos = (e.touches && e.touches[0] || e).pageX;

                    fn(e);
                }
            });
        },

        connected() {
            this.startAutoplay();
        },

        disconnected() {
            this.stopAutoplay();
        },

        events: [

            {

                name: 'click',

                delegate() {
                    return `[${this.attrItem}]`;
                },

                handler(e) {
                    e.preventDefault();
                    e.current.blur();
                    this.show(attr(e.current, this.attrItem));
                }

            },

            {

                name: pointerDown,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler: 'start'

            },

            {

                name: pointerDown,
                handler: 'stopAutoplay'

            },

            {

                name: 'mouseenter',

                filter() {
                    return this.autoplay;
                },

                handler() {
                    this.isHovering = true;
                }

            },

            {

                name: 'mouseleave',

                filter() {
                    return this.autoplay;
                },

                handler() {
                    this.isHovering = false;
                }

            },

            {

                name: 'beforeitemshow',

                self: true,

                handler(e, _, el) {
                    addClass(el, this.clsActive);
                }

            },

            {

                name: 'itemshow itemhide',

                self: true,

                handler({type}, _, el) {
                    toggleClass($$(`[${this.attrItem}="${index(el)}"]`, this.$el), this.clsActive, endsWith(type, 'show'));
                }

            },

            {

                name: 'itemhidden',

                self: true,

                handler(e, _, el) {
                    removeClass(el, this.clsActive);
                }

            },

            {

                name: 'itemshow itemhide itemshown itemhidden',

                self: true,

                handler(e, _, el) {
                    UIkit.update(null, el);
                }

            }

        ],

        methods: {

            start(e) {

                if (e.button && e.button !== 0 || this.slides.length < 2) {
                    return;
                }

                e.preventDefault();

                if (this._animation && this._animation.animation !== this.animation) {
                    return;
                }

                var percent = 0;
                if (this.stack.length) {

                    var {dir, percent: getPercent, cancel, translate} = this._animation;

                    percent = getPercent() * dir;

                    this.percent = Math.abs(percent) * -dir;

                    this.stack.splice(0, this.stack.length);

                    cancel();
                    translate(Math.abs(percent));

                    this.index = this.getIndex(this.index - dir);
                    this.touching = true;

                }

                on(doc, pointerMove, this.move, true);
                on(doc, pointerUp, this.end, true);

                this.touch = this.pos + this.$el.offsetWidth * percent;

            },

            move(e) {

                e.preventDefault();

                if (this.pos === this.prevPos || (!this.touching && Math.abs(this.touch - this.pos) < this.threshold)) {
                    return;
                }

                this.touching = true;

                var percent = (this.pos - this.touch) / this.$el.offsetWidth;

                if (this.percent === percent) {
                    return;
                }

                var prevIndex = this.getIndex(this.index - trunc(this.percent)),
                    index = this.getIndex(this.index - trunc(percent)),
                    current = this.slides[index],
                    dir = percent < 0 ? 1 : -1,
                    nextIndex = getIndex(percent < 0 ? 'next' : 'previous', this.slides, index),
                    next = this.slides[nextIndex];

                this.slides.forEach((el, i) => toggleClass(el, this.clsActive, i === index || i === nextIndex));

                if (index !== prevIndex) {
                    this._animation && this._animation.reset();
                    trigger(this.$el, 'itemhide', [this, this.slides[prevIndex]]);
                    trigger(this.$el, 'itemshow', [this, current]);
                }

                this._animation = new Transitioner(this.animation, this.transition, current, next, dir, noop);
                this._animation.translate(Math.abs(percent % 1));

                this.percent = percent;

                UIkit.update(null, current);
                UIkit.update(null, next);
            },

            end(e) {

                e.preventDefault();

                off(doc, pointerMove, this.move, true);
                off(doc, pointerUp, this.end, true);

                if (this.touching) {

                    var percent = this.percent;

                    this.percent = Math.abs(this.percent) % 1;
                    this.index = this.getIndex(this.index - trunc(percent));

                    if (this.percent < .1) {
                        this.index = this.getIndex(percent > 0 ? 'previous' : 'next');
                        this.percent = 1 - this.percent;
                        percent *= -1;
                    }

                    this.show(percent > 0 ? 'previous' : 'next', true);

                    preventClick();

                }

                this.pos
                    = this.prevPos
                    = this.touch
                    = this.touching
                    = this.percent
                    = null;

            },

            show(index, force = false) {

                if (!force && this.touch) {
                    return;
                }

                this.stack[force ? 'unshift' : 'push'](index);

                if (!force && this.stack.length > 1) {

                    if (this.stack.length === 2) {
                        this._animation.forward(this.forwardDuration);
                    }

                    return;
                }

                var dir = index === 'next'
                        ? 1
                        : index === 'previous'
                            ? -1
                            : index < this.index
                                ? -1
                                : 1;

                index = this.getIndex(index);

                var prev = hasClass(this.slides, 'uk-active') && this.slides[this.index],
                    next = this.slides[index];

                if (prev && index === this.index) {
                    this.stack[force ? 'shift' : 'pop']();
                    return;
                }

                prev && trigger(this.$el, 'beforeitemhide', [this, prev]);
                trigger(this.$el, 'beforeitemshow', [this, next]);

                this.index = index;

                var done = () => {

                    prev && trigger(this.$el, 'itemhidden', [this, prev]);
                    trigger(this.$el, 'itemshown', [this, next]);

                    this.stack.shift();
                    if (this.stack.length) {
                        this.show(this.stack.shift(), true);
                    } else {
                        this._animation = null;
                    }
                };

                if (prev || this.initialAnimation) {

                    this._animation = new Transitioner(
                        !prev ? this.Animations[this.initialAnimation] : this.animation,
                        force ? 'cubic-bezier(0.165, 0.840, 0.440, 1.000)' : this.transition,
                        prev || next,
                        next,
                        dir,
                        done
                    );

                    this._animation.show(this.stack.length > 1 ? this.forwardDuration : this.duration, this.percent);

                } else {

                    done();

                }

                prev && trigger(this.$el, 'itemhide', [this, prev]);
                trigger(this.$el, 'itemshow', [this, next]);

                fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler

            },

            getIndex(index = this.index) {
                return getIndex(index, this.slides, this.index);
            },

            startAutoplay() {

                this.stopAutoplay();

                if (this.autoplay) {
                    this.interval = setInterval(() => (!this.isHovering || ! this.pauseOnHover) && this.show('next'), this.autoplayInterval);
                }

            },

            stopAutoplay() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

        }

    };

    function Transitioner(animation, transition, current, next, dir, cb) {

        var {percent, translate, show} = animation;
        var props = show(dir);

        return {

            animation,
            dir,
            current,
            next,

            show(duration, percent = 0, linear) {

                var easing = linear ? 'linear' : transition;
                duration -= Math.round(duration * percent);

                this.translate(percent);

                return Promise.all([
                    Transition.start(current, props[0], duration, easing),
                    Transition.start(next, props[1], duration, easing)
                ]).then(() => {
                    this.reset();
                    cb();
                }, noop);
            },

            stop() {
                return Transition.stop([next, current]);
            },

            cancel() {
                Transition.cancel([next, current]);
            },

            reset() {
                for (var prop in props[0]) {
                    css([next, current], prop, '');
                }
            },

            forward(duration) {

                var percent = this.percent();
                Transition.cancel([next, current]);
                this.show(duration, percent, true);

            },

            translate(percent) {

                var props = translate(percent, dir);
                css(current, props[0]);
                css(next, props[1]);

            },

            percent() {
                return percent(current, next, dir);
            }

        }

    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
        return ~~x;
    }

}

export default plugin;

export function translate3d(value = 0) {
    return `translate3d(${value}${value ? '%' : ''}, 0, 0)`;
}

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}
