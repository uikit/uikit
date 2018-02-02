import {assign, attr, bind, camelize, data as getData, getCssVar, hasAttr, hasOwn, hyphenate, includes, isArray, isFunction, isPlainObject, isString, isUndefined, mergeOptions, Observer, on, query, startsWith, toBoolean, toFloat, toList, toNumber} from '../util/index';

export default function (UIkit) {

    let uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);
        this.$props = {};

        this._frames = {reads: {}, writes: {}};
        this._events = [];

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

        let {defaults, data = {}, args = [], props = {}, el} = this.$options;

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

        for (const key in assign({}, defaults, props)) {
            this.$props[key] = this[key] = hasOwn(data, key) && !isUndefined(data[key])
                ? coerce(props[key], data[key], el)
                : defaults
                    ? defaults[key] && isArray(defaults[key])
                        ? defaults[key].concat()
                        : defaults[key]
                    : null;
        }
    };

    UIkit.prototype._initMethods = function () {

        const {methods} = this.$options;

        if (methods) {
            for (const key in methods) {
                this[key] = bind(methods[key], this);
            }
        }
    };

    UIkit.prototype._initComputeds = function () {

        const {computed} = this.$options;

        this._resetComputeds();

        if (computed) {
            for (const key in computed) {
                registerComputed(this, key, computed[key]);
            }
        }
    };

    UIkit.prototype._resetComputeds = function () {
        this._computeds = {};
    };

    UIkit.prototype._initProps = function (props) {

        let key;

        this._resetComputeds();

        props = props || getProps(this.$options, this.$name);

        for (key in props) {
            if (!isUndefined(props[key])) {
                this.$props[key] = props[key];
            }
        }

        const exclude = [this.$options.computed, this.$options.methods];
        for (key in this.$props) {
            if (key in props && notIn(exclude, key)) {
                this[key] = this.$props[key];
            }
        }
    };

    UIkit.prototype._initEvents = function () {

        const {events} = this.$options;

        if (events) {

            events.forEach(event => {

                if (!hasOwn(event, 'handler')) {
                    for (const key in event) {
                        registerEvent(this, event[key], key);
                    }
                } else {
                    registerEvent(this, event);
                }

            });
        }
    };

    UIkit.prototype._unbindEvents = function () {
        this._events.forEach(unbind => unbind());
        this._events = [];
    };

    UIkit.prototype._initObserver = function () {

        let {attrs, props, el} = this.$options;
        if (this._observer || !props || !attrs || !Observer) {
            return;
        }

        attrs = isArray(attrs) ? attrs : Object.keys(props).map(key => hyphenate(key));

        this._observer = new Observer(() => {

            const data = getProps(this.$options, this.$name);
            if (attrs.some(key => !isUndefined(data[key]) && data[key] !== this.$props[key])) {
                this.$reset(data);
            }

        });

        this._observer.observe(el, {attributes: true, attributeFilter: attrs.concat([this.$name, `data-${this.$name}`])});
    };

    function getProps(opts, name) {

        const data = {};
        const {args = [], props = {}, el} = opts;

        if (!props) {
            return data;
        }

        for (const key in props) {
            const prop = hyphenate(key);
            if (hasAttr(el, prop)) {

                const value = coerce(props[key], attr(el, prop), el);

                if (prop === 'target' && (!value || startsWith(value, '_'))) {
                    continue;
                }

                data[key] = value;
            }
        }

        const options = parseOptions(getData(el, name), args);

        for (const key in options) {
            const prop = camelize(key);
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
                : startsWith(options, '{')
                    ? JSON.parse(options)
                    : args.length && !includes(options, ':')
                        ? ({[args[0]]: options})
                        : options.split(';').reduce((options, option) => {
                            const [key, value] = option.split(/:(.+)/);
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

                const {_computeds, $props, $el} = component;

                if (!hasOwn(_computeds, key)) {
                    _computeds[key] = cb.call(component, $props, $el);
                }

                return _computeds[key];
            },

            set(value) {
                component._computeds[key] = value;
            }

        });
    }

    function registerEvent(component, event, key) {

        if (!isPlainObject(event)) {
            event = ({name: key, handler: event});
        }

        let {name, el, handler, capture, delegate, filter, self} = event;
        el = isFunction(el)
            ? el.call(component)
            : el || component.$el;

        if (isArray(el)) {
            el.forEach(el => registerEvent(component, assign({}, event, {el}), key));
            return;
        }

        if (!el || filter && !filter.call(component)) {
            return;
        }

        handler = detail(isString(handler) ? component[handler] : bind(handler, component));

        if (self) {
            handler = selfFilter(handler);
        }

        component._events.push(
            on(
                el,
                name,
                !delegate
                    ? null
                    : isString(delegate)
                        ? delegate
                        : delegate.call(component),
                handler,
                capture
            )
        );

    }

    function selfFilter(handler) {
        return function selfHandler(e) {
            if (e.target === e.currentTarget || e.target === e.current) {
                return handler.call(null, e);
            }
        };
    }

    function notIn(options, key) {
        return options.every(arr => !arr || !hasOwn(arr, key));
    }

    function detail(listener) {
        return e => isArray(e.detail) ? listener(...[e].concat(e.detail)) : listener(e);
    }

    function coerce(type, value, context) {

        if (type === Boolean) {
            return toBoolean(value);
        } else if (type === Number) {
            return toNumber(value);
        } else if (type === 'query') {
            return query(value, context);
        } else if (type === 'list') {
            return toList(value);
        } else if (type === 'media') {
            return toMedia(value);
        }

        return type ? type(value) : value;
    }

    function toMedia(value) {

        if (isString(value)) {
            if (value[0] === '@') {
                const name = `media-${value.substr(1)}`;
                value = toFloat(getCssVar(name));
            } else if (isNaN(value)) {
                return value;
            }
        }

        return value && !isNaN(value) ? `(min-width: ${value}px)` : false;
    }

}
