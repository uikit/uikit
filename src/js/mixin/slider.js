import Resize from './resize';
import SliderAutoplay from './slider-autoplay';
import SliderDrag from './slider-drag';
import SliderNav from './slider-nav';
import {
    $,
    $$,
    clamp,
    fastdom,
    getIndex,
    hasClass,
    isNumber,
    isRtl,
    removeClass,
    trigger,
} from 'uikit-util';

export default {
    mixins: [SliderAutoplay, SliderDrag, SliderNav, Resize],

    props: {
        clsActivated: Boolean,
        easing: String,
        index: Number,
        finite: Boolean,
        velocity: Number,
        selSlides: String,
    },

    data: () => ({
        easing: 'ease',
        finite: false,
        velocity: 1,
        index: 0,
        prevIndex: -1,
        stack: [],
        percent: 0,
        clsActive: 'uk-active',
        clsActivated: false,
        Transitioner: false,
        transitionOptions: {},
    }),

    connected() {
        this.prevIndex = -1;
        this.index = this.getValidIndex(this.$props.index);
        this.stack = [];
    },

    disconnected() {
        removeClass(this.slides, this.clsActive);
    },

    computed: {
        duration({ velocity }, $el) {
            return speedUp($el.offsetWidth / velocity);
        },

        list({ selList }, $el) {
            return $(selList, $el);
        },

        maxIndex() {
            return this.length - 1;
        },

        selSlides({ selList, selSlides }) {
            return `${selList} ${selSlides || '> *'}`;
        },

        slides: {
            get() {
                return $$(this.selSlides, this.$el);
            },

            watch() {
                this.$reset();
            },
        },

        length() {
            return this.slides.length;
        },
    },

    methods: {
        show(index, force = false) {
            if (this.dragging || !this.length) {
                return;
            }

            const { stack } = this;
            const queueIndex = force ? 0 : stack.length;
            const reset = () => {
                stack.splice(queueIndex, 1);

                if (stack.length) {
                    this.show(stack.shift(), true);
                }
            };

            stack[force ? 'unshift' : 'push'](index);

            if (!force && stack.length > 1) {
                if (stack.length === 2) {
                    this._transitioner.forward(Math.min(this.duration, 200));
                }

                return;
            }

            const prevIndex = this.getIndex(this.index);
            const prev = hasClass(this.slides, this.clsActive) && this.slides[prevIndex];
            const nextIndex = this.getIndex(index, this.index);
            const next = this.slides[nextIndex];

            if (prev === next) {
                reset();
                return;
            }

            this.dir = getDirection(index, prevIndex);
            this.prevIndex = prevIndex;
            this.index = nextIndex;

            if (
                (prev && !trigger(prev, 'beforeitemhide', [this])) ||
                !trigger(next, 'beforeitemshow', [this, prev])
            ) {
                this.index = this.prevIndex;
                reset();
                return;
            }

            const promise = this._show(prev, next, force).then(() => {
                prev && trigger(prev, 'itemhidden', [this]);
                trigger(next, 'itemshown', [this]);

                return new Promise((resolve) => {
                    fastdom.write(() => {
                        stack.shift();
                        if (stack.length) {
                            this.show(stack.shift(), true);
                        } else {
                            this._transitioner = null;
                        }
                        resolve();
                    });
                });
            });

            prev && trigger(prev, 'itemhide', [this]);
            trigger(next, 'itemshow', [this]);

            return promise;
        },

        getIndex(index = this.index, prev = this.index) {
            return clamp(getIndex(index, this.slides, prev, this.finite), 0, this.maxIndex);
        },

        getValidIndex(index = this.index, prevIndex = this.prevIndex) {
            return this.getIndex(index, prevIndex);
        },

        _show(prev, next, force) {
            this._transitioner = this._getTransitioner(prev, next, this.dir, {
                easing: force
                    ? next.offsetWidth < 600
                        ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' /* easeOutQuad */
                        : 'cubic-bezier(0.165, 0.84, 0.44, 1)' /* easeOutQuart */
                    : this.easing,
                ...this.transitionOptions,
            });

            if (!force && !prev) {
                this._translate(1);
                return Promise.resolve();
            }

            const { length } = this.stack;
            return this._transitioner[length > 1 ? 'forward' : 'show'](
                length > 1 ? Math.min(this.duration, 75 + 75 / (length - 1)) : this.duration,
                this.percent
            );
        },

        _getDistance(prev, next) {
            return this._getTransitioner(prev, prev !== next && next).getDistance();
        },

        _translate(percent, prev = this.prevIndex, next = this.index) {
            const transitioner = this._getTransitioner(prev !== next ? prev : false, next);
            transitioner.translate(percent);
            return transitioner;
        },

        _getTransitioner(
            prev = this.prevIndex,
            next = this.index,
            dir = this.dir || 1,
            options = this.transitionOptions
        ) {
            return new this.Transitioner(
                isNumber(prev) ? this.slides[prev] : prev,
                isNumber(next) ? this.slides[next] : next,
                dir * (isRtl ? -1 : 1),
                options
            );
        },
    },
};

function getDirection(index, prevIndex) {
    return index === 'next' ? 1 : index === 'previous' ? -1 : index < prevIndex ? -1 : 1;
}

export function speedUp(x) {
    return 0.5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
}
