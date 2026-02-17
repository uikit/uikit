import {
    $$,
    css,
    dimensions,
    hasClass,
    inBrowser,
    pointerEnter,
    pointerLeave,
    toggleClass,
    toPx,
} from 'uikit-util';
import { intersection, resize } from '../api/observables';
import Class from '../mixin/class';

const hasAnimationApi = inBrowser && window.Animation;

export default {
    mixins: [Class],

    props: {
        velocity: Number,
        start: Number,
        reverse: Boolean,
        pause: Boolean,
        pauseVelocity: Number,
        fadeSize: null,
    },

    data: {
        velocity: 25,
        start: 0,
        reverse: false,
        pause: false,
        pauseVelocity: 10,
        selList: '.uk-marquee-items',
        fadeSize: 0,
    },

    computed: {
        items: ({ selList }, $el) => $$(`${selList} > *`, $el),
    },

    observe: [
        resize({
            target: ({ $el, items }) => [$el, ...items],
        }),
        intersection({
            handler(entries) {
                for (const entry of entries) {
                    entry.target.inert = !entry.isIntersecting;
                }
            },
            target: ({ items }) => items,
            args: { intersecting: false },
            options: ({ $el }) => ({ root: $el }),
        }),
    ],

    events: {
        name: [pointerEnter, pointerLeave],
        el: ({ $el }) => $el,
        self: true,
        filter: ({ pause }) => hasAnimationApi && pause,
        handler(e) {
            for (const el of this.items) {
                for (const animation of el.getAnimations()) {
                    animation.playbackRate =
                        e.type === pointerEnter ? this.pauseVelocity / this.velocity : 1;
                }
            }
        },
    },

    update: {
        write() {
            const prefix = this.$options.id;
            const items = this.items;
            const vertical = hasClass(this.$el, `${prefix}-vertical`);

            css(items, 'offset', 'none');

            const dir = vertical ? ['top', 'bottom'] : ['left', 'right'];
            const listStart = dimensions(this.$el)[dir[0]];
            const listEnd = Math.max(...items.map((el) => dimensions(el)[dir[1]]));

            for (const el of items) {
                const elEnd = dimensions(el)[dir[1]];
                const line1 = listEnd - elEnd;
                const line2 = elEnd - listStart;
                const path = vertical
                    ? `"M0 0 v${line1}M0 ${-line2} v${line2}"`
                    : `"M0 0 h${line1}M${-line2} 0 h${line2}"`;
                css(el, `--${prefix}-path`, path);
            }

            css(this.$el, {
                [`--${prefix}-duration`]: `${(listEnd - listStart) / this.velocity}s`,
                [`--${prefix}-start`]: this.start,
                [`--${prefix}-direction`]: this.reverse ? 'reverse' : 'normal',
                '--uk-overflow-fade-size': this.fadeSize
                    ? `${toPx(this.fadeSize, vertical ? 'height' : 'width', this.$el, true)}px`
                    : '',
            });

            toggleClass(this.$el, `${prefix}-fade`, this.fadeSize);

            css(items, 'offset', '');
        },

        events: ['resize'],
    },
};
