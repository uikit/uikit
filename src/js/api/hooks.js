import { initComputedUpdates } from './computed';
import { initEvents } from './events';
import { log } from './log';
import { initObservers } from './observer';
import { initProps, initPropsObserver } from './props';
import { callUpdate, initUpdates } from './update';
import { initWatches } from './watch';

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

    instance._disconnect = [];

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

    instance._disconnect.forEach((off) => off());
    instance._disconnect = null;

    callHook(instance, 'disconnected');

    instance._connected = false;
}
