import { hasClass, includes, query, scrolledOver, toPx, trigger } from 'uikit-util';
import { resize, scroll } from '../api/observables';
import { ease } from './parallax';

export default {
    props: {
        parallax: Boolean,
        parallaxTarget: Boolean,
        parallaxStart: String,
        parallaxEnd: String,
        parallaxEasing: Number,
    },

    data: {
        parallax: false,
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
        parallaxTarget({ parallaxTarget }, $el) {
            return (parallaxTarget && query(parallaxTarget, $el)) || this.list;
        },
    },

    update: {
        read() {
            if (!this.parallax) {
                return false;
            }

            const target = this.parallaxTarget;

            if (!target) {
                return false;
            }

            const start = toPx(this.parallaxStart, 'height', target, true);
            const end = toPx(this.parallaxEnd, 'height', target, true);
            const percent = ease(scrolledOver(target, start, end), this.parallaxEasing);

            return { parallax: this.getIndexAt(percent) };
        },

        write({ parallax }) {
            const [prevIndex, slidePercent] = parallax;

            const nextIndex = this.getValidIndex(prevIndex + Math.ceil(slidePercent));

            const prev = this.slides[prevIndex];
            const next = this.slides[nextIndex];

            const { triggerShow, triggerShown, triggerHide, triggerHidden } = useTriggers(this);

            if (~this.prevIndex) {
                for (const i of new Set([this.index, this.prevIndex])) {
                    if (!includes([nextIndex, prevIndex], i)) {
                        triggerHide(this.slides[i]);
                        triggerHidden(this.slides[i]);
                    }
                }
            }

            const changed = this.prevIndex !== prevIndex || this.index !== nextIndex;

            this.dir = 1;
            this.prevIndex = prevIndex;
            this.index = nextIndex;

            if (prev !== next) {
                triggerHide(prev);
            }

            triggerShow(next);

            if (changed) {
                triggerShown(prev);
            }

            this._translate(prev === next ? 1 : slidePercent, prev, next);
        },

        events: ['scroll', 'resize'],
    },

    methods: {
        getIndexAt(percent) {
            const index = percent * (this.length - 1);
            return [Math.floor(index), index % 1];
        },
    },
};

function useTriggers(cmp) {
    const { clsSlideActive, clsEnter, clsLeave } = cmp;

    return { triggerShow, triggerShown, triggerHide, triggerHidden };

    function triggerShow(el) {
        if (hasClass(el, clsLeave)) {
            triggerHide(el);
            triggerHidden(el);
        }

        if (!hasClass(el, clsSlideActive)) {
            trigger(el, 'beforeitemshow', [cmp]);
            trigger(el, 'itemshow', [cmp]);
        }
    }

    function triggerShown(el) {
        if (hasClass(el, clsEnter)) {
            trigger(el, 'itemshown', [cmp]);
        }
    }

    function triggerHide(el) {
        if (!hasClass(el, clsSlideActive)) {
            triggerShow(el);
        }

        if (hasClass(el, clsEnter)) {
            triggerShown(el);
        }

        if (!hasClass(el, clsLeave)) {
            trigger(el, 'beforeitemhide', [cmp]);
            trigger(el, 'itemhide', [cmp]);
        }
    }

    function triggerHidden(el) {
        if (hasClass(el, clsLeave)) {
            trigger(el, 'itemhidden', [cmp]);
        }
    }
}
