import {bind, camelize, coerce, createEvent, extend, hasOwn, hyphenate, isArray, isPlainObject, isReady, isString, mergeOptions, requestAnimationFrame} from '../util/index';

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

        var defaults = extend(true, {}, this.$options.defaults),
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
                        this[prop] = coerce(props[prop], options[key]);
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

        var ready = () => {
            this._isReady = true;
            this._callHook('ready');
            this._callUpdate();
        };

        if (!isReady()) {
            requestAnimationFrame(ready);
        } else {
            ready();
        }

    };

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(handler => handler.call(this));
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
