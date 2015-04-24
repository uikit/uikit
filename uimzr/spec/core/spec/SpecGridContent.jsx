(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecGridContent = React.createClass({

        render: function(){

            return (
                <div className="mzr-grid-content">
                    {this.props.children}
                </div>
            );

        }
    });
    return SpecGridContent;

}));