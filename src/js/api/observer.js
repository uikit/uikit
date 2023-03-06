export function initObservers(instance) {
    instance._observers = [];
}

export function registerObserver(instance, ...observer) {
    instance._observers.push(...observer);
}

export function disconnectObservers(instance) {
    instance._observers.forEach((observer) => observer?.disconnect());
}
