import $ from 'jquery';

export default function (UIkit) {

    UIkit.components = {};

    UIkit.component = function (name, options) {

        options.name = name;

        UIkit.components[name] = UIkit.extend(options);

        UIkit[name] = function (element, data) {

            var result = [];

            $(element).each(function () {
                result.push(this.__uikit__ && this.__uikit__[name] || new UIkit.components[name]({el: this, data: data || {}}));
            });

            return typeof element === 'string' ? result : result[0];
        };

        return UIkit.components[name];
    };

}
