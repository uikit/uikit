import { boxModelAdjust, css, inBrowser } from 'uikit-util';
import Class from '../mixin/class';
import SliderReactive from '../mixin/slider-reactive';
import Slideshow from '../mixin/slideshow';
import SliderPreload from './internal/slider-preload';
import Animations from './internal/slideshow-animations';

const supportsAspectRatio = inBrowser && CSS.supports('aspect-ratio', '1/1');

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

    watch: {
        list(list) {
            if (list && supportsAspectRatio) {
                css(list, {
                    aspectRatio: this.ratio.replace(':', '/'),
                    minHeight: this.minHeight || '',
                    maxHeight: this.maxHeight || '',
                    minWidth: '100%',
                    maxWidth: '100%',
                });
            }
        },
    },

    update: {
        // deprecated: Remove with iOS 17
        read() {
            if (!this.list || supportsAspectRatio) {
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
