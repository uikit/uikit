import Parallax from '../mixin/parallax';
import {clamp, css, parent, query, scrolledOver} from 'uikit-util';

export default {

    mixins: [Parallax],

    props: {
        target: String,
        viewport: Number,
        easing: Number
    },

    data: {
        target: false,
        viewport: 1,
        easing: 1
    },

    computed: {

        target({target}, $el) {
            return getOffsetElement(target && query(target, $el) || $el);
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
            percent = ease(scrolledOver(this.target) / (this.viewport || 1), this.easing);

            return {
                percent,
                style: prev !== percent ? this.getCss(percent) : false
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

function ease(percent, easing) {
    return clamp(percent * (1 - (easing - easing * percent)));
}

// SVG elements do not inherit from HTMLElement
function getOffsetElement(el) {
    return el
        ? 'offsetTop' in el
            ? el
            : getOffsetElement(parent(el))
        : document.body;
}
