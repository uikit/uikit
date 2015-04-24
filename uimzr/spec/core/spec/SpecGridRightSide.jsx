(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecGridRightSide = React.createClass({

        propTypes: {

        },

        render: function(){

            return (
                <div className="mzr-grid-right-side">
                    {this.props.children}
                </div>
            );

        }
    });
    return SpecGridRightSide;

}));