import { hasOwn, isEqual, isPlainObject } from 'uikit-util';

export function initWatches(instance) {
    instance._watches = [];
    for (const watches of instance.$options.watch || []) {
        for (const [name, watch] of Object.entries(watches)) {
            registerWatch(instance, watch, name);
        }
    }
    instance._initial = true;
}

export function registerWatch(instance, watch, name) {
    instance._watches.push({
        name,
        ...(isPlainObject(watch) ? watch : { handler: watch }),
    });
}

export function runWatches(instance, values) {
    for (const { name, handler, immediate = true } of instance._watches) {
        if (
            (instance._initial && immediate) ||
            (hasOwn(values, name) && !isEqual(values[name], instance[name]))
        ) {
            handler.call(instance, instance[name], values[name]);
        }
    }
    instance._initial = false;
}
