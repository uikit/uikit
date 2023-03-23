import { runWatches } from './watch';
import { callUpdate, prependUpdate } from './update';
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

export function registerComputed(instance, key, cb) {
    instance._hasComputed = true;
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

export function initComputedUpdates(instance) {
    if (!instance._hasComputed) {
        return;
    }

    prependUpdate(instance, {
        read: () => runWatches(instance, resetComputed(instance)),
        events: ['resize', 'computed'],
    });

    registerComputedObserver();
    instances.add(instance);
}

export function disconnectComputedUpdates(instance) {
    instances?.delete(instance);
    resetComputed(instance);
}

function resetComputed(instance) {
    const values = { ...instance._computed };
    instance._computed = {};
    return values;
}

let observer;
let instances;
function registerComputedObserver() {
    if (observer) {
        return;
    }

    instances = new Set();
    observer = new MutationObserver(() => {
        for (const instance of instances) {
            callUpdate(instance, 'computed');
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
}
