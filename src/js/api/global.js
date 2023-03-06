import App from './app';
import { init } from './state';
import { callUpdate } from './update';
import { mergeOptions } from './options';
import { getComponents } from './component';
import { $, apply, assign, isString, parents, toNode } from '../util';

function use(plugin) {
    if (plugin.installed) {
        return;
    }

    plugin.call(null, this);
    plugin.installed = true;

    return this;
}

function mixin(mixin, component) {
    component = (isString(component) ? this.component(component) : component) || this;
    component.options = mergeOptions(component.options, mixin);
}

function extend(options) {
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

assign(App, {
    use,
    mixin,
    extend,
    update,
});

let container;
Object.defineProperty(App, 'container', {
    get() {
        return container || document.body;
    },

    set(element) {
        container = $(element);
    },
});
