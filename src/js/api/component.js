import { $, camelize, isPlainObject, matches } from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (name, options) {

        var selector = `[uk-${name}]`;

        UIkit.component.selector = (`${UIkit.component.selector},` || '') + selector;

        name = camelize(name);

        if (isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
        } else {
            options.options.name = name
        }

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {

            if (isPlainObject(element)) {
                return new UIkit.components[name]({data: element});
            }

            var result = [];

            data = data || {};

            $(element).each((i, el) => result.push(el[DATA] && el[DATA][name] || new UIkit.components[name]({el, data})));

            return result;
        };

        if (document.body) {
            UIkit[name](selector)
        }

        return UIkit.components[name];
    };

    UIkit.getComponents = element => element && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

    UIkit.connect = node => {

        if (node[DATA]) {

            if (!~UIkit.elements.indexOf(node)) {
                UIkit.elements.push(node);
            }

            for (var name in node[DATA]) {

                var component = node[DATA][name];
                if (!(component._uid in UIkit.instances)) {
                    UIkit.instances[component._uid] = component;
                    component._callHook('connected');
                }

            }
        }

        if (!matches(node, UIkit.component.selector)) {
            return;
        }

        for (var i = 0, name; i < node.attributes.length; i++) {

            name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0) {
                name = camelize(name.replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }

    };

    UIkit.disconnect = node => {

        var index = UIkit.elements.indexOf(node);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        for (var name in node[DATA]) {
            var component = node[DATA][name];
            if (component._uid in UIkit.instances) {
                delete UIkit.instances[component._uid];
                component._callHook('disconnected');
            }
        }

    }

}
