import { hyphenate, isEmpty, memoize, remove, within } from 'uikit-util';

export default function (UIkit) {
    const DATA = UIkit.data;

    UIkit.prototype.$create = function (component, element, data) {
        return UIkit[component](element, data);
    };

    UIkit.prototype.$mount = function (el) {
        const { name } = this.$options;

        if (!el[DATA]) {
            el[DATA] = {};
        }

        if (el[DATA][name]) {
            return;
        }

        el[DATA][name] = this;

        this.$el = this.$options.el = this.$options.el || el;

        if (within(el, document)) {
            this._callConnected();
        }
    };

    UIkit.prototype.$reset = function () {
        this._callDisconnected();
        this._callConnected();
    };

    UIkit.prototype.$destroy = function (removeEl = false) {
        const { el, name } = this.$options;

        if (el) {
            this._callDisconnected();
        }

        this._callHook('destroy');

        if (!el?.[DATA]) {
            return;
        }

        delete el[DATA][name];

        if (!isEmpty(el[DATA])) {
            delete el[DATA];
        }

        if (removeEl) {
            remove(this.$el);
        }
    };

    UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
    };

    UIkit.prototype.$update = function (element = this.$el, e) {
        UIkit.update(element, e);
    };

    UIkit.prototype.$getComponent = UIkit.getComponent;

    const componentName = memoize((name) => UIkit.prefix + hyphenate(name));
    Object.defineProperties(UIkit.prototype, {
        $container: Object.getOwnPropertyDescriptor(UIkit, 'container'),

        $name: {
            get() {
                return componentName(this.$options.name);
            },
        },
    });
}
