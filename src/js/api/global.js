import {classify, mergeOptions} from '../util/index';

export default function (UIkit) {

    UIkit.extend = function (options) {

        options = options || {};

        var Super = this, name = options.name || Super.options.name;
        var Sub = createClass(name || 'UIkitComponent');

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub['super'] = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

};

function createClass(name) {
    return new Function('return function ' + classify(name) + ' (options) { this._init(options); }')();
}
