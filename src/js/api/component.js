import $ from 'jquery';
import {camelize, isPlainObject} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (name, options) {

        if (isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
        }

        UIkit.component.selector = (`${UIkit.component.selector},` || '') + `[uk-${name}]`;

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

    UIkit.getComponents = (element) => element && element[DATA] || {};
    UIkit.getComponent = (element, name) => UIkit.getComponents(element)[name];

}
