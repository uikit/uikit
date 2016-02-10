import {bind, coerce, hyphenate, mergeOptions, isString, isPlainObject} from '../util/index';

export default function (UIkit) {

    var uid = 0;

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
            props = this.$options.props,
            options = el.getAttribute('uk-' + hyphenate(this.$options.name));

        if (props) {
            for (var key in props) {
                var prop = hyphenate(key);
                if (el.hasAttribute(prop)) {
                    this[key] = coerce(props[key], el.getAttribute(prop))
                }
            }

            if (options) {
                options.split(';').forEach((option) => {
                    var opt = option.split(/:(.+)/).map((value) => { return value.trim(); });
                    if (props[opt[0]] !== undefined) {
                        this[opt[0]] = coerce(props[opt[0]], opt[1]);
                    }
                });
            }
        }
    };

    UIkit.prototype._initMethods = function () {

        var methods = this.$options.methods,
            update = this.$options.update;;

        if (methods) {
            for (var key in methods) {
                this[key] = bind(methods[key], this);
            }
        }

        if (update) {
            this['update'] = bind(isPlainObject(update) ? update.handler : update, this);
        }

    };

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(handler => {

                if (isString(handler)) {
                    handler = this[handler];
                }

                handler.call(this);
            });
        }
    };

    UIkit.prototype._callUpdate = function (e) {

        var update = this.$options.update;

        if (this.update && !(isPlainObject(update) && update.events && update.events.indexOf(e.type) === -1)) {
            this.update(e);
        }

    };

}
