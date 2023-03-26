import { registerObserver } from './observer';
import { coerce, parseOptions } from './options';
import { camelize, data as getData, hasOwn, hyphenate, isUndefined, startsWith } from 'uikit-util';

export function initProps(instance) {
    const props = getProps(instance.$options);

    for (let key in props) {
        if (!isUndefined(props[key])) {
            instance.$props[key] = props[key];
        }
    }

    const exclude = [instance.$options.computed, instance.$options.methods];
    for (let key in instance.$props) {
        if (key in props && notIn(exclude, key)) {
            instance[key] = instance.$props[key];
        }
    }
}

export function getProps(opts) {
    const data = {};
    const { args = [], props = {}, el, id } = opts;

    if (!props) {
        return data;
    }

    for (const key in props) {
        const prop = hyphenate(key);
        let value = getData(el, prop);

        if (isUndefined(value)) {
            continue;
        }

        value = props[key] === Boolean && value === '' ? true : coerce(props[key], value);

        if (prop === 'target' && startsWith(value, '_')) {
            continue;
        }

        data[key] = value;
    }

    const options = parseOptions(getData(el, id), args);

    for (const key in options) {
        const prop = camelize(key);
        if (!isUndefined(props[prop])) {
            data[prop] = coerce(props[prop], options[key]);
        }
    }

    return data;
}

function notIn(options, key) {
    return options.every((arr) => !arr || !hasOwn(arr, key));
}

export function initPropsObserver(instance) {
    const { $options, $props } = instance;
    const { id, props, el } = $options;

    if (!props) {
        return;
    }

    const attributes = Object.keys(props);
    const filter = attributes.map((key) => hyphenate(key)).concat(id);

    const observer = new MutationObserver((records) => {
        const data = getProps($options);
        if (
            records.some(({ attributeName }) => {
                const prop = attributeName.replace('data-', '');
                return (prop === id ? attributes : [camelize(prop), camelize(attributeName)]).some(
                    (prop) => !isUndefined(data[prop]) && data[prop] !== $props[prop]
                );
            })
        ) {
            instance.$reset();
        }
    });

    observer.observe(el, {
        attributes: true,
        attributeFilter: filter.concat(filter.map((key) => `data-${key}`)),
    });

    registerObserver(instance, observer);
}
