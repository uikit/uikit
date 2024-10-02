import { hasOwn, isArray, isPlainObject, on } from 'uikit-util';

export function initEvents(instance) {
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

export function registerEvent(instance, event, key) {
    let { name, el, handler, capture, passive, delegate, filter, self } = isPlainObject(event)
        ? event
        : { name: key, handler: event };
    el = el ? el.call(instance, instance) : instance.$el;

    if (!el || (isArray(el) && !el.length) || (filter && !filter.call(instance, instance))) {
        return;
    }

    instance._disconnect.push(
        on(el, name, delegate?.call(instance, instance), handler.bind(instance), {
            passive,
            capture,
            self,
        }),
    );
}
