import { bind, camelize, coerce, extend, hasOwn, hyphenate, isArray, isFunction, isJQuery, isPlainObject, isString, isUndefined, mergeOptions, Observer } from '../util/index';

export default function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);
        this.$props = {};

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._initComputeds();
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
            this.$props[key] = this[key] = hasOwn(data, key) ? coerce(props[key], data[key], this.$options.el) : defaults[key];
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

    UIkit.prototype._initComputeds = function () {

        var computed = this.$options.computed;

        this._computeds = {};

        if (computed) {
            for (var key in computed) {
                registerComputed(this, key, computed[key]);
            }
        }
    };

    UIkit.prototype._initProps = function (props) {

        this._computeds = {};
        extend(this.$props, props || this._getProps());

        var exclude = [this.$options.computed, this.$options.methods];
        for (var key in this.$props) {
            if (notIn(exclude, key)) {
                this[key] = this.$props[key];
            }
        }
    };

    UIkit.prototype._initEvents = function (unbind) {

        var events = this.$options.events;

        if (events) {
            events.forEach(event => {

                if (!hasOwn(event, 'handler')) {
                    for (var key in event) {
                        registerEvent(this, unbind, event[key], key);
                    }
                } else {
                    registerEvent(this, unbind, event);
                }

            });
        }
    };

    UIkit.prototype._initObserver = function () {

        if (this._observer || !this.$options.props || !this.$options.attrs || !Observer) {
            return;
        }

        this._observer = new Observer(mutations => {

            var data = this._getProps(true),
                changed = mutations
                    .map(mutation => camelize(mutation.attributeName))
                    .some(key => !equals(data[key], this.$props[key]));

            if (changed) {
                this.$reset(data);
            }

        });

        this._observer.observe(this.$options.el, {
            attributes: true,
            attributeFilter: Object.keys(this.$options.props).map(key => hyphenate(key))
        });
    };

    UIkit.prototype._getProps = function (attrs = false) {

        var data = {},
            el = this.$el[0],
            args = this.$options.args || [],
            props = this.$options.props || {},
            options = el.getAttribute(this.$name) || el.getAttribute(`data-${this.$name}`),
            key, prop;

        if (!props) {
            return data;
        }

        for (key in props) {
            prop = hyphenate(key);
            if (el.hasAttribute(prop)) {

                var value = coerce(props[key], el.getAttribute(prop), el);

                if (prop === 'target' && (!value || value.lastIndexOf('_', 0) === 0)) {
                    continue;
                }

                data[key] = value;
            }
        }

        if (attrs || !options) {
            return data;
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
                data[prop] = coerce(props[prop], options[key], el);
            }
        }

        return data;
    };

}

function registerComputed(component, key, cb) {
    Object.defineProperty(component, key, {

        enumerable: true,

        get() {

            if (!hasOwn(component._computeds, key)) {
                component._computeds[key] = cb.call(component);
            }

            return component._computeds[key];
        },

        set(value) {
            component._computeds[key] = value;
        }

    });
}

function registerEvent(component, unbind, event, key) {

    if (!isPlainObject(event)) {
        event = ({name: key, handler: event});
    }

    var {name, el, delegate, self, filter, handler} = event;

    el = el && el.call(component) || component.$el;

    name += `.${component.$options.name}.${component._uid}`;

    if (unbind) {

        el.off(name);

    } else {

        if (filter && !filter.call(component)) {
            return;
        }

        handler = isString(handler) ? component[handler] : bind(handler, component);

        if (self) {
            var fn = handler;
            handler = (e) => {

                if (!el.is(e.target)) {
                    return;
                }

                return fn.call(component, e);
            }
        }

        if (delegate) {
            el.on(name, isString(delegate) ? delegate : delegate.call(component), handler);
        } else {
            el.on(name, handler);
        }
    }

}

function notIn(options, key) {
    return options.every(arr => !arr || !hasOwn(arr, key));
}

function equals(a, b) {
    return isUndefined(a) || a === b || isJQuery(a) && isJQuery(b) && a.is(b);
}
