import { $, camelize, fastdom, isJQuery, isPlainObject } from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (id, options) {

        var name = camelize(id);

        if (isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
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

            return $(element).toArray().map(element =>
                UIkit.getComponent(element, name) || new UIkit.components[name]({el: element, data: data || {}})
            )[0];
        };

        if (UIkit._initialized && !options.options.functional) {
            fastdom.measure(() => UIkit[name](`[uk-${id}],[data-uk-${id}]`));
        }

        return UIkit.components[name];
    };

    UIkit.getComponents = element => element && (element = isJQuery(element) ? element[0] : element) && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

    UIkit.connect = node => {

        var name;

        if (node[DATA]) {
            for (name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (var i = 0; i < node.attributes.length; i++) {

            name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0 || name.lastIndexOf('data-uk-', 0) === 0) {

                name = camelize(name.replace('data-uk-', '').replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }

    };

    UIkit.disconnect = node => {
        for (var name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    }

}
