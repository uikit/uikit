import { fastdom, hasOwn, isEqual } from '../util';

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
    });
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
}

export function initWatchObserver(instance) {
    let { el, computed } = instance.$options;

    if (!computed) {
        return;
    }

    for (const key in computed) {
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

    return observer;
}
