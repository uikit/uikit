import { registerObserver } from './observer';
import { callWatches } from './watch';
import { assign, fastdom, isFunction, isPlainObject } from 'uikit-util';

export function callUpdate(instance, e = 'update') {
    if (!instance._connected) {
        return;
    }

    if (e === 'update' || e === 'resize') {
        callWatches(instance);
    }

    if (!instance.$options.update) {
        return;
    }

    if (!instance._updates) {
        instance._updates = new Set();
        fastdom.read(() => {
            if (instance._connected) {
                runUpdates(instance, instance._updates);
            }
            delete instance._updates;
        });
    }

    instance._updates.add(e.type || e);
}

function runUpdates(instance, types) {
    for (const { read, write, events = [] } of instance.$options.update) {
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

export function initUpdateObserver(instance) {
    let { el, computed, observe } = instance.$options;

    if (!computed && !observe?.some((options) => isFunction(options.target))) {
        return;
    }

    for (const key in computed || {}) {
        if (computed[key].document) {
            el = el.ownerDocument;
            break;
        }
    }

    const observer = new MutationObserver(() => callWatches(instance));
    observer.observe(el, {
        childList: true,
        subtree: true,
    });

    registerObserver(instance, observer);
}
