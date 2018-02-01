import {$, createEvent, doc, isString, mergeOptions, toNode} from '../util/index';

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
        mixin = mergeOptions({}, mixin);
        mixin.mixins = component.options.mixins;
        delete component.options.mixins;
        component.options = mergeOptions(mixin, component.options);
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

        Sub['super'] = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    UIkit.update = function (e, element, parents = false) {

        e = createEvent(e || 'update');

        if (!element) {

            update(UIkit.instances, e);
            return;

        }

        element = toNode(element);

        if (parents) {

            do {

                update(element[DATA], e);
                element = element.parentNode;

            } while (element);

        } else {

            apply(element, element => update(element[DATA], e));

        }

    };

    let container;
    Object.defineProperty(UIkit, 'container', {

        get() {
            return container || doc.body;
        },

        set(element) {
            container = $(element);
        }

    });

    function apply(node, fn) {

        if (node.nodeType !== 1) {
            return;
        }

        fn(node);
        node = node.firstElementChild;
        while (node) {
            apply(node, fn);
            node = node.nextElementSibling;
        }
    }

    function update(data, e) {

        if (!data) {
            return;
        }

        for (const name in data) {
            if (data[name]._isReady) {
                data[name]._callUpdate(e);
            }
        }

    }

}
