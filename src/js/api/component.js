import { $$, camelize, hyphenate, isPlainObject } from 'uikit-util';

const components = {};
export default function (UIkit) {
    const { data: DATA, prefix: PREFIX } = UIkit;

    UIkit.component = function (name, options) {
        name = hyphenate(name);
        const id = PREFIX + name;

        if (!options) {
            if (isPlainObject(components[id])) {
                components[id] = components[`data-${id}`] = UIkit.extend(components[id]);
            }

            return components[id];
        }

        name = camelize(name);

        UIkit[name] = function (element, data) {
            const component = UIkit.component(name);

            return component.options.functional
                ? new component({ data: isPlainObject(element) ? element : [...arguments] })
                : element
                ? $$(element).map(init)[0]
                : init();

            function init(element) {
                const instance = UIkit.getComponent(element, name);

                if (instance) {
                    if (data) {
                        instance.$destroy();
                    } else {
                        return instance;
                    }
                }

                return new component({ el: element, data });
            }
        };

        const opt = isPlainObject(options) ? { ...options } : options.options;

        opt.id = id;
        opt.name = name;

        opt.install?.(UIkit, opt, name);

        if (UIkit._initialized && !opt.functional) {
            requestAnimationFrame(() => UIkit[name](`[${id}],[data-${id}]`));
        }

        return (components[id] = components[`data-${id}`] = isPlainObject(options) ? opt : options);
    };

    UIkit.getComponents = (element) => element?.[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

    UIkit.connect = (node) => {
        if (node[DATA]) {
            for (const name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (const attribute of node.getAttributeNames()) {
            const name = getComponentName(attribute);
            name && UIkit[name](node);
        }
    };

    UIkit.disconnect = (node) => {
        for (const name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    };
}

export function getComponentName(attribute) {
    const cmp = components[attribute];
    return cmp && (isPlainObject(cmp) ? cmp : cmp.options).name;
}
