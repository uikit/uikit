import Class from '../mixin/class';
import Slider, {speedUp} from '../mixin/slider';
import SliderReactive from '../mixin/slider-reactive';
import Transitioner, {bounds, getElLeft, getWidth, getMax, getMaxWidth} from './internal/slider-transitioner';
import {$, $$, addClass, css, data, includes, isNumeric, isUndefined, toggleClass, toFloat} from 'uikit-util';

export default {

    mixins: [Class, Slider, SliderReactive],

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
        Transitioner
    },

    computed: {

        avgWidth() {
            return getWidth(this.list) / this.length;
        },

        finite({finite}) {
            return finite || getWidth(this.list) < bounds(this.list).width + getMaxWidth(this.list) + this.center;
        },

        maxIndex() {

            if (!this.finite || this.center && !this.sets) {
                return this.length - 1;
            }

            if (this.center) {
                return this.sets[this.sets.length - 1];
            }

            css(this.slides, 'order', '');

            const max = getMax(this.list);
            let i = this.length;

            while (i--) {
                if (getElLeft(this.list.children[i], this.list) < max) {
                    return Math.min(i + 1, this.length - 1);
                }
            }

            return 0;
        },

        sets({sets}) {

            const width = bounds(this.list).width / (this.center ? 2 : 1);

            let left = 0;
            let leftCenter = width;
            let slideLeft = 0;

            sets = sets && this.slides.reduce((sets, slide, i) => {

                const {width: slideWidth} = bounds(slide);
                const slideRight = slideLeft + slideWidth;

                if (slideRight > left) {

                    if (!this.center && i > this.maxIndex) {
                        i = this.maxIndex;
                    }

                    if (!includes(sets, i)) {

                        const cmp = this.slides[i + 1];
                        if (this.center && cmp && slideWidth < leftCenter - bounds(cmp).width / 2) {
                            leftCenter -= slideWidth;
                        } else {
                            leftCenter = width;
                            sets.push(i);
                            left = slideLeft + width + (this.center ? slideWidth / 2 : 0);
                        }

                    }
                }

                slideLeft += slideWidth;

                return sets;

            }, []);

            return sets && sets.length && sets;

        },

        transitionOptions() {
            return {
                center: this.center,
                list: this.list
            };
        }

    },

    connected() {
        toggleClass(this.$el, this.clsContainer, !$(`.${this.clsContainer}`, this.$el));
    },

    update: {

        write() {

            $$(`[${this.attrItem}],[data-${this.attrItem}]`, this.$el).forEach(el => {
                const index = data(el, this.attrItem);
                this.maxIndex && toggleClass(el, 'uk-hidden', isNumeric(index) && (this.sets && !includes(this.sets, toFloat(index)) || index > this.maxIndex));
            });

        },

        events: ['load', 'resize']

    },

    events: {

        beforeitemshow(e) {

            if (!this.dragging && this.sets && this.stack.length < 2 && !includes(this.sets, this.index)) {
                this.index = this.getValidIndex();
            }

            const diff = Math.abs(
                this.index
                - this.prevIndex
                + (this.dir > 0 && this.index < this.prevIndex || this.dir < 0 && this.index > this.prevIndex ? (this.maxIndex + 1) * this.dir : 0)
            );

            if (!this.dragging && diff > 1) {

                for (let i = 0; i < diff; i++) {
                    this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
                }

                e.preventDefault();
                return;
            }

            this.duration = speedUp(this.avgWidth / this.velocity)
                * (bounds(
                    this.dir < 0 || !this.slides[this.prevIndex]
                        ? this.slides[this.index]
                        : this.slides[this.prevIndex]
                ).width / this.avgWidth);

            this.reorder();

        },

        itemshow() {
            !isUndefined(this.prevIndex) && addClass(this._getTransitioner().getItemIn(), this.clsActive);
        },

        itemshown() {
            const actives = this._getTransitioner(this.index).getActives();
            this.slides.forEach(slide => toggleClass(slide, this.clsActive, includes(actives, slide)));
            (!this.sets || includes(this.sets, toFloat(this.index))) && this.slides.forEach(slide => toggleClass(slide, this.clsActivated, includes(actives, slide)));
        }

    },

    methods: {

        reorder() {

            css(this.slides, 'order', '');

            if (this.finite) {
                return;
            }

            const index = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index;

            this.slides.forEach((slide, i) =>
                css(slide, 'order', this.dir > 0 && i < index
                    ? 1
                    : this.dir < 0 && i >= this.index
                        ? -1
                        : ''
                )
            );

            if (!this.center) {
                return;
            }

            const next = this.slides[index];
            let width = bounds(this.list).width / 2 - bounds(next).width / 2;
            let j = 0;

            while (width > 0) {
                const slideIndex = this.getIndex(--j + index, index);
                const slide = this.slides[slideIndex];

                css(slide, 'order', slideIndex > index ? -2 : -1);
                width -= bounds(slide).width;
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
        }

    }

};
