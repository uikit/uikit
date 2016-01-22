import $ from 'jquery';

export default function (UIkit) {

    UIkit.prototype.$on = function (a1, a2, a3) {
        return this.$el.on(a1, a2, a3);
    };

    UIkit.prototype.$one = function (a1, a2, a3) {
        return this.$el.one(a1, a2, a3);
    };

    UIkit.prototype.$off = function (evt) {
        return this.$el.off(evt);
    };

    UIkit.prototype.$trigger = function (evt, params) {
        return this.$el.trigger(evt, params);
    };

    UIkit.prototype.$find = function (selector) {
        return this.$el.find(selector);
    };

    UIkit.prototype.$destroy = function () {

        if (this.$options.el) {
            delete this.$options.el.__uikit__[this.$options.name];
        }

        this._callHook('destroy');
    };

}
