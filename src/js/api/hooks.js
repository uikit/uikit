import {assign, fastdom, hasOwn, includes, isEqual, isPlainObject} from 'uikit-util';

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
        this._frames = {reads: {}, writes: {}};

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

    UIkit.prototype._callUpdate = function (e = 'update') {

        const type = e.type || e;

        if (includes(['update', 'resize'], type)) {
            this._callWatches();
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

                    const result = this._connected && read.call(this, this._data, type);

                    if (result === false && write) {
                        fastdom.clear(writes[i]);
                    } else if (isPlainObject(result)) {
                        assign(this._data, result);
                    }
                });
            }

            if (write && !includes(fastdom.writes, writes[i])) {
                writes[i] = fastdom.write(() => this._connected && write.call(this, this._data, type));
            }

        });

    };

    UIkit.prototype._callWatches = function () {

        const {_frames} = this;

        if (_frames.watch) {
            return;
        }

        const initital = !hasOwn(_frames, 'watch');

        _frames.watch = fastdom.read(() => {

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

            _frames.watch = null;

        });

    };

}
