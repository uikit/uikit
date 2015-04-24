(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecGridClearFix = React.createClass({

        propTypes: {

        },

        render: function(){

            return (
                <div className="mzr-grid-clear-fix-after-content"></div>
            );

        }
    });
    return SpecGridClearFix;

}));