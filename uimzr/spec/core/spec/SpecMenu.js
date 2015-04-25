(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['uimzr/lib/Events'], factory);
    } else if (typeof exports === 'object') {

        module.exports = factory(require('uimzr/lib/Events'));
    }
}(this, function (Events) {



    var SpecMenu = React.createClass({displayName: "SpecMenu",

        propTypes: {


        },

        getInitialState: function(){
            return {groups: [
                {group: 'core', specks: [] }
            ]};
        },

        getDefaultProps: function(){

            return {

            };
        },

        onAddSpeck: function(oParams){


            var oldState = this.state.groups;
            for(var i=0; i<oldState.length; i++){
                var lGroup = oldState[i];
                if(lGroup.group == oParams.group){
                    lGroup.specks.push(oParams);
                }
            }
            this.setState({groups: oldState});
            console.log(oParams, oldState);
        },


        componentWillMount:function(){
            Events.on('uimzr:Spec:addSpeck', this.onAddSpeck);
        },

        componentDidMount:function(){

        },
        componentDidUpdate:function(){

        },

        render: function(){


            var lMenu = [];

            for(var i=0; i<this.state.groups.length; i++){
                var lGroup = this.state.groups[i];
                var lSumMenu= [];
                lSumMenu.push(React.createElement("li", {key: 0}, React.createElement("a", {href: "#"+lGroup.group}, lGroup.group), ":"));
                for(var j=0; j < lGroup.specks.length; j++){
                    lSumMenu.push(React.createElement("li", {key: j+1}, React.createElement("a", {href: "#"+lGroup.specks[j].anchor}, lGroup.specks[j].title)));
                }
                lMenu.push(React.createElement("ul", {key: i+25, className: "uk-subnav uk-subnav-line"}, lSumMenu));
            }

            return (
                React.createElement("div", {className: "uk-container uk-width-1-1 uk-container-center"}, 
                    React.createElement("div", {className: "mzr-block"}, 
                        React.createElement("div", {className: "mzr-block-header"}, "Компоненты: css, jsx js; общие библиотеки; style guid"), 
                        React.createElement("div", {className: "mzr-block-content"}, lMenu)
                    )
                ));
        }
    });
    return SpecMenu;

}));