import { createEvent, fastdom, includes, ready } from '../util/index';

export default function (UIkit) {

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(handler => handler.call(this));
        }
    };

    UIkit.prototype._callReady = function () {

        if (this._isReady) {
            return;
        }

        this._isReady = true;
        this._callHook('ready');
        this._resetComputeds();
        this._callUpdate();
    };

    UIkit.prototype._callConnected = function () {

        if (this._connected) {
            return;
        }

        if (!includes(UIkit.elements, this.$options.el)) {
            UIkit.elements.push(this.$options.el);
        }

        UIkit.instances[this._uid] = this;

        this._initEvents();

        this._callHook('connected');
        this._connected = true;

        this._initObserver();

        if (!this._isReady) {
            ready(() => this._callReady());
        }

        this._callUpdate();
    };

    UIkit.prototype._callDisconnected = function () {

        if (!this._connected) {
            return;
        }

        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }

        var index = UIkit.elements.indexOf(this.$options.el);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        delete UIkit.instances[this._uid];

        this._unbindEvents();
        this._callHook('disconnected');

        this._connected = false;

    };

    UIkit.prototype._callUpdate = function (e) {

        e = createEvent(e || 'update');

        var {type, detail} = e;

        if (type === 'update' && detail && detail.mutation) {
            this._resetComputeds();
        }

        var updates = this.$options.update, {reads, writes} = this._frames;

        if (!updates) {
            return;
        }

        updates.forEach(({read, write, events}, i) => {

            if (type !== 'update' && !includes(events, type)) {
                return;
            }

            if (read && !includes(fastdom.reads, reads[i])) {
                reads[i] = fastdom.read(() => {
                    if (read.call(this, e) === false && write) {
                        fastdom.clear(writes[i]);
                        delete writes[i];
                    }
                    delete reads[i];
                });
            }

            if (write && !includes(fastdom.writes, writes[i])) {
                writes[i] = fastdom.write(() => {
                    write.call(this, e);
                    delete writes[i];
                });
            }

        });

    };

}
