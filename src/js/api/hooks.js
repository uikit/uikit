import { log } from './log';
import { callUpdate, initUpdateObserver } from './update';
import { initEvents, unbindEvents } from './events';
import { initProps, initPropsObserver } from './props';
import { disconnectObservers, initObservers } from './observer';

export function callHook(instance, hook) {
    LOG && log(instance, hook);
    instance.$options[hook]?.forEach((handler) => handler.call(instance));
}

export function callConnected(instance) {
    if (instance._connected) {
        return;
    }

    instance._data = {};
    instance._computed = {};

    initProps(instance);

    callHook(instance, 'beforeConnect');
    instance._connected = true;

    initEvents(instance);

    initObservers(instance);
    initPropsObserver(instance);
    initUpdateObserver(instance);

    callHook(instance, 'connected');
    callUpdate(instance);
}

export function callDisconnected(instance) {
    if (!instance._connected) {
        return;
    }

    callHook(instance, 'beforeDisconnect');
    disconnectObservers(instance);
    unbindEvents(instance);
    callHook(instance, 'disconnected');

    instance._connected = false;
    delete instance._watch;
}
