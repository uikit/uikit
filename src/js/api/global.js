import {$, apply, isString, mergeOptions, toNode} from 'uikit-util';

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
        component = (isString(component) ? UIkit.component(component) : component) || this;
        component.options = mergeOptions(component.options, mixin);
    };

    UIkit.extend = function (options) {

        options = options || {};

        const Super = this;
        const Sub = function UIkitComponent (options) {
            this._init(options);
        };

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub.super = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    UIkit.update = function (element, e) {

        element = element ? toNode(element) : document.body;

        path(element, element => update(element[DATA], e));
        apply(element, element => update(element[DATA], e));

    };

    let container;
    Object.defineProperty(UIkit, 'container', {

        get() {
            return container || document.body;
        },

        set(element) {
            container = $(element);
        }

    });

    function update(data, e) {

        if (!data) {
            return;
        }

        for (const name in data) {
            if (data[name]._connected) {
                data[name]._callUpdate(e);
            }
        }

    }

    function path(node, fn) {
        if (node && node !== document.body && node.parentNode) {
            path(node.parentNode, fn);
            fn(node.parentNode);
        }
    }

}
