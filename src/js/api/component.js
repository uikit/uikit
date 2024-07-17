import { $$, camelize, hyphenate, isEmpty, isPlainObject } from 'uikit-util';
import App from './app';

const PREFIX = 'uk-';
const DATA = '__uikit__';

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
    return element?.[DATA] || {};
}

export function getComponent(element, name) {
    return getComponents(element)[name];
}

export function attachToElement(element, instance) {
    if (!element[DATA]) {
        element[DATA] = {};
    }

    element[DATA][instance.$options.name] = instance;
}

export function detachFromElement(element, instance) {
    delete element[DATA]?.[instance.$options.name];

    if (isEmpty(element[DATA])) {
        delete element[DATA];
    }
}
