import {assign, fastdom, hasOwn, isEqual, isPlainObject} from 'uikit-util';

export default function (UIkit) {

    UIkit.prototype._callHook = function (hook) {

        const handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(handler => handler.call(this));
        }
    };

    UIkit.prototype._callConnected = function () {

        if (this._connected) {
            return;
        }

        this._data = {};
        this._computeds = {};

        this._initProps();

        this._callHook('beforeConnect');
        this._connected = true;

        this._initEvents();
        this._initObservers();

        this._callHook('connected');
        this._callUpdate();
        this._callWatches();
    };

    UIkit.prototype._callDisconnected = function () {

        if (!this._connected) {
            return;
        }

        this._callHook('beforeDisconnect');
        this._disconnectObservers();
        this._unbindEvents();
        this._callHook('disconnected');

        this._connected = false;

    };

    UIkit.prototype._callUpdate = function (e = 'update') {

        if (!this.$options.update || !this._connected) {
            return;
        }

        if (!this._updates) {
            this._updates = new Set();
            fastdom.read(() => {
                const types = this._updates;
                runUpdates.call(this, types);
                delete this._updates;
            });
        }

        this._updates.add(e.type || e);
    };

    UIkit.prototype._callWatches = function () {

        if (this._watch) {
            return;
        }

        const initital = !hasOwn(this, '_watch');

        this._watch = fastdom.read(() => {

            const {$options: {computed}, _computeds} = this;

            for (const key in computed) {

                const hasPrev = hasOwn(_computeds, key);
                const prev = _computeds[key];

                delete _computeds[key];

                const {watch, immediate} = computed[key];
                if (watch && (
                    initital && immediate
                    || hasPrev && !isEqual(prev, this[key])
                )) {
                    watch.call(this, this[key], prev);
                }

            }

            this._watch = null;

        });

    };

    function runUpdates(types) {

        const isUpdate = types.has('update');
        if (isUpdate || types.has('resize')) {
            this._callWatches();
        }

        const updates = this.$options.update;

        for (let i = 0; i < updates.length; i++) {
            const {read, write, events} = updates[i];

            if (!isUpdate && (!events || !events.some(type => types.has(type)))) {
                continue;
            }

            let result;
            if (read) {

                result = read.call(this, this._data, types);

                if (result && isPlainObject(result)) {
                    assign(this._data, result);
                }
            }

            if (write && result !== false) {
                fastdom.write(() => write.call(this, this._data, types));
            }

        }
    }
}
