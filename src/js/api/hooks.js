import { createEvent, fastdom, isPlainObject, ready } from '../util/index';

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
        this._callUpdate();
    };

    UIkit.prototype._callConnected = function () {

        if (this._connected) {
            return;
        }

        if (!~UIkit.elements.indexOf(this.$options.el)) {
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

        this._initEvents(true);
        this._callHook('disconnected');

        this._connected = false;

    };

    UIkit.prototype._callUpdate = function (e) {

        e = createEvent(e || 'update');

        if (e.type === 'update') {
            this._computeds = {};
        }

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
                this._frames.reads[i] = fastdom.measure(() => {
                    update.read.call(this, e);
                    delete this._frames.reads[i];
                });
            }

            if (update.write && !~fastdom.writes.indexOf(this._frames.writes[i])) {
                this._frames.writes[i] = fastdom.mutate(() => {
                    update.write.call(this, e);
                    delete this._frames.writes[i];
                });
            }

        });

    };

}
