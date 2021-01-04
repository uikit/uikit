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
        this._frame = 0;

        this._initProps();

        this._callHook('beforeConnect');
        this._connected = true;

        this._initEvents();
        this._initObservers();

        this._callHook('connected');
        this._callUpdate();
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

        const type = e.type || e;

        if (~['update', 'resize'].indexOf(type)) {
            this._callWatches();
        }

        const updates = this.$options.update;

        if (!updates) {
            return;
        }

        const frame = this._frame = ++this._frame % 64;

        for (let i = 0; i < updates.length; i++) {
            const {read, write, events} = updates[i];

            if (type !== 'update' && (!events || !~events.indexOf(type))) {
                continue;
            }

            let cancel;
            if (read) {
                fastdom.read(() => {

                    if (!this._connected || frame !== this._frame) {
                        return;
                    }

                    const result = read.call(this, this._data, type);

                    if (result === false) {
                        cancel = true;
                    } else if (isPlainObject(result)) {
                        assign(this._data, result);
                    }
                });
            }

            if (write) {
                fastdom.write(() => {

                    if (cancel || !this._connected || frame !== this._frame) {
                        return;
                    }

                    write.call(this, this._data, type);
                });
            }
        }
    };

    UIkit.prototype._callWatches = function () {

        const {_watch} = this;

        if (_watch) {
            return;
        }

        const initital = !hasOwn(this, '_watch');

        this._watch = fastdom.read(() => {

            if (!this._connected) {
                return;
            }

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

}
