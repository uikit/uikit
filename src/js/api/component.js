import { $, camelize, isPlainObject } from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (name, options) {

        UIkit.component.selector = (`${UIkit.component.selector},` || '') + `[uk-${name}]`;

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

        return UIkit.components[name];
    };

    UIkit.getComponents = element => element && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

    UIkit.connect = element => {

        if (!element[DATA]) {
            return;
        }

        if (!~UIkit.elements.indexOf(element)) {
            UIkit.elements.push(element);
        }

        for (var name in element[DATA]) {
            var component = element[DATA][name];
            if (!(component._uid in UIkit.instances)) {
                UIkit.instances[component._uid] = component;
                component._callHook('connected');
            }

        }

    };

    UIkit.disconnect = element => {

        var index = UIkit.elements.indexOf(element);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        for (var name in element[DATA]) {
            var component = element[DATA][name];
            if (component._uid in UIkit.instances) {
                delete UIkit.instances[component._uid];
                component._callHook('disconnected');
            }
        }

    }

}
