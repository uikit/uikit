export function log(instance, eventName, eventData) {
    console.log(
        `🔔 %s%s:%d %c%s`,
        createTimestamp(),
        instance.$options.name,
        instance._uid,
        'font-weight:bold;',
        eventName,
        [...(eventData ?? []), instance, instance.$el]
    );
}

function createTimestamp(time = new Date()) {
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()} `;
}
