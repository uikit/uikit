import {bind, mergeOptions} from '../util/index';

var uid = 0;

export default function (UIkit) {

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;

        this._uid = uid++;
        this._initData();
        this._initMethods();

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {

        var defaults = this.$options.defaults,
            data = this.$options.data || {};

        if (defaults) {
            for (var key in defaults) {
                this[key] = data[key] || defaults[key];
            }
        }
    };

    UIkit.prototype._initProps = function () {

        var el = this.$options.el,
            props = this.$options.props;

        if (props) {
            props.forEach(key => {
                if (el.hasAttribute(key)) {
                    this[key] = el.getAttribute(key);
                }
            });
        }
    };

    UIkit.prototype._initMethods = function () {

        var methods = this.$options.methods;

        if (methods) {
            for (var key in methods) {
                this[key] = bind(methods[key], this);
            }
        }
    };

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this);
            }
        }
    };

}
