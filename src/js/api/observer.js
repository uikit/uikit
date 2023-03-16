import {
    hasOwn,
    includes,
    isArray,
    isEqual,
    isFunction,
    isPlainObject,
    isString,
} from 'uikit-util';

export function initObservers(instance) {
    instance._observers = [];
    instance._observerUpdates = new Map();
    for (const observer of instance.$options.observe || []) {
        if (hasOwn(observer, 'handler')) {
            registerObservable(instance, observer);
        } else {
            for (const key in observer) {
                registerObservable(instance, observer[key], key);
            }
        }
    }
}

export function registerObserver(instance, ...observer) {
    instance._observers.push(...observer);
}

export function disconnectObservers(instance) {
    for (const observer of instance._observers) {
        observer?.disconnect();
        instance._observerUpdates.delete(observer);
    }
}

export function callObserverUpdates(instance) {
    for (const [observer, update] of instance._observerUpdates) {
        update(observer);
    }
}

function registerObservable(instance, observable, key) {
    let {
        observe,
        target = instance.$el,
        handler,
        options,
        filter,
        args,
    } = isPlainObject(observable) ? observable : { type: key, handler: observable };

    if (filter && !filter.call(instance, instance)) {
        return;
    }

    const targets = isFunction(target) ? target.call(instance, instance) : target;
    handler = isString(handler) ? instance[handler] : handler.bind(instance);

    if (isFunction(options)) {
        options = options.call(instance, instance);
    }

    const observer = observe(targets, handler, options, args);

    if (isFunction(target) && isArray(targets) && observer.unobserve) {
        instance._observerUpdates.set(observer, watchChange(instance, target, targets));
    }

    registerObserver(instance, observer);
}

function watchChange(instance, targetFn, targets) {
    return (observer) => {
        const newTargets = targetFn.call(instance, instance);

        if (isEqual(targets, newTargets)) {
            return;
        }

        targets.forEach((target) => !includes(newTargets, target) && observer.unobserve(target));
        newTargets.forEach((target) => !includes(targets, target) && observer.observe(target));
        targets.splice(0, targets.length, ...newTargets);
    };
}
