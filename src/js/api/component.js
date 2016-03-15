import $ from 'jquery';
import {isString, isPlainObject, camelize} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (name, options) {

        if (isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
        }

        UIkit.component.selector = (UIkit.component.selector + ',' || '') + `[uk-${name}]`;

        name = camelize(name);

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {

            var result = [];

            data = data || {};

            $(element).each((i, el) => result.push(el[DATA] && el[DATA][name] || new UIkit.components[name]({el, data})));

            return result;
        };

        return UIkit.components[name];
    };

    UIkit.getComponent = function (element, name) {
        return element[DATA] && element[DATA][name];
    }

}
