(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecGridClearFix = React.createClass({displayName: "SpecGridClearFix",

        propTypes: {

        },

        render: function(){

            return (
                React.createElement("div", {className: "mzr-grid-clear-fix-after-content"})
            );

        }
    });
    return SpecGridClearFix;

}));