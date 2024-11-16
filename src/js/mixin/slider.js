import {
    $,
    addClass,
    children,
    clamp,
    getIndex,
    hasClass,
    isNumber,
    isRtl,
    removeClass,
    trigger,
} from 'uikit-util';
import I18n from './i18n';
import SliderAutoplay from './slider-autoplay';
import SliderDrag from './slider-drag';
import SliderNav from './slider-nav';

const easeOutQuad = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const easeOutQuart = 'cubic-bezier(0.165, 0.84, 0.44, 1)';

export default {
    mixins: [SliderAutoplay, SliderDrag, SliderNav, I18n],

    props: {
        clsActivated: String,
        easing: String,
        index: Number,
        finite: Boolean,
        velocity: Number,
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
        clsActivated: '',
        clsEnter: 'uk-slide-enter',
        clsLeave: 'uk-slide-leave',
        clsSlideActive: 'uk-slide-active',
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
        duration: ({ velocity }, $el) => speedUp($el.offsetWidth / velocity),

        list: ({ selList }, $el) => $(selList, $el),

        maxIndex() {
            return this.length - 1;
        },

        slides() {
            return children(this.list);
        },

        length() {
            return this.slides.length;
        },
    },

    watch: {
        slides(slides, prev) {
            if (prev) {
                this.$emit();
            }
        },
    },

    events: {
        itemshow({ target }) {
            addClass(target, this.clsEnter, this.clsSlideActive);
        },

        itemshown({ target }) {
            removeClass(target, this.clsEnter);
        },

        itemhide({ target }) {
            addClass(target, this.clsLeave);
        },

        itemhidden({ target }) {
            removeClass(target, this.clsLeave, this.clsSlideActive);
        },
    },

    methods: {
        async show(index, force = false) {
            if (this.dragging || !this.length || this.parallax) {
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
                    this._transitioner?.forward(Math.min(this.duration, 200));
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

            prev && trigger(prev, 'itemhide', [this]);
            trigger(next, 'itemshow', [this]);

            await this._show(prev, next, force);

            prev && trigger(prev, 'itemhidden', [this]);
            trigger(next, 'itemshown', [this]);

            stack.shift();
            this._transitioner = null;

            if (stack.length) {
                requestAnimationFrame(() => stack.length && this.show(stack.shift(), true));
            }
        },

        getIndex(index = this.index, prev = this.index) {
            return clamp(
                getIndex(index, this.slides, prev, this.finite),
                0,
                Math.max(0, this.maxIndex),
            );
        },

        getValidIndex(index = this.index, prevIndex = this.prevIndex) {
            return this.getIndex(index, prevIndex);
        },

        async _show(prev, next, force) {
            this._transitioner = this._getTransitioner(prev, next, this.dir, {
                easing: force ? (next.offsetWidth < 600 ? easeOutQuad : easeOutQuart) : this.easing,
                ...this.transitionOptions,
            });

            if (!force && !prev) {
                this._translate(1);
                return;
            }

            const { length } = this.stack;
            return this._transitioner[length > 1 ? 'forward' : 'show'](
                length > 1 ? Math.min(this.duration, 75 + 75 / (length - 1)) : this.duration,
                this.percent,
            );
        },

        _translate(percent, prev = this.prevIndex, next = this.index) {
            const transitioner = this._getTransitioner(prev === next ? false : prev, next);
            transitioner.translate(percent);
            return transitioner;
        },

        _getTransitioner(
            prev = this.prevIndex,
            next = this.index,
            dir = this.dir || 1,
            options = this.transitionOptions,
        ) {
            return new this.Transitioner(
                isNumber(prev) ? this.slides[prev] : prev,
                isNumber(next) ? this.slides[next] : next,
                dir * (isRtl ? -1 : 1),
                options,
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
