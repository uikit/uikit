import $ from 'jquery';
import {uuid} from '../util/index';

export default function(UIkit) {

    let Component = UIkit.extend({

        init() {

            this.uuid      = uuid();
            this.component = this.constructor.name;

            if (this.$el && this.$el.length) {
                this.$el[0]['$'+this.component] = this;
            }
        },

        methods: {

            $on(a1,a2,a3) {
                return $(this.$el || this).on(a1,a2,a3);
            },

            $one(a1,a2,a3) {
                return $(this.$el || this).one(a1,a2,a3);
            },

            $off(evt) {
                return $(this.$el || this).off(evt);
            },

            $trigger(evt, params) {
                return $(this.$el || this).trigger(evt, params);
            },

            $find(selector) {
                return $(this.$el ? this.$el: []).find(selector);
            }
        }
    });

    UIkit.components = {
        base: Component
    };

    UIkit.component  = function(name, def) {

        def.name = name;

        UIkit.components[name] = Component.extend(def);

        UIkit[name] = function(element, options) {

            let key = '$'+name;

            element = $(element);
            options = options || {};

            element.each(function(){
                if (!this[key]) {
                    return (new UIkit.components[name]({el:this, props:options}));
                }
            });

            return element[0][key];
        }

        return UIkit.components[name];
    }

}
