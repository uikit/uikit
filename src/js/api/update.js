import { assign, fastdom, isPlainObject } from 'uikit-util';

export function initUpdates(instance) {
    instance._data = {};
    instance._updates = [...(instance.$options.update || [])];

    instance._disconnect.push(() => (instance._updates = instance._data = null));
}

export function prependUpdate(instance, update) {
    instance._updates.unshift(update);
}

export function callUpdate(instance, e = 'update') {
    if (!instance._connected) {
        return;
    }

    if (!instance._updates.length) {
        return;
    }

    if (!instance._queued) {
        instance._queued = new Set();
        fastdom.read(() => {
            if (instance._connected) {
                runUpdates(instance, instance._queued);
            }
            instance._queued = null;
        });
    }

    instance._queued.add(e.type || e);
}

function runUpdates(instance, types) {
    for (const { read, write, events = [] } of instance._updates) {
        if (!types.has('update') && !events.some((type) => types.has(type))) {
            continue;
        }

        let result;
        if (read) {
            result = read.call(instance, instance._data, types);

            if (result && isPlainObject(result)) {
                assign(instance._data, result);
            }
        }

        if (write && result !== false) {
            fastdom.write(() => {
                if (instance._connected) {
                    write.call(instance, instance._data, types);
                }
            });
        }
    }
}
