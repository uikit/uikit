import {$$, assign, camelize, fastdom, hyphenate, isPlainObject, startsWith} from 'uikit-util';

export default function (UIkit) {

    const DATA = UIkit.data;

    const components = {};

    UIkit.component = function (name, options) {

        if (!options) {

            if (isPlainObject(components[name])) {
                components[name] = UIkit.extend(components[name]);
            }

            return components[name];

        }

        UIkit[name] = function (element, data) {

            const component = UIkit.component(name);

            if (isPlainObject(element)) {
                return new component({data: element});
            }

            if (component.options.functional) {
                return new component({data: [...arguments]});
            }

            return element && element.nodeType ? init(element) : $$(element).map(init)[0];

            function init(element) {

                const instance = UIkit.getComponent(element, name);

                if (instance) {
                    if (!data) {
                        return instance;
                    } else {
                        instance.$destroy();
                    }
                }

                return new component({el: element, data});

            }

        };

        const opt = isPlainObject(options) ? assign({}, options) : options.options;

        opt.name = name;

        if (opt.install) {
            opt.install(UIkit, opt, name);
        }

        if (UIkit._initialized && !opt.functional) {
            const id = hyphenate(id);
            fastdom.read(() => UIkit[name](`[uk-${id}],[data-uk-${id}]`));
        }

        return components[name] = isPlainObject(options) ? opt : options;
    };

    UIkit.getComponents = element => element && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

    UIkit.connect = node => {

        if (node[DATA]) {
            for (const name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (let i = 0; i < node.attributes.length; i++) {

            const name = getComponentName(node.attributes[i].name);

            if (name && name in components) {
                UIkit[name](node);
            }

        }

    };

    UIkit.disconnect = node => {
        for (const name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    };

}

export function getComponentName(attribute) {
    return startsWith(attribute, 'uk-') || startsWith(attribute, 'data-uk-')
        ? camelize(attribute.replace('data-uk-', '').replace('uk-', ''))
        : false;
}
