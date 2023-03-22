import { registerWatch } from './watch';
import { registerComputed } from './computed';
import { hasOwn, includes, isArray, isFunction, isString } from 'uikit-util';

export function initObservers(instance) {
    instance._observers = [];
    for (const observer of instance.$options.observe || []) {
        if (hasOwn(observer, 'handler')) {
            registerObservable(instance, observer);
        } else {
            for (const observable of observer) {
                registerObservable(instance, observable);
            }
        }
    }
}

export function registerObserver(instance, ...observer) {
    instance._observers.push(...observer);
}

export function disconnectObservers(instance) {
    for (const observer of instance._observers) {
        observer.disconnect();
    }
}

function registerObservable(instance, observable) {
    let { observe, target = instance.$el, handler, options, filter, args } = observable;

    if (filter && !filter.call(instance, instance)) {
        return;
    }

    const key = `_observe${instance._observers.length}`;
    if (isFunction(target) && !hasOwn(instance, key)) {
        registerComputed(instance, key, () => target.call(instance, instance));
    }

    handler = isString(handler) ? instance[handler] : handler.bind(instance);

    if (isFunction(options)) {
        options = options.call(instance, instance);
    }

    const targets = hasOwn(instance, key) ? instance[key] : target;
    const observer = observe(targets, handler, options, args);

    if (isFunction(target) && isArray(instance[key]) && observer.unobserve) {
        registerWatch(instance, { handler: updateTargets(observer), immediate: false }, key);
    }

    registerObserver(instance, observer);
}

function updateTargets(observer) {
    return (targets, prev) => {
        for (const target of prev) {
            !includes(targets, target) && observer.unobserve(target);
        }

        for (const target of targets) {
            !includes(prev, target) && observer.observe(target);
        }
    };
}
