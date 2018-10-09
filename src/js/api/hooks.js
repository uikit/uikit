import {assign, createEvent, fastdom, includes, isPlainObject} from 'uikit-util';

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
        this._initProps();

        this._callHook('beforeConnect');
        this._connected = true;

        this._initEvents();
        this._initObserver();

        this._callHook('connected');
        this._callUpdate();
    };

    UIkit.prototype._callDisconnected = function () {

        if (!this._connected) {
            return;
        }

        this._callHook('beforeDisconnect');

        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }

        this._unbindEvents();
        this._callHook('disconnected');

        this._connected = false;

    };

    UIkit.prototype._callUpdate = function (e) {

        e = createEvent(e || 'update');

        const {type} = e;

        if (includes(['update', 'load', 'resize'], type)) {
            this._resetComputeds();
        }

        const updates = this.$options.update;
        const {reads, writes} = this._frames;

        if (!updates) {
            return;
        }

        updates.forEach(({read, write, events}, i) => {

            if (type !== 'update' && !includes(events, type)) {
                return;
            }

            if (read && !includes(fastdom.reads, reads[i])) {
                reads[i] = fastdom.read(() => {

                    const result = this._connected && read.call(this, this._data, e);

                    if (result === false && write) {
                        fastdom.clear(writes[i]);
                        delete writes[i];
                    } else if (isPlainObject(result)) {
                        assign(this._data, result);
                    }
                    delete reads[i];
                });
            }

            if (write && !includes(fastdom.writes, writes[i])) {
                writes[i] = fastdom.write(() => {
                    this._connected && write.call(this, this._data, e);
                    delete writes[i];
                });
            }

        });

    };

}
