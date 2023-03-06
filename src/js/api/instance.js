import App from './app';
import { update } from './global';
import { callUpdate } from './update';
import { registerObserver } from './observer';
import { assign, remove, within } from '../util';
import { callConnected, callDisconnected, callHook } from './hooks';
import { attachToElement, createComponent, detachFromElement, getComponent } from './component';

function $mount(el) {
    const instance = this;
    attachToElement(el, instance);

    instance.$options.el = el;

    if (within(el, document)) {
        callConnected(instance);
    }
}

function $destroy(removeEl = false) {
    const instance = this;
    const { el } = instance.$options;

    if (el) {
        callDisconnected(instance);
    }

    callHook(instance, 'destroy');

    detachFromElement(el, instance);

    if (removeEl) {
        remove(instance.$el);
    }
}

assign(App.prototype, {
    $create: createComponent,

    $mount,

    $emit(e) {
        callUpdate(this, e);
    },

    $update(element = this.$el, e) {
        update(element, e);
    },

    $reset() {
        callDisconnected(this);
        callConnected(this);
    },

    $destroy,

    $getComponent: getComponent,

    $registerObserver(...args) {
        registerObserver(this, ...args);
    },
});

Object.defineProperties(App.prototype, {
    $el: {
        get() {
            return this.$options.el;
        },
    },

    $container: Object.getOwnPropertyDescriptor(App, 'container'),
});
