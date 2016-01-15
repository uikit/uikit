import $ from 'jquery';
import {bind, extend, mergeOptions} from '../util/index';

export default function (UIkit) {

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = options.el ? $(options.el) : null;

        extend(this, options.props);

        // 
        // Object.keys(this.props).forEach(prop => {
        //     if (this.$options[prop]) this[prop] = this.$options[prop];
        // });

        this._initMethods();
        this._callHook('init');
    };

    UIkit.prototype._initMethods = function () {

        let methods = this.$options.methods;

        if (methods) {
            for (let key in methods) {
                this[key] = bind(methods[key], this);
            }
        }
    };

    UIkit.prototype._callHook = function (hook) {

        let handlers = this.$options[hook];

        if (handlers) {
            for (let i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this);
            }
        }
    };

};
