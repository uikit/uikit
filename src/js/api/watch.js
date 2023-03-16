import { fastdom, hasOwn, isEqual } from 'uikit-util';
import { callObserverUpdates } from './observer';

export function callWatches(instance) {
    if (instance._watch) {
        return;
    }

    const initial = !hasOwn(instance, '_watch');

    instance._watch = fastdom.read(() => {
        if (instance._connected) {
            runWatches(instance, initial);
        }
        instance._watch = null;
    }, true);
}

function runWatches(instance, initial) {
    const values = { ...instance._computed };
    instance._computed = {};

    for (const [key, { watch, immediate }] of Object.entries(instance.$options.computed || {})) {
        if (
            watch &&
            ((initial && immediate) ||
                (hasOwn(values, key) && !isEqual(values[key], instance[key])))
        ) {
            watch.call(instance, instance[key], initial ? undefined : values[key]);
        }
    }

    callObserverUpdates(instance);
}
