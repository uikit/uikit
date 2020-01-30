import {$, apply, fastdom, isString, mergeOptions, parents, toNode} from 'uikit-util';

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
        const Sub = function UIkitComponent(options) {
            this._init(options);
        };

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub.super = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    let enqueued;
    UIkit.update = function (element, e) {

        if (!enqueued) {

            fastdom.read(() => {

                parents(enqueued).reverse().forEach(element => update(element[DATA], e));
                apply(enqueued, element => update(element[DATA], e));

                enqueued = false;
            });

        }

        enqueued = findCommonParent(enqueued, element ? toNode(element) : document.body);

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

    function findCommonParent(elementA, elementB) {

        if (!elementB) {
            return elementA;
        }

        if (!elementA) {
            return elementB;
        }

        do {

            if (elementA.contains(elementB)) {
                return elementA;
            }

        } while ((elementA = elementA.parentElement));

    }

}
