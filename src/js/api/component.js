import $ from 'jquery';

export default function (UIkit) {

    let Component = UIkit.extend({

        methods: {

            $on(a1, a2, a3) {
                return $(this.$el || this).on(a1, a2, a3);
            },

            $one(a1, a2, a3) {
                return $(this.$el || this).one(a1, a2, a3);
            },

            $off(evt) {
                return $(this.$el || this).off(evt);
            },

            $trigger(evt, params) {
                return $(this.$el || this).trigger(evt, params);
            },

            $find(selector) {
                return $(this.$el ? this.$el : []).find(selector);
            }
        }

    });

    UIkit.components = {
        base: Component
    };

    UIkit.component = function (name, options) {

        options.name = name;

        UIkit.components[name] = Component.extend(options);

        UIkit[name] = function (element, data) {

            var result = [];

            $(element).each(function () {
                result.push(this.__uikit__ && this.__uikit__[name] || new UIkit.components[name]({el: this, data: data || {}}));
            });

            return typeof element === 'string' ? result : result[0];
        };

        return UIkit.components[name];
    }

}
