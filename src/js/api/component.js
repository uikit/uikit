import {$$, camelize, fastdom, isJQuery, isPlainObject, isUndefined, startsWith} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (id, options) {

        const name = camelize(id);

        if (isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
        } else if (isUndefined(options)) {
            return UIkit.components[name];
        } else {
            options.options.name = name;
        }

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {

            if (isPlainObject(element)) {
                return new UIkit.components[name]({data: element});
            }

            if (UIkit.components[name].options.functional) {
                return new UIkit.components[name]({data: [...arguments]});
            }

            return element && element.nodeType ? init(element) : $$(element).map(init)[0];

            function init(element) {

                const cmp = UIkit.getComponent(element, name);

                if (cmp && data) {
                    cmp.$reset(data);
                }

                return cmp || new UIkit.components[name]({el: element, data: data || {}});
            }

        };

        if (UIkit._initialized && !options.options.functional) {
            fastdom.read(() => UIkit[name](`[uk-${id}],[data-uk-${id}]`));
        }

        return UIkit.components[name];
    };

    UIkit.getComponents = element => element && (element = isJQuery(element) ? element[0] : element) && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

    UIkit.connect = node => {

        if (node[DATA]) {
            for (const name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (let i = 0; i < node.attributes.length; i++) {

            const name = getComponentName(node.attributes[i].name);

            if (name && name in UIkit.components) {
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
