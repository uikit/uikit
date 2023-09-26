import { hasClass, includes, query, scrolledOver, toPx, trigger } from 'uikit-util';
import { resize, scroll } from '../api/observables';

export default {
    props: {
        parallax: Boolean,
        parallaxTarget: Boolean,
        parallaxStart: String,
        parallaxEnd: String,
    },

    data: {
        parallax: false,
        parallaxTarget: false,
        parallaxStart: 0,
        parallaxEnd: 0,
    },

    observe: [
        resize({
            target: ({ $el, target }) => [$el, target],
            filter: ({ parallax }) => parallax,
        }),
        scroll({ filter: ({ parallax }) => parallax }),
    ],

    update: {
        write() {
            if (!this.parallax) {
                return;
            }

            this.finite = true;
            this.dragging = true;

            let { slides, target, index: currentIndex, prevIndex: initial } = this;

            target = (target && query(target, this.$el)) || this.list;
            const start = toPx(this.parallaxStart, 'height', target, true);
            const end = toPx(this.parallaxEnd, 'height', target, true);
            const percent = scrolledOver(target, start, end);

            let prevIndex = -1;
            let dist = percent * this.totalWidth;
            let slidePercent = 0;

            do {
                const slideWidth = this.getSlideWidthAt(++prevIndex);
                slidePercent = (dist / slideWidth) % 1;
                dist -= slideWidth;
            } while (dist >= 0 && prevIndex < this.maxIndex);

            const nextIndex = this.getValidIndex(prevIndex + Math.ceil(slidePercent));

            const prev = slides[prevIndex];
            const next = slides[nextIndex];

            const { triggerShow, triggerShown, triggerHide, triggerHidden } = getTriggers(this);

            for (const i of new Set([this.index, this.prevIndex])) {
                if (!includes([nextIndex, prevIndex], i)) {
                    triggerHide(slides[i]);
                    triggerHidden(slides[i]);
                }
            }

            this.prevIndex = prevIndex;
            this.index = nextIndex;

            if (prev !== next) {
                triggerHide(prev);
            }
            triggerShow(next);

            if (!~initial || currentIndex !== nextIndex) {
                triggerShown(prev);
            }

            this._translate(prev === next ? 1 : slidePercent, prev, next);
        },

        events: ['scroll', 'resize'],
    },
};

function getTriggers(cmp) {
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
