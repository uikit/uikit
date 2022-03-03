import { $$, isArray, observeIntersection, removeAttr } from 'uikit-util';

export default {
    methods: {
        lazyload(observeTargets = this.$el, targets = this.$el) {
            this.registerObserver(
                observeIntersection(observeTargets, (entries, observer) => {
                    for (const el of isArray(targets) ? targets : [targets]) {
                        $$('img[loading="lazy"]', el).forEach((el) => removeAttr(el, 'loading'));
                    }
                    observer.disconnect();
                })
            );
        },
    },
};
