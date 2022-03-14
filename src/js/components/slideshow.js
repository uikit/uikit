import Class from '../mixin/class';
import Slideshow from '../mixin/slideshow';
import Animations from './internal/slideshow-animations';
import SliderReactive from '../mixin/slider-reactive';
import SliderPreload from './internal/slider-preload';
import { boxModelAdjust, css } from 'uikit-util';

export default {
    mixins: [Class, Slideshow, SliderReactive, SliderPreload],

    props: {
        ratio: String,
        minHeight: Number,
        maxHeight: Number,
    },

    data: {
        ratio: '16:9',
        minHeight: false,
        maxHeight: false,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        selNav: '.uk-slideshow-nav',
        Animations,
    },

    update: {
        read() {
            if (!this.list) {
                return false;
            }

            let [width, height] = this.ratio.split(':').map(Number);

            height = (height * this.list.offsetWidth) / width || 0;

            if (this.minHeight) {
                height = Math.max(this.minHeight, height);
            }

            if (this.maxHeight) {
                height = Math.min(this.maxHeight, height);
            }

            return { height: height - boxModelAdjust(this.list, 'height', 'content-box') };
        },

        write({ height }) {
            height > 0 && css(this.list, 'minHeight', height);
        },

        events: ['resize'],
    },

    methods: {
        getAdjacentSlides() {
            return [1, -1].map((i) => this.slides[this.getIndex(this.index + i)]);
        },
    },
};
