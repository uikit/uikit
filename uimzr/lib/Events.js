//https://raw.githubusercontent.com/muut/riotjs/master/lib/observable.js
// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.Events = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Events = factory();
    }
}(this, function () {



    var observable = function(el) {

        el = el || {};

        /**
         * Используется в zManagerOfEvents для перехвата всех событий
         */
        el.onAll = undefined;

        var callbacks = {},
            _id = 0;

        el.on = function(events, fn) {
            if (typeof fn == 'function') {
                fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id;

                events.replace(/\S+/g, function(name, pos) {
                    (callbacks[name] = callbacks[name] || []).push(fn);
                    fn.typed = pos > 0
                })
            }
            return el
        };

        el.off = function(events, fn) {
            if (events == '*') callbacks = {};
            else {
                events.replace(/\S+/g, function(name) {
                    if (fn) {
                        var arr = callbacks[name];
                        for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
                            if (cb._id == fn._id) { arr.splice(i, 1); i-- }
                        }
                    } else {
                        callbacks[name] = []
                    }
                })
            }
            return el
        };

        // only single event supported
        el.one = function(name, fn) {
            function on() {
                el.off(name, on);
                fn.apply(el, arguments)
            }
            return el.on(name, on)
        };

        el.trigger = function(name) {
            var args = [].slice.call(arguments, 1),
                fns = callbacks[name] || [];

            if(el.onAll!==undefined){
                el.onAll(name, args);
            }

            for (var i = 0, fn; (fn = fns[i]); ++i) {
                if (!fn.busy) {
                    fn.busy = 1;
                    fn.apply(el, fn.typed ? [name].concat(args) : args);
                    if (fns[i] !== fn) { i-- }
                    fn.busy = 0
                }
            }

            if (callbacks.all && name != 'all') {
                el.trigger.apply(el, ['all', name].concat(args))
            }

            return el
        };

        return el

    };

    var Events = {};

    observable(Events);
    Events.observable = observable;


    return Events;

}));