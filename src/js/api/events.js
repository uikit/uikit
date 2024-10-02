import { hasOwn, on } from 'uikit-util';

export function initEvents(instance) {
    for (const event of instance.$options.events || []) {
        if (hasOwn(event, 'handler')) {
            registerEvent(instance, event);
        } else {
            for (const key in event) {
                registerEvent(instance, { name: key, handler: event[key] });
            }
        }
    }
}

function registerEvent(instance, { name, el, handler, capture, passive, delegate, filter, self }) {
    if (filter && !filter.call(instance, instance)) {
        return;
    }

    instance._disconnect.push(
        on(
            el ? el.call(instance, instance) : instance.$el,
            name,
            delegate?.call(instance, instance),
            handler.bind(instance),
            {
                passive,
                capture,
                self,
            },
        ),
    );
}
