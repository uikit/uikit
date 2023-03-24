import { disconnectComputedUpdates, initComputedUpdates } from './computed';
import { log } from './log';
import { initWatches } from './watch';
import { callUpdate, clearUpdateData, initUpdates } from './update';
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

    initProps(instance);

    callHook(instance, 'beforeConnect');
    instance._connected = true;

    initEvents(instance);
    initUpdates(instance);
    initWatches(instance);
    initObservers(instance);

    initPropsObserver(instance);
    initComputedUpdates(instance);

    callHook(instance, 'connected');
    callUpdate(instance);
}

export function callDisconnected(instance) {
    if (!instance._connected) {
        return;
    }

    callHook(instance, 'beforeDisconnect');

    unbindEvents(instance);
    clearUpdateData(instance);
    disconnectObservers(instance);
    disconnectComputedUpdates(instance);

    callHook(instance, 'disconnected');

    instance._connected = false;
}
