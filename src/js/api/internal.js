import { bind, camelize, coerce, createEvent, extend, fastdom, hasOwn, hyphenate, isArray, isPlainObject, isString, mergeOptions } from '../util/index';

export default function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._callHook('created');

        this._frames = {reads: {}, writes: {}};

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {

        var defaults = extend(true, {}, this.$options.defaults),
            data = this.$options.data || {},
            args = this.$options.args || [],
            props = this.$options.props || {};

        if (!defaults) {
            return;
        }

        if (args.length && isArray(data)) {
            data = data.slice(0, args.length).reduce((data, value, index) => {
                if (isPlainObject(value)) {
                    extend(data, value);
                } else {
                    data[args[index]] = value;
                }
                return data;
            }, {});
        }

        for (var key in defaults) {
            this[key] = hasOwn(data, key) ? coerce(props[key], data[key], this.$options.el) : defaults[key];
        }
    };

    UIkit.prototype._initProps = function () {

        var el = this.$el[0],
            args = this.$options.args || [],
            props = this.$options.props || {},
            options = el.getAttribute(this.$name) || el.getAttribute(`data-${this.$name}`),
            key, prop;

        if (!props) {
            return;
        }

        for (key in props) {
            prop = hyphenate(key);
            if (el.hasAttribute(prop)) {

                var value = coerce(props[key], el.getAttribute(prop), el);

                if (prop === 'target' && (!value || value.lastIndexOf('_', 0) === 0)) {
                    continue;
                }

                this[key] = value;
            }
        }

        if (!options) {
            return;
        }

        if (options[0] === '{') {
            try {
                options = JSON.parse(options);
            } catch (e) {
                console.warn(`Invalid JSON.`);
                options = {};
            }
        } else if (args.length && !~options.indexOf(':')) {
            options = ({[args[0]]: options});
        } else {
            var tmp = {};
            options.split(';').forEach(option => {
                var [key, value] = option.split(/:(.+)/);
                if (key && value) {
                    tmp[key.trim()] = value.trim();
                }
            });
            options = tmp;
        }

        for (key in options || {}) {
            prop = camelize(key);
            if (props[prop] !== undefined) {
                this[prop] = coerce(props[prop], options[key], el);
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

    UIkit.prototype._initEvents = function (unbind) {

        var events = this.$options.events,
            connect = (event, key) => {

                if (!isPlainObject(event)) {
                    event = ({name: key, handler: event});
                }

                var {name, delegate, filter, handler} = event;

                name += `.${this.$options.name}`;

                if (unbind) {

                    this.$el.off(name);

                } else {

                    if (filter && !filter.call(this)) {
                        return;
                    }

                    handler = isString(handler) ? this[handler] : bind(handler, this);

                    if (delegate) {
                        this.$el.on(name, isString(delegate) ? delegate : delegate.call(this), handler);
                    } else {
                        this.$el.on(name, handler);
                    }
                }

            };

        if (events) {
            events.forEach(event => {

                if (!('handler' in event)) {
                    for (var key in event) {
                        connect(event[key], key);
                    }
                } else {
                    connect(event);
                }

            });
        }
    };

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(handler => handler.call(this));
        }
    };

    UIkit.prototype._callReady = function () {
        this._isReady = true;
        this._callHook('ready');
        this._callUpdate();
    };

    UIkit.prototype._callConnected = function () {

        if (this._connected) {
            return;
        }

        if (!~UIkit.elements.indexOf(this.$options.$el)) {
            UIkit.elements.push(this.$options.$el);
        }

        UIkit.instances[this._uid] = this;

        this._initEvents();
        this._callHook('connected');

        this._connected = true;

    };

    UIkit.prototype._callDisconnected = function () {

        if (!this._connected) {
            return;
        }

        var index = UIkit.elements.indexOf(this.$options.$el);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        delete UIkit.instances[this._uid];

        this._initEvents(true);
        this._callHook('disconnected');

        this._connected = false;
    };

    UIkit.prototype._callUpdate = function (e) {

        e = createEvent(e || 'update');

        var updates = this.$options.update;

        if (!updates) {
            return;
        }

        updates.forEach((update, i) => {

            if (e.type !== 'update' && (!update.events || !~update.events.indexOf(e.type))) {
                return;
            }

            if (e.sync) {

                if (update.read) {
                    update.read.call(this, e);
                }

                if (update.write) {
                    update.write.call(this, e);
                }

                return;

            }

            if (update.read && !~fastdom.reads.indexOf(this._frames.reads[i])) {
                this._frames.reads[i] = fastdom.measure(() => update.read.call(this, e));
            }

            if (update.write && !~fastdom.writes.indexOf(this._frames.writes[i])) {
                this._frames.writes[i] = fastdom.mutate(() => update.write.call(this, e));
            }

        });

    };

}
