import $ from 'jquery';
import {bind, extend, mergeOptions, uuid} from '../util/index';

export default function (UIkit) {

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$uuid = uuid();

        this._initData();

        if (options.el) {

            options.el.__uikit__ = options.el.__uikit__ || {};
            options.el.__uikit__[options.name] = this;

            this.$el = options.el ? $(options.el) : null;
            this._initProps();
        }

        this._initMethods();
        this._callHook('ready');
    };

    UIkit.prototype._initData = function () {

        var defaults = this.$options.defaults,
            data = this.$options.data || {};

        if (defaults) {
            for (let key in defaults) {
                this[key] = data[key] || defaults[key];
            }
        }
    };

    UIkit.prototype._initProps = function () {

        var props = this.$options.props,
            el = this.$options.el;

        if (props) {
            props.forEach(key => {
                if (el.hasAttribute(key)) {
                    this[key] = el.getAttribute(key);
                }
            });
        }
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

    UIkit.prototype.$destroy = function () {
        this._callHook('destroy');
    };

};
