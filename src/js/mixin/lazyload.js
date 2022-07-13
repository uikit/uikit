import { $$, isFunction, observeIntersection, removeAttr, toNodes } from 'uikit-util';

export default {
    data: {
        preload: 5,
    },

    methods: {
        lazyload(observeTargets = this.$el, targets = this.$el) {
            this.registerObserver(
                observeIntersection(observeTargets, (entries, observer) => {
                    for (const el of toNodes(isFunction(targets) ? targets() : targets)) {
                        $$('[loading="lazy"]', el)
                            .slice(0, this.preload - 1)
                            .forEach((el) => removeAttr(el, 'loading'));
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
