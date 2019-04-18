import {hyphenate, isEmpty, remove, within} from 'uikit-util';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {

        const {name} = this.$options;

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

    UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
    };

    UIkit.prototype.$reset = function () {
        this._callDisconnected();
        this._callConnected();
    };

    UIkit.prototype.$destroy = function (removeEl = false) {

        const {el, name} = this.$options;

        if (el) {
            this._callDisconnected();
        }

        this._callHook('destroy');

        if (!el || !el[DATA]) {
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

    UIkit.prototype.$create = function (component, element, data) {
        return UIkit[component](element, data);
    };

    UIkit.prototype.$update = UIkit.update;
    UIkit.prototype.$getComponent = UIkit.getComponent;

    const names = {};
    Object.defineProperties(UIkit.prototype, {

        $container: Object.getOwnPropertyDescriptor(UIkit, 'container'),

        $name: {

            get() {
                const {name} = this.$options;

                if (!names[name]) {
                    names[name] = UIkit.prefix + hyphenate(name);
                }

                return names[name];
            }

        }

    });

}
