import Parallax from '../mixin/parallax';
import {clamp, css, scrolledOver, query} from 'uikit-util';

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

        read({percent, active}, type) {

            if (type !== 'scroll') {
                percent = false;
            }

            if (!active) {
                return;
            }

            const prev = percent;
            percent = ease(scrolledOver(this.target) / (this.viewport || 1), this.easing);

            return {
                percent,
                style: prev !== percent ? this.getCss(percent) : false
            };
        },

        write({style, active}) {

            if (!active) {
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
            : getOffsetElement(el.parentNode)
        : document.body;
}
