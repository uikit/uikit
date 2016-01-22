import $ from 'jquery';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.prototype.$on = function (a1, a2, a3) {
        return this.$el.on(a1, a2, a3);
    };

    UIkit.prototype.$one = function (a1, a2, a3) {
        return this.$el.one(a1, a2, a3);
    };

    UIkit.prototype.$off = function (e) {
        return this.$el.off(e);
    };

    UIkit.prototype.$trigger = function (e, params) {
        return this.$el.trigger(e, params);
    };

    UIkit.prototype.$find = function (selector) {
        return this.$el.find(selector);
    };

    UIkit.prototype.$mount = function (el) {

        var name = this.$options.name;

        el[DATA] = el[DATA] || {};

        if (el[DATA][name]) {
            console.warn('Component ' + name + ' already attached.');
        }

        el[DATA][name] = this;

        this.$el = $(el);

        this._initProps();
        this._callHook('ready');
    };

    UIkit.prototype.$destroy = function () {

        if (this.$options.el) {
            delete this.$options.el[DATA][this.$options.name];
        }

        this._callHook('destroy');
    };

}
