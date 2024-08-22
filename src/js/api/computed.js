import { hasOwn, isUndefined, observeMutation } from 'uikit-util';
import { callUpdate, prependUpdate } from './update.js';
import { runWatches } from './watch.js';

export function initComputed(instance) {
    const { computed } = instance.$options;

    instance._computed = {};

    if (computed) {
        for (const key in computed) {
            registerComputed(instance, key, computed[key]);
        }
    }
}
const mutationOptions = { subtree: true, childList: true };
export function registerComputed(instance, key, cb) {
    instance._hasComputed = true;
    Object.defineProperty(instance, key, {
        enumerable: true,

        get() {
            const { _computed, $props, $el } = instance;

            if (!hasOwn(_computed, key)) {
                _computed[key] = (cb.get || cb).call(instance, $props, $el);
                if (cb.observe && instance._computedObserver) {
                    const selector = cb.observe.call(instance, $props);
                    instance._computedObserver.observe(
                        ['~', '+', '-'].includes(selector[0])
                            ? $el.parentElement
                            : $el.getRootNode(),
                        mutationOptions,
                    );
                }
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

export function initComputedUpdates(instance) {
    if (!instance._hasComputed) {
        return;
    }

    prependUpdate(instance, {
        read: () => runWatches(instance, resetComputed(instance)),
        events: ['resize', 'computed'],
    });

    instance._computedObserver = observeMutation(
        instance.$el,
        () => callUpdate(instance, 'computed'),
        mutationOptions,
    );

    instance._disconnect.push(() => {
        instance._computedObserver.disconnect();
        instance._computedObserver = null;
        resetComputed(instance);
    });
}

function resetComputed(instance) {
    const values = { ...instance._computed };
    instance._computed = {};
    return values;
}
