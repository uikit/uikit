import {
    $$,
    isFunction,
    observeIntersection,
    observeMutation,
    observeResize,
    on,
    removeAttr,
    toNodes,
} from '../util';

export function resize(options) {
    return observe(observeResize, options, 'resize');
}

export function intersection(options) {
    return observe(observeIntersection, options);
}

export function mutation(options) {
    return observe(observeMutation, options);
}

export function lazyload(options = {}) {
    return intersection({
        handler: function (entries, observer) {
            const { targets = this.$el, preload = 5 } = options;
            for (const el of toNodes(isFunction(targets) ? targets(this) : targets)) {
                $$('[loading="lazy"]', el)
                    .slice(0, preload - 1)
                    .forEach((el) => removeAttr(el, 'loading'));
            }

            for (const el of entries
                .filter(({ isIntersecting }) => isIntersecting)
                .map(({ target }) => target)) {
                observer.unobserve(el);
            }
        },
        ...options,
    });
}

export function scroll(options) {
    return observe(
        function (target, handler) {
            const off = on(target, 'scroll', handler, {
                passive: true,
                capture: true,
            });

            return {
                disconnect: off,
            };
        },
        {
            target: window,
            ...options,
        },
        'scroll'
    );
}

function observe(observe, options, emit) {
    return {
        observe,
        handler() {
            this.$emit(emit);
        },
        ...options,
    };
}
