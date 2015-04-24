(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecTemplate3Column = React.createClass({

        propTypes: {

        },

        render: function(){

            return (
                <div className="mzr-grid-3-column">
                     {this.props.children}
                </div>
            );

        }
    });
    return SpecTemplate3Column;

}));