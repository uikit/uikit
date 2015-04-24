(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory();
    }
}(this, function () {

    var SpecMenu = React.createClass({

        propTypes: {


        },

        getDefaultProps: function(){

            return {

            };
        },

        componentDidMount:function(){

        },
        componentDidUpdate:function(){

        },

        render: function(){

            return (<div>SpecMenu</div>);
        }
    });
    return SpecMenu;

}));