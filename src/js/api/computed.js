import { hasOwn, isUndefined } from 'uikit-util';

export function initComputed(instance) {
    const { computed } = instance.$options;

    instance._computed = {};

    if (computed) {
        for (const key in computed) {
            registerComputed(instance, key, computed[key]);
        }
    }
}

export function resetComputed(instance) {
    const values = { ...instance._computed };
    instance._computed = {};
    return values;
}

export function registerComputed(instance, key, cb) {
    Object.defineProperty(instance, key, {
        enumerable: true,

        get() {
            const { _computed, $props, $el } = instance;

            if (!hasOwn(_computed, key)) {
                _computed[key] = (cb.get || cb).call(instance, $props, $el);
            }

            return _computed[key];
        },

        set(value) {
            const { _computed } = instance;

            _computed[key] = cb.set ? cb.set.call(instance, value) : value;

            if (isUndefined(_computed[key])) {
                delete _computed[key];
            }
        },
    });
}
