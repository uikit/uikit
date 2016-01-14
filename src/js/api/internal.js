import $ from 'jquery';
import {bind, extend, mergeOptions} from '../util/index';

export default function (UIkit) {

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = options.el ? $(options.el) : null;

        extend(this, options.props);

        this._initMethods();
        this._callHook('init');
    };

    UIkit.prototype._initMethods = function () {

        var methods = this.$options.methods;

        if (methods) {
            for (var key in methods) {
                this[key] = bind(methods[key], this);
            }
        }
    };

    UIkit.prototype._callHook = function (hook) {

        var handlers = this.$options[hook];

        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this);
            }
        }
    };

};
