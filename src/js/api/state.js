import {assign, camelize, data as getData, hasOwn, hyphenate, isArray, isEmpty, isFunction, isNumeric, isPlainObject, isString, isUndefined, mergeOptions, on, parseOptions, startsWith, toBoolean, toNumber} from 'uikit-util';

export default function (UIkit) {

    let uid = 0;

    UIkit.prototype._init = function (options) {

        options = options || {};
        options.data = normalizeData(options, this.constructor.options);

        this.$options = mergeOptions(this.constructor.options, options, this);
        this.$el = null;
        this.$props = {};

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
                this[key] = methods[key].bind(this);
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

        this._events = [];

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
        delete this._events;
    };

    UIkit.prototype._initObservers = function () {
        this._observers = [
            initChildListObserver(this),
            initPropsObserver(this)
        ];
    };

    UIkit.prototype._disconnectObservers = function () {
        this._observers.forEach(observer =>
            observer && observer.disconnect()
        );
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

            if (isUndefined(value)) {
                continue;
            }

            value = props[key] === Boolean && value === ''
                ? true
                : coerce(props[key], value);

            if (prop === 'target' && (!value || startsWith(value, '_'))) {
                continue;
            }

            data[key] = value;
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

        component._events.push(
            on(
                el,
                name,
                !delegate
                    ? null
                    : isString(delegate)
                        ? delegate
                        : delegate.call(component),
                isString(handler) ? component[handler] : handler.bind(component),
                {passive, capture, self}
            )
        );

    }

    function notIn(options, key) {
        return options.every(arr => !arr || !hasOwn(arr, key));
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

    function toList(value) {
        return isArray(value)
            ? value
            : isString(value)
                ? value.split(/,(?![^(]*\))/).map(value => isNumeric(value)
                    ? toNumber(value)
                    : toBoolean(value.trim()))
                : [value];
    }

    function normalizeData({data}, {args, props = {}}) {
        data = isArray(data)
            ? !isEmpty(args)
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
                    data[key] = props[key] ? coerce(props[key], data[key]) : data[key];
                }
            }
        }

        return data;
    }

    function initChildListObserver(component) {
        const {el} = component.$options;

        const observer = new MutationObserver(() => component.$emit());
        observer.observe(el, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    function initPropsObserver(component) {

        const {$name, $options, $props} = component;
        const {attrs, props, el} = $options;

        if (!props || attrs === false) {
            return;
        }

        const attributes = isArray(attrs) ? attrs : Object.keys(props);
        const filter = attributes.map(key => hyphenate(key)).concat($name);

        const observer = new MutationObserver(records => {
            const data = getProps($options, $name);
            if (records.some(({attributeName}) => {
                const prop = attributeName.replace('data-', '');
                return (prop === $name ? attributes : [camelize(prop), camelize(attributeName)]).some(prop =>
                    !isUndefined(data[prop]) && data[prop] !== $props[prop]
                );
            })) {
                component.$reset();
            }
        });

        observer.observe(el, {
            attributes: true,
            attributeFilter: filter.concat(filter.map(key => `data-${key}`))
        });

        return observer;
    }
}
