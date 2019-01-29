import {assign, bind, camelize, data as getData, hasOwn, hyphenate, isArray, isBoolean, isEqual, isFunction, isPlainObject, isString, isUndefined, mergeOptions, on, parseOptions, startsWith, toBoolean, toList, toNumber} from 'uikit-util';

export default function (UIkit) {

    let uid = 0;

    UIkit.prototype._init = function (options) {

        options = options || {};
        options.data = normalizeData(options, this.constructor.options);

        this.$options = mergeOptions(this.constructor.options, options, this);
        this.$el = null;
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

        const {data = {}} = this.$options;

        for (const key in data) {
            this.$props[key] = this[key] = data[key];
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

        this._computeds = {};

        if (computed) {
            for (const key in computed) {
                registerComputed(this, key, computed[key]);
            }
        }
    };

    UIkit.prototype._callWatches = function () {

        const {$options: {computed}, _computeds} = this;

        for (const key in _computeds) {

            const value = _computeds[key];
            delete _computeds[key];

            if (computed[key].watch && !isEqual(value, this[key])) {
                computed[key].watch.call(this, this[key], value);
            }

        }

    };

    UIkit.prototype._initProps = function (props) {

        let key;

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
        if (this._observer || !props || attrs === false) {
            return;
        }

        attrs = isArray(attrs) ? attrs : Object.keys(props);

        this._observer = new MutationObserver(() => {

            const data = getProps(this.$options, this.$name);
            if (attrs.some(key => !isUndefined(data[key]) && data[key] !== this.$props[key])) {
                this.$reset();
            }

        });

        const filter = attrs.map(key => hyphenate(key)).concat(this.$name);

        this._observer.observe(el, {
            attributes: true,
            attributeFilter: filter.concat(filter.map(key => `data-${key}`))
        });
    };

    function getProps(opts, name) {

        const data = {};
        const {args = [], props = {}, el} = opts;

        if (!props) {
            return data;
        }

        for (const key in props) {
            const prop = hyphenate(key);
            let value = getData(el, prop);

            if (!isUndefined(value)) {

                value = props[key] === Boolean && value === ''
                    ? true
                    : coerce(props[key], value);

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
                data[prop] = coerce(props[prop], options[key]);
            }
        }

        return data;
    }

    function registerComputed(component, key, cb) {
        Object.defineProperty(component, key, {

            enumerable: true,

            get() {

                const {_computeds, $props, $el} = component;

                if (!hasOwn(_computeds, key)) {
                    _computeds[key] = (cb.get || cb).call(component, $props, $el);
                }

                return _computeds[key];
            },

            set(value) {

                const {_computeds} = component;

                _computeds[key] = cb.set ? cb.set.call(component, value) : value;

                if (isUndefined(_computeds[key])) {
                    delete _computeds[key];
                }
            }

        });
    }

    function registerEvent(component, event, key) {

        if (!isPlainObject(event)) {
            event = ({name: key, handler: event});
        }

        let {name, el, handler, capture, passive, delegate, filter, self} = event;
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
                isBoolean(passive)
                    ? {passive, capture}
                    : capture
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

    function coerce(type, value) {

        if (type === Boolean) {
            return toBoolean(value);
        } else if (type === Number) {
            return toNumber(value);
        } else if (type === 'list') {
            return toList(value);
        }

        return type ? type(value) : value;
    }

    function normalizeData({data, el}, {args, props = {}}) {
        data = isArray(data)
            ? args && args.length
                ? data.slice(0, args.length).reduce((data, value, index) => {
                    if (isPlainObject(value)) {
                        assign(data, value);
                    } else {
                        data[args[index]] = value;
                    }
                    return data;
                }, {})
                : undefined
            : data;

        if (data) {
            for (const key in data) {
                if (isUndefined(data[key])) {
                    delete data[key];
                } else {
                    data[key] = props[key] ? coerce(props[key], data[key], el) : data[key];
                }
            }
        }

        return data;
    }
}
