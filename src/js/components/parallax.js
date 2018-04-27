import Parallax from '../mixin/parallax';
import {clamp, css, scrolledOver, query} from 'uikit-util';

export default {

    mixins: [Parallax],

    props: {
        target: String,
        viewport: Number,
        easing: Number,
    },

    data: {
        target: false,
        viewport: 1,
        easing: 1,
    },

    computed: {

        target({target}, $el) {
            return target && query(target, $el) || $el;
        }

    },

    update: [

        {

            read({percent}) {
                return {
                    prev: percent,
                    percent: ease(scrolledOver(this.target) / (this.viewport || 1), this.easing)
                };
            },

            write({prev, percent, active}, {type}) {

                if (type !== 'scroll') {
                    prev = false;
                }

                if (!active) {
                    this.reset();
                    return;
                }

                if (prev !== percent) {
                    css(this.$el, this.getCss(percent));
                }

            },

            events: ['scroll', 'load', 'resize']
        }

    ]

};

function ease(percent, easing) {
    return clamp(percent * (1 - (easing - easing * percent)));
}
