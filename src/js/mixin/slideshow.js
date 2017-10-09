function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$, $$, addClass, css, hasClass, removeClass, toggleClass, attr, doc, fastdom, getIndex, noop, off, on, pointerDown, pointerMove, pointerUp, preventClick, Promise, Transition, trigger} = UIkit.util;

    UIkit.mixin.slideshow = {

        attrs: true,

        props: {
            autoplay: Number,
            animation: String,
            transition: String,
            duration: Number
        },

        defaults: {
            autoplay: 0,
            animation: 'slide',
            transition: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
            duration: 500,
            index: 0,
            stack: [],
            threshold: 10,
            percent: 0,
            clsActive: 'uk-active'
        },

        computed: {

            list({clsList}, $el) {
                return $(`.${clsList}`, $el);
            },

            slides() {
                return $$(this.list.children);
            },

            forwardDuration({duration}) {
                return duration / 4;
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
                    return `.${this.clsList} > *`;
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

                var changed = trunc(this.percent) !== trunc(percent),
                    index = this.getIndex(this.index - trunc(percent)),
                    current = this.slides[index],
                    dir = percent < 0 ? 1 : -1,
                    nextIndex = getIndex(percent < 0 ? 'next' : 'previous', this.slides, index),
                    next = this.slides[nextIndex];

                this.slides.forEach((el, i) => toggleClass(el, this.clsActive, i === index || i === nextIndex));

                if (changed && this._animation) {
                    this._animation.reset();
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

                    if (this.percent < 0.2) {
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

                var hasPrev = hasClass(this.slides, 'uk-active'),
                    dir = index === 'next'
                        ? 1
                        : index === 'previous'
                            ? -1
                            : index < this.index
                                ? -1
                                : 1;

                index = this.getIndex(index);

                if (hasPrev && index === this.index) {
                    this.stack[force ? 'shift' : 'pop']();
                    return;
                }

                var prev = hasPrev && this.slides[this.index],
                    next = this.slides[index];

                trigger(this.$el, 'beforeitemshow', [this, next]);
                prev && trigger(this.$el, 'beforeitemhide', [this, prev]);

                this.index = index;

                addClass(next, this.clsActive);

                this._animation = new Transitioner(!prev ? 'scale' : this.animation, this.transition, prev || next, next, dir, () => {

                    prev && removeClass(prev, this.clsActive);

                    this.stack.shift();
                    if (this.stack.length) {
                        this.show(this.stack.shift(), true);
                    } else {
                        this._animation = null;
                    }

                    trigger(this.$el, 'itemshown', [this, next]);
                    UIkit.update(null, next);

                    if (prev) {
                        trigger(this.$el, 'itemhidden', [this, prev]);
                        UIkit.update(null, prev);
                    }

                });

                this._animation.show(this.stack.length > 1 ? this.forwardDuration : this.duration, this.percent);

                trigger(this.$el, 'itemshow', [this, next]);

                if (prev) {
                    trigger(this.$el, 'itemhide', [this, prev]);
                    UIkit.update(null, prev);
                }

                UIkit.update(null, next);
                fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
            },

            getIndex(index = this.index) {
                return getIndex(index, this.slides, this.index);
            },

            startAutoplay() {

                this.stopAutoplay();

                if (this.autoplay) {
                    this.interval = setInterval(() => !this.isHovering && this.show('next'), this.autoplay);
                }

            },

            stopAutoplay() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

        }

    };

    var diff = 0.2;
    var Animations = {

        fade: {

            show() {
                return [
                    {opacity: 0},
                    {opacity: 1}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent},
                    {opacity: percent}
                ];
            }

        },

        slide: {

            show(dir) {
                return [
                    {transform: translate3d(dir * -100)},
                    {transform: translate3d()}
                ];
            },

            percent(current) {
                return Math.abs(css(current, 'transform').split(',')[4] / current.offsetWidth);
            },

            translate(percent, dir) {
                return [
                    {transform: translate3d(dir * -100 * percent)},
                    {transform: translate3d(dir * 100 * (1 - percent))}
                ];
            }

        },

        scale: {

            show() {
                return [
                    {opacity: 0, transform: scale3d(1 - diff)},
                    {opacity: 1, transform: scale3d(1)}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                return [
                    {opacity: 1 - percent, transform: scale3d(1 - diff * percent)},
                    {opacity: percent, transform: scale3d(1 - diff + diff * percent)}
                ];
            }

        },

        swipe: {

            show(dir) {

                return dir < 0
                    ? [
                        {opacity: 1, transform: translate3d(100), zIndex: 0},
                        {opacity: 1, transform: `${scale3d(1)} ${translate3d()}`, zIndex: -1},
                    ]
                    : [
                        {opacity: 0.3, transform: `${scale3d(1 - diff)} ${translate3d(-20)}`, zIndex: -1},
                        {opacity: 1, transform: translate3d(), zIndex: 0}
                    ];
            },

            percent(current, next, dir) {

                var el = dir < 0 ? current : next,
                    percent = Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth);

                return dir < 0 ? percent : 1 - percent;
            },

            translate(percent, dir) {
                return dir < 0
                    ? [
                        {opacity: 1, transform: translate3d(100 * percent), zIndex: 0},
                        {opacity: 0.3 + 0.7 * percent, transform: `${scale3d(1 - diff * (1 - percent))} ${translate3d(-20 * (1 - percent))}`, zIndex: -1},
                    ]
                    : [
                        {opacity: 1 - 0.7 * percent, transform: `${scale3d(1 - diff * percent)} ${translate3d(-20 * percent)}`, zIndex: -1},
                        {opacity: 1, transform: translate3d(100 * (1 - percent)), zIndex: 0}
                    ];
            }

        }

    };

    function Transitioner(animation, transition, current, next, dir, cb) {

        var {percent, translate, show} = animation in Animations ? Animations[animation] : Animations.slide;

        var props = show(dir);

        return {

            animation,
            dir,
            current,
            next,

            show(duration, percent = 0, linear = false) {

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
                return Promise.all([
                    Transition.stop(next),
                    Transition.stop(current)
                ]);
            },

            cancel() {
                Transition.cancel(next);
                Transition.cancel(current);
            },

            reset() {
                for (var prop in props[0]) {
                    css([next, current], prop, '');
                }
            },

            forward(duration) {

                var percent = this.percent();

                Transition.cancel(next);
                Transition.cancel(current);

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

    function scale3d(value) {
        return `scale3d(${value}, ${value}, 1)`;
    }

    function translate3d(value = 0) {
        return `translate3d(${value}${value ? '%' : ''}, 0, 0)`;
    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
        return ~~x;
    }

}

export default plugin;
