//https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['b'], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory(require('b'));
    }
}(this, function (b) {

    return {};

}));
