import {bind, camelize, coerce, createEvent, hasOwn, hyphenate, isPlainObject, isString, mergeOptions} from '../util/index';

export default function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        UIkit.instances[uid] = this;

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
            data = this.$options.data || {},
            props = this.$options.props;

        if (defaults) {
            for (var key in defaults) {
                this[key] = hasOwn(data, key) ? coerce(props[key], data[key]) : defaults[key];
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
                    var opt = option.split(/:(.+)/).map((value) => { return value.trim(); }), key = camelize(opt[0]);
                    if (props[key] !== undefined) {
                        this[key] = coerce(props[key], opt[1]);
                    }
                });
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
            handlers.forEach(handler => {
                handler.call(this);
            });
        }
    };

    UIkit.prototype._callUpdate = function (e) {

        e = createEvent(e || 'update');

        var update = this.$options.update;

        if (!update) {
            return;
        }

        if (isPlainObject(update)) {

            if (e.type !== 'update' && update.events && update.events.indexOf(e.type) === -1) {
                return;
            }

            update = update.handler;
        }

        update.call(this, e);
    };

}
