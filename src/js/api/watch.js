import { resetComputed } from './computed';
import { prependUpdate } from './update';
import { hasOwn, isEqual, isPlainObject } from 'uikit-util';

export function initWatches(instance) {
    instance._watches = [];
    for (const watches of instance.$options.watch || []) {
        for (const [name, watch] of Object.entries(watches)) {
            registerWatch(instance, watch, name);
        }
    }
    instance._initial = true;
    prependUpdate(instance, { read: () => callWatches(instance), events: ['resize'] });
}

export function registerWatch(instance, watch, name) {
    instance._watches.push({
        name,
        ...(isPlainObject(watch) ? watch : { handler: watch }),
    });

    if (watch.document) {
        instance._observeTarget = instance.$options.el.ownerDocumentocument;
    }
}

export function callWatches(instance) {
    if (!instance._connected) {
        return;
    }

    runWatches(instance, instance._initial);
    instance._initial = false;
}

function runWatches(instance, initial) {
    const values = resetComputed(instance);

    for (const { name, handler, immediate = true } of instance._watches) {
        if (
            (initial && immediate) ||
            (hasOwn(values, name) && !isEqual(values[name], instance[name]))
        ) {
            handler.call(instance, instance[name], initial ? undefined : values[name]);
        }
    }
}
