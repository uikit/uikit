(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'uimzr/spec/core/spec/SpecGrid3Column',
            'uimzr/spec/core/spec/SpecGridClearFix',
            'uimzr/spec/core/spec/SpecGridContent',
            'uimzr/spec/core/spec/SpecGridLeftSide',
            'uimzr/spec/core/spec/SpecGridRightSide'
        ], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory(
            require('uimzr/spec/core/spec/SpecGrid3Column'),
            require('uimzr/spec/core/spec/SpecGridClearFix'),
            require('uimzr/spec/core/spec/SpecGridContent'),
            require('uimzr/spec/core/spec/SpecGridLeftSide'),
            require('uimzr/spec/core/spec/SpecGridRightSide')
        );
    }
}(this, function (SpecGrid3Column, SpecGridClearFix, SpecGridContent, SpecGridLeftSide, SpecGridRightSide) {

    var Spec = React.createClass({displayName: "Spec",

        propTypes: {

            title: React.PropTypes.string.isRequired,
            anchor: React.PropTypes.string.isRequired,
            group: React.PropTypes.oneOf('core').isRequired,
            grid: React.PropTypes.oneOf('3').isRequired

        },

        getDefaultProps: function(){

            return {
                group: 'core',
                grid: '3'
            };
        },


        componentDidMount:function(){
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        },
        componentDidUpdate:function(){
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        },

        render: function(){


            return (React.createElement("div", null, 

                React.createElement(SpecGrid3Column, null, 

                    React.createElement(SpecGridContent, null, 
                        React.createElement("a", {name: this.props.anchor}), 
                        React.createElement("h1", null, this.props.title), 
                        this.props.children
                    ), 

                    React.createElement(SpecGridLeftSide, null), 
                    React.createElement(SpecGridClearFix, null), 
                    React.createElement(SpecGridRightSide, null)

                )


            ));

        }
    });
    return Spec;

}));