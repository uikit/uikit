import { lazyload } from '../../api/observables';

export default {
    observe: lazyload({
        target: ({ slides }) => slides,
        targets: (instance) => instance.getAdjacentSlides(),
        media: true,
    }),

    methods: {
        getAdjacentSlides() {
            return [1, -1].map((i) => this.slides[this.getIndex(this.index + i)]);
        },
    },
};
