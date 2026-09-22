import { $$, camelize, hyphenate, isEmpty, isPlainObject } from 'uikit-util';
import App from './app';

const PREFIX = 'uk-';
const elementComponents = new WeakMap();

export const components = {};

export function component(name, options) {
    const id = PREFIX + hyphenate(name);

    if (!options) {
        if (!components[id].options) {
            components[id] = App.extend(components[id]);
        }

        return components[id];
    }

    name = camelize(name);

    App[name] = (element, data) => createComponent(name, element, data);

    const opt = options.options ?? { ...options };

    opt.id = id;
    opt.name = name;

    opt.install?.(App, opt, name);

    if (App._initialized && !opt.functional) {
        requestAnimationFrame(() => createComponent(name, `[${id}],[data-${id}]`));
    }

    return (components[id] = opt);
}

export function createComponent(name, element, data, ...args) {
    const Component = component(name);

    return Component.options.functional
        ? new Component({ data: isPlainObject(element) ? element : [element, data, ...args] })
        : element
          ? $$(element).map(init)[0]
          : init();

    function init(element) {
        const instance = getComponent(element, name);

        if (instance) {
            if (data) {
                instance.$destroy();
            } else {
                return instance;
            }
        }

        return new Component({ el: element, data });
    }
}

export function getComponents(element) {
    return elementComponents.get(element) || {};
}

export function getComponent(element, name) {
    return getComponents(element)[name];
}

export function attachToElement(element, instance) {
    let components = elementComponents.get(element);

    if (!components) {
        components = {};
        elementComponents.set(element, components);
    }

    components[instance.$options.name] = instance;
}

export function detachFromElement(element, instance) {
    const components = elementComponents.get(element);
    delete components?.[instance.$options.name];

    if (isEmpty(components)) {
        elementComponents.delete(element);
    }
}
