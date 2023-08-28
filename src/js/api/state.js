import { assign, isArray, isPlainObject, isUndefined } from 'uikit-util';
import { initComputed } from './computed';
import { callHook } from './hooks';
import { coerce, mergeOptions } from './options';

let uid = 0;

export function init(instance, options = {}) {
    options.data = normalizeData(options, instance.constructor.options);

    instance.$options = mergeOptions(instance.constructor.options, options, instance);

    instance.$props = {};

    instance._uid = uid++;
    initData(instance);
    initMethods(instance);
    initComputed(instance);
    callHook(instance, 'created');

    if (options.el) {
        instance.$mount(options.el);
    }
}

function initData(instance) {
    const { data = {} } = instance.$options;

    for (const key in data) {
        instance.$props[key] = instance[key] = data[key];
    }
}

function initMethods(instance) {
    const { methods } = instance.$options;

    if (methods) {
        for (const key in methods) {
            instance[key] = methods[key].bind(instance);
        }
    }
}

function normalizeData({ data = {} }, { args = [], props = {} }) {
    if (isArray(data)) {
        data = data.slice(0, args.length).reduce((data, value, index) => {
            if (isPlainObject(value)) {
                assign(data, value);
            } else {
                data[args[index]] = value;
            }
            return data;
        }, {});
    }

    for (const key in data) {
        if (isUndefined(data[key])) {
            delete data[key];
        } else if (props[key]) {
            data[key] = coerce(props[key], data[key]);
        }
    }

    return data;
}
