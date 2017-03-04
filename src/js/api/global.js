import { classify, createEvent, isString, mergeOptions, toNode } from '../util/index';

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

            update(UIkit.instances, e);
            return;

        }

        element = toNode(element);

        if (parents) {

            do {

                update(element[DATA], e);
                element = element.parentNode;

            } while (element)

        } else {

            apply(element, element => update(element[DATA], e));

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

function apply(node, fn) {

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    fn(node);
    node = node.firstChild;
    while (node) {
        apply(node, fn);
        node = node.nextSibling;
    }
}

function update(data, e) {

    if (!data) {
        return;
    }

    for (var name in data) {
        if (data[name]._isReady) {
            data[name]._callUpdate(e);
        }
    }

}
