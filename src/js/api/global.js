import $ from 'jquery';
import {classify, mergeOptions} from '../util/index';

function createClass(name) {
    return new Function('return function ' + name + ' (options) { this._init(options); }')();
}

let UIkit = function (options) {
    this._init(options);
};

UIkit.extend = function (options) {

    options = options || {};

    let Super = this, name = options.name || Super.options.name;
    let Sub = createClass(name || 'UIkitComponent');

    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(Super.options, options);

    Sub['super'] = Super;
    Sub.extend = Super.extend;

    return Sub;
};

export default UIkit;
