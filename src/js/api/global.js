import { $, classify, createEvent, isString, mergeOptions } from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.use = function (plugin) {

        if (plugin.installed) {
            return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    UIkit.mixin = function (mixin, component) {
        component = (isString(component) ? UIkit.components[component] : component) || this;
        component.options = mergeOptions(component.options, mixin);
    };

    UIkit.extend = function (options) {

        options = options || {};

        var Super = this, name = options.name || Super.options.name;
        var Sub = createClass(name || 'UIkitComponent');

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub['super'] = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    UIkit.update = function (e, element, parents = false) {

        e = createEvent(e || 'update');

        if (!element) {

            for (var id in UIkit.instances) {
                if (UIkit.instances[id]._isReady) {
                    UIkit.instances[id]._callUpdate(e);
                }
            }

            return;
        }

        element = $(element)[0];

        UIkit.elements.forEach(el => {
            if (el[DATA] && (el === element || $.contains.apply($, parents ? [el, element] : [element, el]))) {
                for (var name in el[DATA]) {
                    if (el[DATA][name]._isReady) {
                        el[DATA][name]._callUpdate(e);
                    }
                }
            }
        });

    };

    var container;
    Object.defineProperty(UIkit, 'container', {

        get() {
            return container || document.body;
        },

        set(element) {
            container = element;
        }

    });

}

function createClass(name) {
    return new Function(`return function ${classify(name)} (options) { this._init(options); }`)();
}
