import { init } from './state';
import { callUpdate } from './update';
import { mergeOptions } from './options';
import { component, getComponent, getComponents } from './component';
import { $, apply, isString, parents, toNode } from 'uikit-util';

export default function (App) {
    App.component = component;
    App.getComponents = getComponents;
    App.getComponent = getComponent;
    App.update = update;

    App.use = function (plugin) {
        if (plugin.installed) {
            return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    App.mixin = function (mixin, component) {
        component = (isString(component) ? this.component(component) : component) || this;
        component.options = mergeOptions(component.options, mixin);
    };

    App.extend = function (options) {
        options = options || {};

        const Super = this;
        const Sub = function UIkitComponent(options) {
            init(this, options);
        };

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub.super = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    let container;
    Object.defineProperty(App, 'container', {
        get() {
            return container || document.body;
        },

        set(element) {
            container = $(element);
        },
    });
}

export function update(element, e) {
    element = element ? toNode(element) : document.body;

    for (const parentEl of parents(element).reverse()) {
        updateElement(parentEl, e);
    }

    apply(element, (element) => updateElement(element, e));
}

function updateElement(element, e) {
    const components = getComponents(element);
    for (const name in components) {
        callUpdate(components[name], e);
    }
}
