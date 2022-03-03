import { $$, observeIntersection, removeAttr } from 'uikit-util';

export default {
    connected() {
        this.registerObserver(
            observeIntersection(
                this.slides.concat(this.$el),
                (entries, observer) => {
                    for (const el of this.getAdjacentSlides()) {
                        $$('img[loading="lazy"]', el).forEach((el) => removeAttr(el, 'loading'));
                        observer.unobserve(el);
                    }
                },
                { rootMargin: '50% 50%' }
            )
        );
    },
};
