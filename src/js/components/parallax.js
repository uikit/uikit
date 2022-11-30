import Resize from '../mixin/resize';
import Scroll from '../mixin/scroll';
import Parallax from '../mixin/parallax';
import { css, isVisible, parent, query, scrolledOver, toPx } from 'uikit-util';

export default {
    mixins: [Parallax, Resize, Scroll],

    props: {
        target: String,
        viewport: Number, // Deprecated
        easing: Number,
        start: String,
        end: String,
    },

    data: {
        target: false,
        viewport: 1,
        easing: 1,
        start: 0,
        end: 0,
    },

    computed: {
        target({ target }, $el) {
            return getOffsetElement((target && query(target, $el)) || $el);
        },

        start({ start }) {
            return toPx(start, 'height', this.target, true);
        },

        end({ end, viewport }) {
            return toPx(
                end || ((viewport = (1 - viewport) * 100) && `${viewport}vh+${viewport}%`),
                'height',
                this.target,
                true
            );
        },
    },

    resizeTargets() {
        return [this.$el, this.target];
    },

    update: {
        read({ percent }, types) {
            if (!types.has('scroll')) {
                percent = false;
            }

            if (!isVisible(this.$el)) {
                return false;
            }

            if (!this.matchMedia) {
                return;
            }

            const prev = percent;
            percent = ease(scrolledOver(this.target, this.start, this.end), this.easing);

            return {
                percent,
                style: prev === percent ? false : this.getCss(percent),
            };
        },

        write({ style }) {
            if (!this.matchMedia) {
                this.reset();
                return;
            }

            style && css(this.$el, style);
        },

        events: ['scroll', 'resize'],
    },
};

/*
 * Inspired by https://gist.github.com/gre/1650294?permalink_comment_id=3477425#gistcomment-3477425
 *
 * linear: 0
 * easeInSine: 0.5
 * easeOutSine: -0.5
 * easeInQuad: 1
 * easeOutQuad: -1
 * easeInCubic: 2
 * easeOutCubic: -2
 * easeInQuart: 3
 * easeOutQuart: -3
 * easeInQuint: 4
 * easeOutQuint: -4
 */
function ease(percent, easing) {
    return easing >= 0 ? Math.pow(percent, easing + 1) : 1 - Math.pow(1 - percent, 1 - easing);
}

// SVG elements do not inherit from HTMLElement
function getOffsetElement(el) {
    return el ? ('offsetTop' in el ? el : getOffsetElement(parent(el))) : document.documentElement;
}
