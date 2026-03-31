import { query, scrolledOver, toPx } from 'uikit-util';
import { resize, scroll } from '../api/observables';
import { ease } from './parallax';

export default {
    props: {
        parallaxTarget: Boolean,
        parallaxStart: String,
        parallaxEnd: String,
        parallaxEasing: Number,
    },

    data: {
        parallaxTarget: false,
        parallaxStart: 0,
        parallaxEnd: 0,
        parallaxEasing: 0,
    },

    observe: [
        resize({
            target: ({ $el, parallaxTarget }) => [$el, parallaxTarget],
            filter: ({ parallax }) => parallax,
        }),
        scroll({ filter: ({ parallax }) => parallax }),
    ],

    computed: {
        parallaxTargetFallback: ($props, $el) => $el,

        parallaxTarget({ parallaxTarget }, $el) {
            return (parallaxTarget && query(parallaxTarget, $el)) || this.parallaxTargetFallback;
        },
    },

    update: {
        read() {
            if (!this.parallax) {
                return;
            }

            const target = this.parallaxTarget;

            if (!target) {
                return;
            }

            const start = toPx(this.parallaxStart, 'height', target, true);
            const end = toPx(this.parallaxEnd, 'height', target, true);
            const percent = ease(scrolledOver(target, start, end), this.parallaxEasing);

            return { percent };
        },

        events: ['scroll', 'resize'],
    },
};
