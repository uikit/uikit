import { assign, bind, camelize, coerce, getData, hasOwn, hyphenate, isArray, isJQuery, isPlainObject, isString, isUndefined, mergeOptions, Observer } from '../util/index';

export default function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);
        this.$props = {};

        this._frames = {reads: {}, writes: {}};

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._initComputeds();
        this._callHook('created');

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {

        var {defaults, data = {}, args = [], props = {}, el} = this.$options;

        if (args.length && isArray(data)) {
            data = data.slice(0, args.length).reduce((data, value, index) => {
                if (isPlainObject(value)) {
                    assign(data, value);
                } else {
                    data[args[index]] = value;
                }
                return data;
            }, {});
        }

        for (var key in defaults) {
            this.$props[key] = this[key] = hasOwn(data, key) && !isUndefined(data[key])
                ? coerce(props[key], data[key], el)
                : isArray(defaults[key])
                    ? defaults[key].concat()
                    : defaults[key];
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
        assign(this.$props, props || getProps(this.$options, this.$name));

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

        var {attrs, props, el} = this.$options;
        if (this._observer || !props || !attrs || !Observer) {
            return;
        }

        attrs = isArray(attrs) ? attrs : Object.keys(props).map(key => hyphenate(key));

        this._observer = new Observer(() => {

            var data = getProps(this.$options, this.$name);
            if (attrs.some(key => !equals(data[key], this.$props[key]))) {
                this.$reset(data);
            }

        });

        this._observer.observe(el, {attributes: true, attributeFilter: attrs.concat([this.$name, `data-${this.$name}`])});
    };

    function getProps(opts, name) {

        var data = {},
            {args = [], props = {}, el} = opts,
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

        var options = parseOptions(getData(el, name), args);

        for (key in options) {
            prop = camelize(key);
            if (props[prop] !== undefined) {
                data[prop] = coerce(props[prop], options[key], el);
            }
        }

        return data;
    }

    function parseOptions(options, args = []) {

        try {

            return !options
                ? {}
                : options[0] === '{'
                    ? JSON.parse(options)
                    : args.length && !~options.indexOf(':')
                        ? ({[args[0]]: options})
                        : options.split(';').reduce((options, option) => {
                            var [key, value] = option.split(/:(.+)/);
                            if (key && value) {
                                options[key.trim()] = value.trim();
                            }
                            return options;
                        }, {});

        } catch (e) {
            return {};
        }

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

        var {name, el, delegate, self, filter, handler} = event,
            namespace = `.${component.$options.name}.${component._uid}`;

        el = el && el.call(component) || component.$el;

        name = name.split(' ').map(name => `${name}.${namespace}`).join(' ');

        if (unbind) {

            el.off(name);

        } else {

            if (filter && !filter.call(component)) {
                return;
            }

            handler = isString(handler) ? component[handler] : bind(handler, component);

            if (self) {
                handler = selfFilter(handler, component);
            }

            if (delegate) {
                el.on(name, isString(delegate) ? delegate : delegate.call(component), handler);
            } else {
                el.on(name, handler);
            }
        }

    }

    function selfFilter(handler, context) {
        return function selfHandler(e) {
            if (e.target === e.currentTarget) {
                return handler.call(context, e)
            }
        }
    }

    function notIn(options, key) {
        return options.every(arr => !arr || !hasOwn(arr, key));
    }

    function equals(a, b) {
        return isUndefined(a) || a === b || isJQuery(a) && isJQuery(b) && a.is(b);
    }

}
