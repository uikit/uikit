import { hasOwn, isArray, isFunction, isPlainObject, isString, on } from '../util';

export function initEvents(instance) {
    instance._events = [];
    for (const event of instance.$options.events || []) {
        if (hasOwn(event, 'handler')) {
            registerEvent(instance, event);
        } else {
            for (const key in event) {
                registerEvent(instance, event[key], key);
            }
        }
    }
}

export function unbindEvents(instance) {
    instance._events.forEach((unbind) => unbind());
    delete instance._events;
}

export function registerEvent(instance, event, key) {
    if (!isPlainObject(event)) {
        event = { name: key, handler: event };
    }

    let { name, el, handler, capture, passive, delegate, filter, self } = event;
    el = isFunction(el) ? el.call(instance) : el || instance.$el;

    if (isArray(el)) {
        el.forEach((el) => registerEvent(instance, { ...event, el }, key));
        return;
    }

    if (!el || (filter && !filter.call(instance))) {
        return;
    }

    instance._events.push(
        on(
            el,
            name,
            delegate ? (isString(delegate) ? delegate : delegate.call(instance)) : null,
            isString(handler) ? instance[handler] : handler.bind(instance),
            { passive, capture, self }
        )
    );
}
