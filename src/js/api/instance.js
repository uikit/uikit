import { remove } from 'uikit-util';
import { attachToElement, createComponent, detachFromElement, getComponent } from './component';
import { update } from './global';
import { callConnected, callDisconnected, callHook } from './hooks';
import { callUpdate } from './update';

export default function (App) {
    App.prototype.$mount = function (el) {
        const instance = this;
        attachToElement(el, instance);

        instance.$options.el = el;

        if (el.isConnected) {
            callConnected(instance);
        }
    };

    App.prototype.$destroy = function (removeEl = false) {
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
    };

    App.prototype.$create = createComponent;
    App.prototype.$emit = function (e) {
        callUpdate(this, e);
    };

    App.prototype.$update = function (element = this.$el, e) {
        update(element, e);
    };

    App.prototype.$reset = function () {
        callDisconnected(this);
        callConnected(this);
    };

    App.prototype.$getComponent = getComponent;

    Object.defineProperties(App.prototype, {
        $el: {
            get() {
                return this.$options.el;
            },
        },

        $container: Object.getOwnPropertyDescriptor(App, 'container'),
    });
}

let id = 1;
export function generateId(instance, el = null) {
    return el?.id || `${instance.$options.id}-${id++}`;
}
