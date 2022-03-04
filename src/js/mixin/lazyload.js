import { $$, isFunction, observeIntersection, removeAttr, toNodes } from 'uikit-util';

export default {
    methods: {
        lazyload(observeTargets = this.$el, targets = this.$el) {
            this.registerObserver(
                observeIntersection(observeTargets, (entries, observer) => {
                    for (const el of toNodes(isFunction(targets) ? targets() : targets)) {
                        $$('[loading="lazy"]', el).forEach((el) => removeAttr(el, 'loading'));
                    }
                    for (const el of entries
                        .filter(({ isIntersecting }) => isIntersecting)
                        .map(({ target }) => target)) {
                        observer.unobserve(el);
                    }
                })
            );
        },
    },
};
