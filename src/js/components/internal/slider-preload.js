import Lazyload from '../../mixin/lazyload';

export default {
    mixins: [Lazyload],

    connected() {
        this.lazyload(this.slides, this.getAdjacentSlides);
    },
};
