import {
    $,
    children,
    css,
    dimensions,
    getIndex,
    hasClass,
    inBrowser,
    isRtl,
    pointerEnter,
    pointerLeave,
    toggleClass,
    toPx,
} from 'uikit-util';
import { intersection, preloadMedia, resize } from '../api/observables';
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
        list: ({ selList }, $el) => $(selList, $el),
        items() {
            return children(this.list);
        },
    },

    watch: {
        items() {
            this.$emit();
        },
    },

    observe: [
        resize({
            target: ({ $el, items }) => [$el, ...items],
        }),
        intersection({
            handler(entries) {
                let active;
                for (const entry of entries) {
                    entry.target.inert = !entry.isIntersecting;
                    active ||= entry.isIntersecting && entry.target;
                }

                if (!active) {
                    return;
                }

                const { items } = this;
                const index = items.indexOf(active);
                if (!~index) {
                    return;
                }

                const direction = this.reverse ? 1 : -1;
                for (let offset = 1; offset < items.length; offset++) {
                    const item = items[getIndex(index + direction * offset, items)];
                    if (item.inert) {
                        preloadMedia(item);
                        break;
                    }
                }
            },
            target: ({ items }) => items,
            args: { intersecting: false },
            options: ({ $el }) => ({ root: $el }),
        }),
    ],

    methods: {
        vertical() {
            return hasClass(this.$el, `${this.$options.id}-vertical`);
        },
    },

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
            const vertical = this.vertical();

            css(items, 'offset', 'none');

            const dir = vertical ? ['top', 'bottom'] : ['left', 'right'];
            if (!vertical && isRtl) {
                dir.reverse();
            }

            const listStart = dimensions(this.list)[dir[0]];
            const itemEnds = items.map((el) => dimensions(el)[dir[1]]);
            const listEnd = Math[!vertical && isRtl ? 'min' : 'max'](...itemEnds);

            for (const [index, el] of items.entries()) {
                const elEnd = itemEnds[index];
                const line1 = listEnd - elEnd;
                const line2 = elEnd - listStart;
                const path = vertical
                    ? `"M0 0 v${line1}M0 ${-line2} v${line2}"`
                    : `"M0 0 h${line1}M${-line2} 0 h${line2}"`;
                css(el, `--${prefix}-path`, path);
            }

            css(this.$el, {
                [`--${prefix}-duration`]: `${Math.abs(listStart - listEnd) / this.velocity}s`,
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
