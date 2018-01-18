import Slider, { speedUp } from '../mixin/slider';
import SliderReactive from '../mixin/internal/slider-reactive';
import TransitionerPlugin from './internal/slider-transitioner';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Slider);

    var {mixin} = UIkit;
    var {$, $$, css, data, includes, isNumeric, toggleClass, toFloat} = UIkit.util;
    var Transitioner = TransitionerPlugin(UIkit);

    UIkit.component('slider', {

        mixins: [mixin.class, mixin.slider, SliderReactive(UIkit)],

        props: {
            center: Boolean,
            sets: Boolean,
        },

        defaults: {
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
                return Transitioner.getWidth(this.list) / this.length;
            },

            finite({finite}) {
                return finite || Transitioner.getWidth(this.list) < this.list.offsetWidth + Transitioner.getMaxWidth(this.list) + this.center;
            },

            maxIndex() {

                if (!this.finite || this.center && !this.sets) {
                    return this.length - 1;
                }

                if (this.center) {
                    return this.sets[this.sets.length - 1];
                }

                css(this.slides, 'order', '');

                var max = Transitioner.getMax(this.list), i = this.length;

                while (i--) {
                    if (Transitioner.getElLeft(this.list.children[i], this.list) < max) {
                        return Math.min(i + 1, this.length - 1);
                    }
                }

                return 0;
            },

            sets({sets}) {

                var width = this.list.offsetWidth / (this.center ? 2 : 1),
                    left = 0,
                    leftCenter = width;

                css(this.slides, 'order', '');

                sets = sets && this.slides.reduce((sets, slide, i) => {

                    var slideWidth = slide.offsetWidth,
                        slideLeft = Transitioner.getElLeft(slide, this.list),
                        slideRight = slideLeft + slideWidth;

                    if (slideRight > left) {

                        if (!this.center && i > this.maxIndex) {
                            i = this.maxIndex;
                        }

                        if (!includes(sets, i)) {

                            var cmp = this.slides[i + 1];
                            if (this.center && cmp && slideWidth < leftCenter - cmp.offsetWidth / 2) {
                                leftCenter -= slideWidth;
                            } else {
                                leftCenter = width;
                                sets.push(i);
                                left = slideLeft + width + (this.center ? slideWidth / 2 : 0);
                            }

                        }
                    }

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
                    var index = data(el, this.attrItem);
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

                var diff = Math.abs(this.index + (this.dir > 0
                        ? this.index < this.prevIndex ? this.maxIndex + 1 : 0
                        : this.index > this.prevIndex ? -this.maxIndex : 0
                ) - this.prevIndex);

                if (!this.dragging && diff > 1) {

                    for (var i = 0; i < diff; i++) {
                        this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
                    }

                    e.preventDefault();
                    return;
                }

                this.duration = speedUp(this.avgWidth / this.velocity)
                    * ((
                        this.dir < 0 || !this.slides[this.prevIndex]
                            ? this.slides[this.index]
                            : this.slides[this.prevIndex]
                    ).offsetWidth / this.avgWidth);

                this.reorder();

            }

        },

        methods: {

            reorder() {

                css(this.slides, 'order', '');

                if (this.finite) {
                    return;
                }

                this.slides.forEach((slide, i) =>
                    css(slide, 'order', this.dir > 0 && i < this.prevIndex
                        ? 1
                        : this.dir < 0 && i >= this.index
                            ? -1
                            : ''
                    )
                );

                if (!this.center) {
                    return;
                }

                var index = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index,
                    next = this.slides[index],
                    width = this.list.offsetWidth / 2 - next.offsetWidth / 2,
                    j = 0;

                while (width >= 0) {
                    var slideIndex = this.getIndex(--j + index, index),
                        slide = this.slides[slideIndex];

                    css(slide, 'order', slideIndex > index ? -2 : -1);
                    width -= slide.offsetWidth;
                }

            },

            getValidIndex(index = this.index, prevIndex = this.prevIndex) {

                index = this.getIndex(index, prevIndex);

                if (!this.sets) {
                    return index;
                }

                var prev;

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

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
