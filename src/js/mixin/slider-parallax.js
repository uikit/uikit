import { hasClass, includes, trigger } from 'uikit-util';
import ScrollDriven from './scroll-driven';

export default {
    mixins: [ScrollDriven],

    props: {
        parallax: Boolean,
    },

    data: {
        parallax: false,
    },

    computed: {
        parallaxTargetFallback() {
            return this.list;
        },
    },

    update: {
        write({ percent }) {
            if (!this.parallax) {
                return;
            }

            const [prevIndex, slidePercent] = this.getIndexAt(percent);

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
