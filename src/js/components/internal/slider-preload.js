import { $$, isVisible } from 'uikit-util';

export default {
    connected() {
        if (window.IntersectionObserver) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        removeLazyLoad(this.getAdjacentSlides());
                    }
                },
                { rootMargin: '50% 50%' }
            );
            this.observer.observe(this.$el);
        }
    },

    disconnected() {
        this.observer && this.observer.disconnect();
    },

    update: {
        read() {
            if (isVisible(this.$el)) {
                removeLazyLoad(this.getAdjacentSlides());
            }
        },

        events: ['resize'],
    },
};

export function removeLazyLoad(elements = []) {
    for (const el of elements) {
        el && $$('img[loading="lazy"]', el).forEach((el) => (el.loading = ''));
    }
}
