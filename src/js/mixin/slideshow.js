function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {addClass, css, filter, hasClass, removeClass, toggleClass, $, attr, doc, fastdom, getIndex, noop, off, on, pointerDown, pointerMove, pointerUp, preventClick, Promise, requestAnimationFrame, Transition, trigger} = UIkit.util;

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
            transition: 'linear',
            duration: 400,
            index: 0,
            stack: [],
            threshold: 10,
            percent: 0,
            clsActive: 'uk-active'
        },

        computed: {

            slides({clsItem}) {
                return filter(this.list.children, `.${clsItem}`);
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
                    return `.${this.clsItem}`;
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

                var percent = 0;
                if (this.stack.length) {

                    this.percent = this._animation.percent();

                    var dir = this._animation.dir;
                    percent = this.percent * dir;

                    this.stack.splice(0, this.stack.length);

                    this._animation.cancel();
                    this._animation.translate(Math.abs(percent));

                    this.index = this.getIndex(this.index - dir);
                    this.touching = true;
                }

                on(doc, pointerMove, this.move, true);
                on(doc, pointerUp, this.end, true);

                var el = this.slides[this.index];

                this.touch = {
                    el,
                    start: this.pos + (percent ? el.offsetWidth * percent : 0)
                }

            },

            move(e) {

                e.preventDefault();

                var {start, el} = this.touch;

                if (this.pos === this.prevPos || (!this.touching && Math.abs(start - this.pos) < this.threshold)) {
                    return;
                }

                this.touching = true;

                var percent = (this.pos - start) / el.offsetWidth;

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
                        requestAnimationFrame(() => this.show(this.stack.shift(), true));
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
                    {transform: `translate3d(${dir * -100}%, 0, 0)`},
                    {transform: 'translate3d(0, 0, 0)'}
                ];
            },

            percent(current) {
                return Math.abs(css(current, 'transform').split(',')[4] / current.offsetWidth);
            },

            translate(percent, dir) {
                return [
                    {transform: `translate3d(${dir * -100 * percent}%, 0, 0)`},
                    {transform: `translate3d(${dir * 100 * (1 - percent)}%, 0, 0)`}
                ];
            }

        },

        scale: {

            show() {
                return [
                    {opacity: 0, transform: `scale3d(${1 - diff}, ${1 - diff}, 1)`},
                    {opacity: 1, transform: 'scale3d(1, 1, 1)'}
                ];
            },

            percent(current) {
                return 1 - css(current, 'opacity');
            },

            translate(percent) {
                var scale1 = 1 - diff * percent,
                    scale2 = 1 - diff + diff * percent;

                return [
                    {opacity: 1 - percent, transform: `scale3d(${scale1}, ${scale1}, 1)`},
                    {opacity: percent, transform: `scale3d(${scale2}, ${scale2}, 1)`}
                ];
            }

        },

        swipe: {

            show(dir) {

                if (dir < 0) {
                    return [
                        {opacity: 1, transform: `translate3d(100%, 0, 0)`, zIndex: 0},
                        {opacity: 1, transform: `scale3d(1, 1, 1) translate3d(0, 0, 0)`, zIndex: -1},
                    ];
                } else {
                    return [
                        {opacity: 0.3, transform: `scale3d(${1 - diff}, ${1 - diff}, 1) translate3d(-20%, 0, 0)`, zIndex: -1},
                        {opacity: 1, transform: 'translate3d(0, 0, 0)', zIndex: 0}
                    ];
                }


            },

            percent(current, next, dir) {

                var el = dir < 0 ? current : next,
                    percent = Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth);

                return dir < 0 ? percent : 1 - percent;
            },

            translate(percent, dir) {
                var scale;

                if (dir < 0) {
                    scale = 1 - diff * (1 - percent);
                    return [
                        {opacity: 1, transform: `translate3d(${100 * percent}%, 0, 0)`, zIndex: 0},
                        {opacity: 0.3 + 0.7 * percent, transform: `scale3d(${scale}, ${scale}, 1) translate3d(${-20 * (1 - percent)}%, 0, 0)`, zIndex: -1},
                    ];
                } else {
                    scale = 1 - diff * percent;
                    return [
                        {opacity: 1 - 0.7 * percent, transform: `scale3d(${scale}, ${scale}, 1) translate3d(${-20 * percent}%, 0, 0)`, zIndex: -1},
                        {opacity: 1, transform: `translate3d(${100 * (1 - percent)}%, 0, 0)`, zIndex: 0}
                    ];
                }

            }

        },

    };

    function Transitioner(animation, transition, current, next, dir, cb) {

        animation = animation in Animations ? Animations[animation] : Animations.slide;

        var props = animation.show(dir);

        return {

            dir,
            current,
            next,

            show(duration, percent = 0) {

                duration -= Math.round(duration * percent);

                this.translate(percent);

                return Promise.all([
                    Transition.start(current, props[0], duration, transition),
                    Transition.start(next, props[1], duration, transition)
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
                return Promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]);
            },

            reset() {
                for (var prop in props[0]) {
                    css([next, current[0]], prop, '');
                }
            },

            forward(duration) {

                var percent = this.percent();

                return Promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]).then(() => this.show(duration, percent));

            },

            translate(percent) {

                var props = animation.translate(percent, dir);
                css(current, props[0]);
                css(next, props[1]);

            },

            percent() {
                return animation.percent(current, next, dir);
            }

        }

    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
        return ~~x;
    }

}

export default plugin;
