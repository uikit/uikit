import $ from 'jquery';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (name, options) {

        options.name = name;

        UIkit.components[name] = UIkit.extend(options);

        UIkit[name] = function (element, data) {

            var result = [];

            $(element).each(function () {
                result.push(this[DATA] && this[DATA][name] || new UIkit.components[name]({el: this, data: data || {}}));
            });

            return typeof element === 'string' ? result : result[0];
        };

        return UIkit.components[name];
    };

}
