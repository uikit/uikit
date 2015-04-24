(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecTemplate3Column = React.createClass({displayName: "SpecTemplate3Column",

        propTypes: {

        },

        render: function(){

            return (
                React.createElement("div", {className: "mzr-grid-3-column"}, 
                     this.props.children
                )
            );

        }
    });
    return SpecTemplate3Column;

}));