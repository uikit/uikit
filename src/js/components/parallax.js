import Parallax from '../mixin/parallax';
import {css, parent, query, scrolledOver, toPx} from 'uikit-util';

export default {

    mixins: [Parallax],

    props: {
        target: String,
        viewport: Number, // Deprecated
        easing: Number,
        start: String,
        end: String
    },

    data: {
        target: false,
        viewport: 1,
        easing: 1,
        start: 0,
        end: 0
    },

    computed: {

        target({target}, $el) {
            return getOffsetElement(target && query(target, $el) || $el);
        },

        start({start}) {
            return parseCalc(start, this.target);
        },

        end({end, viewport}) {
            return parseCalc(
                end || (viewport = (1 - viewport) * 100) && `${viewport}vh+${viewport}%`,
                this.target
            );
        }

    },

    update: {

        read({percent}, types) {

            if (!types.has('scroll')) {
                percent = false;
            }

            if (!this.matchMedia) {
                return;
            }

            const prev = percent;
            percent = ease(scrolledOver(this.target, this.start, this.end), this.easing);

            return {
                percent,
                style: prev === percent ? false : this.getCss(percent)
            };
        },

        write({style}) {

            if (!this.matchMedia) {
                this.reset();
                return;
            }

            style && css(this.$el, style);

        },

        events: ['scroll', 'resize']
    }

};

const calcRe = /-?\d+(?:\.\d+)?(?:v[wh]|%|px)?/g;
function parseCalc(calc, el) {
    let match;
    let result = 0;
    calc = calc.toString().replace(/\s/g, '');
    calcRe.lastIndex = 0;
    while ((match = calcRe.exec(calc)) !== null) {
        result += toPx(match[0], 'height', el, true);
    }

    return result;
}

function ease(percent, easing) {
    return easing >= 0
        ? Math.pow(percent, easing + 1)
        : 1 - Math.pow(1 - percent, -easing + 1);
}

// SVG elements do not inherit from HTMLElement
function getOffsetElement(el) {
    return el
        ? 'offsetTop' in el
            ? el
            : getOffsetElement(parent(el))
        : document.documentElement;
}
