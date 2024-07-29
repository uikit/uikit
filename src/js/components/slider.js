import {
    $,
    $$,
    addClass,
    attr,
    children,
    css,
    data,
    dimensions,
    findIndex,
    getIndex,
    hasOwn,
    includes,
    isVisible,
    last,
    selFocusable,
    sumBy,
    toFloat,
    toNumber,
    toggleClass,
} from 'uikit-util';
import { resize } from '../api/observables';
import Class from '../mixin/class';
import Slider, { speedUp } from '../mixin/slider';
import SliderParallax from '../mixin/slider-parallax';
import SliderReactive from '../mixin/slider-reactive';
import SliderPreload from './internal/slider-preload';
import Transitioner, { getMax, getWidth } from './internal/slider-transitioner';

export default {
    mixins: [Class, Slider, SliderReactive, SliderParallax, SliderPreload],

    props: {
        center: Boolean,
        sets: Boolean,
        active: String,
    },

    data: {
        center: false,
        sets: false,
        attrItem: 'uk-slider-item',
        selList: '.uk-slider-items',
        selNav: '.uk-slider-nav',
        clsContainer: 'uk-slider-container',
        active: 'all',
        Transitioner,
    },

    computed: {
        finite({ finite }) {
            return finite || isFinite(this.list, this.center);
        },

        maxIndex() {
            if (!this.finite || (this.center && !this.sets)) {
                return this.length - 1;
            }

            if (this.center) {
                return last(this.sets);
            }

            let lft = 0;
            const max = getMax(this.list);
            const index = findIndex(this.slides, (el) => {
                // 0.005: FF reports different widths for (calc(100% / 3))
                if (lft >= max - 0.005) {
                    return true;
                }

                lft += dimensions(el).width;
            });

            return ~index ? index : this.length - 1;
        },

        sets({ sets: enabled }) {
            if (!enabled || this.parallax) {
                return;
            }

            let left = 0;
            const sets = [];
            const width = dimensions(this.list).width;
            for (let i = 0; i < this.length; i++) {
                const slideWidth = dimensions(this.slides[i]).width;

                if (left + slideWidth > width) {
                    left = 0;
                }

                if (this.center) {
                    if (
                        left < width / 2 &&
                        left +
                            slideWidth +
                            dimensions(this.slides[getIndex(i + 1, this.slides)]).width / 2 >
                            width / 2
                    ) {
                        sets.push(i);
                        left = width / 2 - slideWidth / 2;
                    }
                } else if (left === 0) {
                    sets.push(Math.min(i, this.maxIndex));
                }

                left += slideWidth;
            }

            if (sets.length) {
                return sets;
            }
        },

        transitionOptions() {
            return {
                center: this.center,
                list: this.list,
            };
        },

        slides() {
            return children(this.list).filter(isVisible);
        },
    },

    connected() {
        toggleClass(this.$el, this.clsContainer, !$(`.${this.clsContainer}`, this.$el));
    },

    observe: resize({
        target: ({ slides, $el }) => [$el, ...slides],
    }),

    update: {
        write() {
            for (const el of this.navItems) {
                const index = toNumber(data(el, this.attrItem));
                if (index !== false) {
                    el.hidden =
                        !this.maxIndex ||
                        index > this.maxIndex ||
                        (this.sets && !includes(this.sets, index));
                }
            }

            this.reorder();
            if (!this.parallax) {
                this._translate(1);
            }

            this.updateActiveClasses();
        },

        events: ['resize'],
    },

    events: {
        beforeitemshow(e) {
            if (
                !this.dragging &&
                this.sets &&
                this.stack.length < 2 &&
                !includes(this.sets, this.index)
            ) {
                this.index = this.getValidIndex();
            }

            const diff = Math.abs(
                this.index -
                    this.prevIndex +
                    ((this.dir > 0 && this.index < this.prevIndex) ||
                    (this.dir < 0 && this.index > this.prevIndex)
                        ? (this.maxIndex + 1) * this.dir
                        : 0),
            );

            if (!this.dragging && diff > 1) {
                for (let i = 0; i < diff; i++) {
                    this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
                }

                e.preventDefault();
                return;
            }

            const index =
                this.dir < 0 || !this.slides[this.prevIndex] ? this.index : this.prevIndex;
            const avgWidth = getWidth(this.list) / this.length;
            this.duration =
                speedUp(avgWidth / this.velocity) *
                (dimensions(this.slides[index]).width / avgWidth);

            this.reorder();
        },

        itemshow() {
            if (~this.prevIndex) {
                addClass(this._getTransitioner().getItemIn(), this.clsActive);
            }
            this.updateActiveClasses(this.prevIndex);
        },

        itemshown() {
            this.updateActiveClasses();
        },
    },

    methods: {
        reorder() {
            if (this.finite) {
                css(this.slides, 'order', '');
                return;
            }

            const index = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index;

            this.slides.forEach((slide, i) =>
                css(
                    slide,
                    'order',
                    this.dir > 0 && i < index ? 1 : this.dir < 0 && i >= this.index ? -1 : '',
                ),
            );

            if (!this.center || !this.length) {
                return;
            }

            const next = this.slides[index];
            let width = dimensions(this.list).width / 2 - dimensions(next).width / 2;
            let j = 0;

            while (width > 0) {
                const slideIndex = this.getIndex(--j + index, index);
                const slide = this.slides[slideIndex];

                css(slide, 'order', slideIndex > index ? -2 : -1);
                width -= dimensions(slide).width;
            }
        },

        updateActiveClasses(currentIndex = this.index) {
            let actives = this._getTransitioner(currentIndex).getActives();

            if (this.active !== 'all') {
                actives = [this.slides[this.getValidIndex(currentIndex)]];
            }

            const activeClasses = [
                this.clsActive,
                !this.sets || includes(this.sets, toFloat(this.index)) ? this.clsActivated : '',
            ];
            for (const slide of this.slides) {
                const active = includes(actives, slide);
                toggleClass(slide, activeClasses, active);
                attr(slide, 'aria-hidden', !active);
                for (const focusable of $$(selFocusable, slide)) {
                    if (!hasOwn(focusable, '_tabindex')) {
                        focusable._tabindex = attr(focusable, 'tabindex');
                    }
                    attr(focusable, 'tabindex', active ? focusable._tabindex : -1);
                }
            }
        },

        getValidIndex(index = this.index, prevIndex = this.prevIndex) {
            index = this.getIndex(index, prevIndex);

            if (!this.sets) {
                return index;
            }

            let prev;

            do {
                if (includes(this.sets, index)) {
                    return index;
                }

                prev = index;
                index = this.getIndex(index + this.dir, prevIndex);
            } while (index !== prev);

            return index;
        },

        getAdjacentSlides() {
            const { width } = dimensions(this.list);
            const left = -width;
            const right = width * 2;
            const slideWidth = dimensions(this.slides[this.index]).width;
            const slideLeft = this.center ? width / 2 - slideWidth / 2 : 0;
            const slides = new Set();
            for (const i of [-1, 1]) {
                let currentLeft = slideLeft + (i > 0 ? slideWidth : 0);
                let j = 0;
                do {
                    const slide = this.slides[this.getIndex(this.index + i + j++ * i)];
                    currentLeft += dimensions(slide).width * i;
                    slides.add(slide);
                } while (this.length > j && currentLeft > left && currentLeft < right);
            }
            return Array.from(slides);
        },

        getIndexAt(percent) {
            let index = -1;
            const scrollDist = this.center
                ? getWidth(this.list) -
                  (dimensions(this.slides[0]).width / 2 + dimensions(last(this.slides)).width / 2)
                : getWidth(this.list, this.maxIndex);

            let dist = percent * scrollDist;
            let slidePercent = 0;

            do {
                const slideWidth = dimensions(this.slides[++index]).width;
                const slideDist = this.center
                    ? slideWidth / 2 + dimensions(this.slides[index + 1]).width / 2
                    : slideWidth;
                slidePercent = (dist / slideDist) % 1;
                dist -= slideDist;
            } while (dist >= 0 && index < this.maxIndex);

            return [index, slidePercent];
        },
    },
};

function isFinite(list, center) {
    if (!list || list.length < 2) {
        return true;
    }

    const { width: listWidth } = dimensions(list);
    if (!center) {
        return Math.ceil(getWidth(list)) < Math.trunc(listWidth + getMaxElWidth(list));
    }

    const slides = children(list);
    const listHalf = Math.trunc(listWidth / 2);
    for (const index in slides) {
        const slide = slides[index];
        const slideWidth = dimensions(slide).width;
        const slidesInView = new Set([slide]);

        let diff = 0;
        for (const i of [-1, 1]) {
            let left = slideWidth / 2;

            let j = 0;

            while (left < listHalf) {
                const nextSlide = slides[getIndex(+index + i + j++ * i, slides)];

                if (slidesInView.has(nextSlide)) {
                    return true;
                }

                left += dimensions(nextSlide).width;
                slidesInView.add(nextSlide);
            }
            diff = Math.max(
                diff,
                slideWidth / 2 +
                    dimensions(slides[getIndex(+index + i, slides)]).width / 2 -
                    (left - listHalf),
            );
        }

        if (
            Math.trunc(diff) >
            sumBy(
                slides.filter((slide) => !slidesInView.has(slide)),
                (slide) => dimensions(slide).width,
            )
        ) {
            return true;
        }
    }

    return false;
}

function getMaxElWidth(list) {
    return Math.max(0, ...children(list).map((el) => dimensions(el).width));
}
