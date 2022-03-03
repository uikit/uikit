import { $$, observeIntersection, removeAttr } from 'uikit-util';

export default {
    connected() {
        this.observer = observeIntersection(
            this.slides.concat(this.$el),
            () => {
                for (const el of this.getAdjacentSlides()) {
                    el && $$('img[loading="lazy"]', el).forEach((el) => removeAttr(el, 'loading'));
                }
            },
            { rootMargin: '50% 50%' }
        );
    },

    disconnected() {
        this.observer.disconnect();
    },
};
