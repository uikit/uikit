import { bind, camelize, coerce, createEvent, extend, hasOwn, hyphenate, isArray, isPlainObject, isString, mergeOptions } from '../util/index';

export default function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        UIkit.instances[uid] = this;

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._callHook('created');

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {

        var defaults = extend(true, {}, this.$options.defaults),
            data = this.$options.data || {},
            props = this.$options.props || {};

        if (defaults) {
            for (var key in defaults) {
                this[key] = hasOwn(data, key) ? coerce(props[key], data[key], this.$options.el) : defaults[key];
            }
        }
    };

    UIkit.prototype._initProps = function () {

        var el = this.$el[0],
            props = this.$options.props || {},
            options = el.getAttribute(this.$name);

        if (props) {
            for (var key in props) {
                var prop = hyphenate(key);
                if (el.hasAttribute(prop)) {
                    this[key] = coerce(props[key], el.getAttribute(prop), el)
                }
            }

            if (options) {
                if (options[0] === '{') {
                    try {
                        options = JSON.parse(options);
                    } catch (e) {
                        console.warn(`Invalid JSON.`);
                        options = {};
                    }
                } else {
                    var tmp = {};
                    options.split(';').forEach((option) => {
                        var [key, value] = option.split(/:(.+)/);
                        if (key && value) {
                            tmp[key.trim()] = value.trim();
                        }
                    });
                    options = tmp;
                }

                for (var key in options || {}) {
                    var prop = camelize(key);
                    if (props[prop] !== undefined) {
                        this[prop] = coerce(props[prop], options[key], el);
                    }
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

    UIkit.prototype._initEvents = function () {

        var events = this.$options.events,
            register = (name, fn) => this.$el.on(name, isString(fn) ? this[fn] : bind(fn, this));

        if (events) {
            for (var key in events) {

                if (isArray(events[key])) {
                    events[key].forEach(event => register(key, event));
                } else {
                    register(key, events[key]);
                }

            }
        }
    };

    UIkit.prototype._callReady = function () {
        this._isReady = true;
        this._callHook('ready');
        this._callUpdate();
    };

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(handler => handler.call(this));
        }
    };

    UIkit.prototype._callUpdate = function (e) {

        e = createEvent(e || 'update');

        var updates = this.$options.update;

        if (!updates) {
            return;
        }

        updates.forEach(update => {
            if (isPlainObject(update)) {

                if (e.type !== 'update' && update.events && update.events.indexOf(e.type) === -1) {
                    return;
                }

                update = update.handler;
            }

            update.call(this, e);
        });

    };

}
