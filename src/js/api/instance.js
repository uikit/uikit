import { update } from './global';
import { callUpdate } from './update';
import { $, remove, within } from 'uikit-util';
import { callConnected, callDisconnected, callHook } from './hooks';
import { attachToElement, createComponent, detachFromElement, getComponent } from './component';

export default function (App) {
    App.prototype.$mount = function (el) {
        const instance = this;
        attachToElement(el, instance);

        instance.$options.el = el;

        if (within(el, document)) {
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

export function generateId(instance, el = instance.$el, postfix = '') {
    if (el.id) {
        return el.id;
    }

    let id = `${instance.$options.id}-${instance._uid}${postfix}`;

    if ($(`#${id}`)) {
        id = generateId(instance, el, `${postfix}-2`);
    }

    return id;
}
