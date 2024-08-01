import {
    assign,
    camelize,
    data as getData,
    hasOwn,
    hyphenate,
    isUndefined,
    memoize,
    startsWith,
} from 'uikit-util';
import { coerce, parseOptions } from './options';

export function initProps(instance) {
    const { $options, $props } = instance;
    const props = getProps($options);

    assign($props, props);

    const { computed, methods } = $options;
    for (let key in $props) {
        if (
            key in props &&
            (!computed || !hasOwn(computed, key)) &&
            (!methods || !hasOwn(methods, key))
        ) {
            instance[key] = $props[key];
        }
    }
}

function getProps(opts) {
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

const getAttributes = memoize((id, props) => {
    const attributes = Object.keys(props);
    const filter = attributes
        .concat(id)
        .map((key) => [hyphenate(key), `data-${hyphenate(key)}`])
        .flat();
    return { attributes, filter };
});

export function initPropsObserver(instance) {
    const { $options, $props } = instance;
    const { id, props, el } = $options;

    if (!props) {
        return;
    }

    const { attributes, filter } = getAttributes(id, props);

    const observer = new MutationObserver((records) => {
        const data = getProps($options);
        if (
            records.some(({ attributeName }) => {
                const prop = attributeName.replace('data-', '');
                return (prop === id ? attributes : [camelize(prop), camelize(attributeName)]).some(
                    (prop) => !isUndefined(data[prop]) && data[prop] !== $props[prop],
                );
            })
        ) {
            instance.$reset();
        }
    });

    observer.observe(el, {
        attributes: true,
        attributeFilter: filter,
    });

    instance._disconnect.push(() => observer.disconnect());
}
