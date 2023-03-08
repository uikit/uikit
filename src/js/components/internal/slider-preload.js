import { lazyload } from '../../api/observables';

export default {
    observe: lazyload({
        target: ({ slides }) => slides,
        targets: (instance) => instance.getAdjacentSlides(),
    }),
};
