import { css } from 'uikit-util';
import Class from '../mixin/class';
import SliderParallax from '../mixin/slider-parallax';
import SliderReactive from '../mixin/slider-reactive';
import Slideshow from '../mixin/slideshow';
import SliderPreload from './internal/slider-preload';
import Animations from './internal/slideshow-animations';

export default {
    mixins: [Class, Slideshow, SliderReactive, SliderParallax, SliderPreload],

    props: {
        ratio: String,
        minHeight: String,
        maxHeight: String,
    },

    data: {
        ratio: '16:9',
        minHeight: undefined,
        maxHeight: undefined,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        selNav: '.uk-slideshow-nav',
        Animations,
    },

    watch: {
        list(list) {
            css(list, {
                aspectRatio: this.ratio ? this.ratio.replace(':', '/') : undefined,
                minHeight: this.minHeight,
                maxHeight: this.maxHeight,
                width: '100%',
            });
        },
    },

    methods: {
        getAdjacentSlides() {
            return [1, -1].map((i) => this.slides[this.getIndex(this.index + i)]);
        },
    },
};
