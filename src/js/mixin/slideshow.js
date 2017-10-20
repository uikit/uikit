import Animations from './internal/slideshow-animations';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    var {$$, $, addClass, assign, attr, createEvent, css, doc, endsWith, fastdom, getIndex, hasClass, index, isTouch, noop, off, on, pointerDown, pointerMove, pointerUp, preventClick, Promise, removeClass, toggleClass, Transition, trigger} = UIkit.util;

    UIkit.mixin.slideshow = {

        attrs: true,

        props: {
            autoplay: Boolean,
            autoplayInterval: Number,
            pauseOnHover: Boolean,
            animation: String,
            easing: String,
            velocity: Number
        },

        defaults: {
            autoplay: false,
            autoplayInterval: 7000,
            pauseOnHover: true,
            animation: 'slide',
            easing: 'ease',
            velocity: 1,
            index: 0,
            stack: [],
            threshold: 10,
            percent: 0,
            clsActive: 'uk-active',
            clsActivated: 'uk-transition-active',
            forwardDuration: 150,
            initialAnimation: false,
            Animations: Animations(UIkit)
        },

        computed: {

            list({selList}, $el) {
                return $(selList, $el);
            },

            slides() {
                return $$(this.list.children);
            },

            animation({animation, Animations}) {
                return assign(animation in Animations ? Animations[animation] : Animations.slide, {name: animation});
            },

            duration({velocity}, $el) {
                return speedUp($el.offsetWidth / velocity);
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

        update: [

            {

                read() {
                    delete this._computeds.duration;
                },

                events: ['load', 'resize']

            }

        ],

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

                delegate() {
                    return `${this.selList} > *`;
                },

                handler({target}) {
                    addClass(target, this.clsActive);
                }

            },

            {

                name: 'itemshown',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler({target}) {
                    addClass(target, this.clsActivated);
                }

            },

            {

                name: 'itemshow itemhide',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler({type, target}) {
                    toggleClass($$(`[${this.attrItem}="${index(target)}"]`, this.$el), this.clsActive, endsWith(type, 'show'));
                }

            },

            {

                name: 'itemhidden',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler({target}) {
                    removeClass(target, this.clsActive);
                    removeClass(target, this.clsActivated);
                }

            },

            {

                name: 'itemshow itemhide itemshown itemhidden',

                self: true,

                delegate() {
                    return `${this.selList} > *`;
                },

                handler({target}) {
                    UIkit.update(null, target);
                }

            }

        ],

        methods: {

            start(e) {

                if (e.button && e.button !== 0 || this.slides.length < 2) {
                    return;
                }

                if (!isTouch(e)) {
                    e.preventDefault();
                }

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

            move() {

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
                    trigger(this.slides[prevIndex], 'itemhide', [this]);
                    trigger(current, 'itemshow', [this]);
                }

                this._animation = new Transitioner(this.animation, this.easing, current, next, dir, noop);
                this._animation.translate(Math.abs(percent % 1));

                this.percent = percent;

                UIkit.update(null, current);
                UIkit.update(null, next);
            },

            end() {

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

                var prevIndex = this.index,
                    nextIndex = this.getIndex(index),
                    prev = hasClass(this.slides, 'uk-active') && this.slides[prevIndex],
                    next = this.slides[nextIndex];

                if (prev === next) {
                    this.stack[force ? 'shift' : 'pop']();
                    return;
                }

                prev && trigger(prev, 'beforeitemhide', [this]);
                trigger(next, 'beforeitemshow', [this]);

                this.index = nextIndex;

                var done = () => {

                    prev && trigger(prev, 'itemhidden', [this]);
                    trigger(next, 'itemshown', [this]);

                    fastdom.mutate(() => {
                        this.stack.shift();
                        if (this.stack.length) {
                            this.show(this.stack.shift(), true)
                        } else {
                            this._animation = null;
                        }
                    });
                };

                if (prev || this.initialAnimation) {

                    this._show(
                        !prev ? this.Animations[this.initialAnimation] : this.animation,
                        force ? 'cubic-bezier(0.165, 0.840, 0.440, 1.000)' : this.easing,
                        prev || next,
                        next,
                        getDirection(index, prevIndex),
                        this.stack.length > 1,
                        done
                    );

                }

                prev && trigger(prev, 'itemhide', [this]);
                trigger(next, 'itemshow', [this]);

                if (!prev && !this.initialAnimation) {
                    done();
                }

                prev && fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler

            },

            _show(animation, easing, prev, next, dir, forward, done) {

                this._animation = new Transitioner(
                    animation,
                    easing,
                    prev,
                    next,
                    dir,
                    done
                );

                this._animation.show(prev === next
                    ? 300
                    : forward
                        ? this.forwardDuration
                        : this.duration
                    , this.percent, forward
                );

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

    function Transitioner(animation, easing, current, next, dir, cb) {

        var {percent, translate, show} = animation;
        var props = show(dir);

        return {

            animation,
            dir,
            current,
            next,

            show(duration, percent = 0, linear) {

                var ease = linear ? 'linear' : easing;
                duration -= Math.round(duration * percent);

                this.translate(percent);

                triggerUpdate(current, 'itemout', {percent: 1 - percent, duration, ease, dir});
                triggerUpdate(next, 'itemin', {percent, duration, ease, dir});

                return Promise.all([
                    Transition.start(current, props[0], duration, ease),
                    Transition.start(next, props[1], duration, ease)
                ]).then(() => {
                    this.reset();
                    cb();
                }, noop);
            },

            stop() {
                return Transition.stop([current, next]);
            },

            cancel() {
                Transition.cancel([current, next]);
            },

            reset() {
                for (var prop in props[0]) {
                    css([current, next], prop, '');
                }
            },

            forward(duration) {

                var percent = this.percent();
                Transition.cancel([current, next]);
                this.show(duration, percent, true);

            },

            translate(percent) {

                var props = translate(percent, dir);
                css(current, props[0]);
                css(next, props[1]);
                triggerUpdate(current, 'itemtranslateout', {percent: 1 - percent, dir});
                triggerUpdate(next, 'itemtranslatein', {percent, dir});
            },

            percent() {
                return percent(current, next, dir);
            }

        }

    }

    function triggerUpdate(el, type, data) {
        trigger(el, createEvent(type, false, false, data));
    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
        return ~~x;
    }

    function getDirection(index, prevIndex) {
        return index === 'next'
            ? 1
            : index === 'previous'
                ? -1
                : index < prevIndex
                    ? -1
                    : 1;
    }

    function speedUp(x) {
        return .5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
    }

}

export default plugin;
