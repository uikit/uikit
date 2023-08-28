export function log(instance, eventName, eventData) {
    console.log(
        `🔔 %s:%d %c%s`,
        instance.$options.name,
        instance._uid,
        'font-weight:bold;',
        eventName,
        [...(eventData ?? []), instance, instance.$el],
    );
}
