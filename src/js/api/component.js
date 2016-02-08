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

        name = camelize(name);

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {

            var result = [];

            $(element).each(function () {
                result.push(this[DATA] && this[DATA][name] || new UIkit.components[name]({el: this, data: data || {}}));
            });

            return isString(element) ? result : result[0];
        };

        return UIkit.components[name];
    };

}
