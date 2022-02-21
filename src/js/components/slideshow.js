import Class from '../mixin/class';
import Slideshow from '../mixin/slideshow';
import Animations from './internal/slideshow-animations';
import SliderReactive from '../mixin/slider-reactive';
import { $$, boxModelAdjust, css, isVisible } from 'uikit-util';

export default {
    mixins: [Class, Slideshow, SliderReactive],

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

    connected() {
        if (window.IntersectionObserver) {
            this.observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    this.preloadSlides();
                }
            });
            this.observer.observe(this.$el);
        }
    },

    disconnected() {
        this.observer && this.observer.disconnect();
    },

    methods: {
        preloadSlides() {
            [1, -1].forEach((i) => removeLazyLoad(this.slides[this.getIndex(this.index + i)]));
        },
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

            if (isVisible(this.$el)) {
                this.preloadSlides();
            }

            return { height: height - boxModelAdjust(this.list, 'height', 'content-box') };
        },

        write({ height }) {
            height > 0 && css(this.list, 'minHeight', height);
        },

        events: ['resize'],
    },
};

function removeLazyLoad(el) {
    el && $$('img[loading="lazy"]', el).forEach((el) => (el.loading = ''));
}
