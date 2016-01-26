import {bind, mergeOptions, isPlainObject} from '../util/index';

var uid = 0;

export default function (UIkit) {

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;

        this._uid = uid++;

        UIkit.instances[this._uid] = this;

        this._initData();
        this._initMethods();

        this._callHook('init');

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
            props = this.$options.props, val, type;

        if (props) {
            for (var key in props) {
                if (el.hasAttribute(key)) {
                    type = props[key];
                    val = el.getAttribute(key);

                    if (type === Boolean && val.toLowerCase() === 'false') {
                        val = false;
                    }

                    this[key] = type(val);
                }
            }
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

    UIkit.prototype._callUpdate = function (e) {

        var handlers = this.$options['update'];

        if (handlers) {
            handlers.forEach(handler => {
                if (isPlainObject(handler)) {

                    if (handler.on && handler.on.indexOf(e.type) === -1) {
                        return;
                    }

                    handler = handler.handler;
                }

                handler.call(this, e);
            });
        }

    }

}
