import { classify, isString, mergeOptions } from '../util/index';

export default function (UIkit) {

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

    UIkit.update = function (e) {
        for (var id in UIkit.instances) {
            if (UIkit.instances[id]._isReady) {
                UIkit.instances[id]._callUpdate(e);
            }
        }
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
