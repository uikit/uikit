import Class from '../mixin/class';
import Slider, { speedUp } from '../mixin/slider';
import SliderReactive from '../mixin/slider-reactive';
import SliderPreload from './internal/slider-preload';
import Transitioner, { getMax, getWidth } from './internal/slider-transitioner';
import {
    $,
    addClass,
    children,
    css,
    data,
    dimensions,
    findIndex,
    includes,
    last,
    toFloat,
    toggleClass,
    toNumber,
} from 'uikit-util';

export default {
    mixins: [Class, Slider, SliderReactive, SliderPreload],

    props: {
        center: Boolean,
        sets: Boolean,
    },

    data: {
        center: false,
        sets: false,
        attrItem: 'uk-slider-item',
        selList: '.uk-slider-items',
        selNav: '.uk-slider-nav',
        clsContainer: 'uk-slider-container',
        Transitioner,
    },

    computed: {
        avgWidth() {
            return getWidth(this.list) / this.length;
        },

        finite({ finite }) {
            return (
                finite ||
                Math.ceil(getWidth(this.list)) <
                    Math.trunc(dimensions(this.list).width + getMaxElWidth(this.list) + this.center)
            );
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
                if (lft >= max) {
                    return true;
                }

                lft += dimensions(el).width;
            });

            return ~index ? index : this.length - 1;
        },

        sets({ sets: enabled }) {
            if (!enabled) {
                return;
            }

            let left = 0;
            const sets = [];
            const width = dimensions(this.list).width;
            for (let i = 0; i < this.slides.length; i++) {
                const slideWidth = dimensions(this.slides[i]).width;

                if (left + slideWidth > width) {
                    left = 0;
                }

                if (this.center) {
                    if (
                        left < width / 2 &&
                        left + slideWidth + dimensions(this.slides[+i + 1]).width / 2 > width / 2
                    ) {
                        sets.push(+i);
                        left = width / 2 - slideWidth / 2;
                    }
                } else if (left === 0) {
                    sets.push(Math.min(+i, this.maxIndex));
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
    },

    connected() {
        toggleClass(this.$el, this.clsContainer, !$(`.${this.clsContainer}`, this.$el));
    },

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

            if (this.length && !this.dragging && !this.stack.length) {
                this.reorder();
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
                        : 0)
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
            this.duration =
                speedUp(this.avgWidth / this.velocity) *
                (dimensions(this.slides[index]).width / this.avgWidth);

            this.reorder();
        },

        itemshow() {
            if (~this.prevIndex) {
                addClass(this._getTransitioner().getItemIn(), this.clsActive);
            }
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
                    this.dir > 0 && i < index ? 1 : this.dir < 0 && i >= this.index ? -1 : ''
                )
            );

            if (!this.center) {
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

        updateActiveClasses() {
            const actives = this._getTransitioner(this.index).getActives();
            const activeClasses = [
                this.clsActive,
                ((!this.sets || includes(this.sets, toFloat(this.index))) && this.clsActivated) ||
                    '',
            ];
            for (const slide of this.slides) {
                toggleClass(slide, activeClasses, includes(actives, slide));
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
                } while (this.slides.length > j && currentLeft > left && currentLeft < right);
            }
            return Array.from(slides);
        },
    },
};

function getMaxElWidth(list) {
    return Math.max(0, ...children(list).map((el) => dimensions(el).width));
}
