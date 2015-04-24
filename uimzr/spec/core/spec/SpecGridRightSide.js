(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecGridRightSide = React.createClass({displayName: "SpecGridRightSide",

        propTypes: {

        },

        render: function(){

            return (
                React.createElement("div", {className: "mzr-grid-right-side"}, 
                    this.props.children
                )
            );

        }
    });
    return SpecGridRightSide;

}));