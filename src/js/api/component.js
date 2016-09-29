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

            data =  data || {};

            $(element).each((i, el) => result.push(el[DATA] && el[DATA][name] || new UIkit.components[name]({el, data})));

            return result;
        };

        return UIkit.components[name];
    };

    UIkit.getComponents = (element) => element && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

}
