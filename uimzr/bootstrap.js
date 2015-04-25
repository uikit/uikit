require([

    /*core*/
    'uimzr/spec/core/block/BlockSpec',
    'uimzr/spec/core/menuPage/MenuPageSpec',
    'uimzr/spec/core/menuMain/MenuMainSpec',
    'uimzr/spec/core/menuUser/MenuUserSpec',

    /*dev*/
    'SpecMenu'

], function(

    SBlock,
    MenuPageSpec,
    MenuMainSpec,
    MenuUserSpec,

    SpecMenu){


    var listOfSpeck = [];
    listOfSpeck.push({group: 'core', speck: SBlock});

    function getSpecks(sGroup){
        return listOfSpeck.map(function(pElement){

            if(sGroup === undefined){
                return pElement.speck;
            }else{
                if(sGroup === pElement.group ){
                    return pElement.speck;
                }

            }

        });

    };


    var App = React.createClass({displayName: "App",

        render: function(){

            return (React.createElement("div", null, 

                React.createElement(SpecMenu, null), 
                React.createElement(SBlock, null), 
                React.createElement(MenuPageSpec, null), 

                React.createElement(MenuMainSpec, null), 
                React.createElement(MenuUserSpec, null)

            ));
        }
    });


    var AppHome = React.createClass({displayName: "AppHome",

        render: function(){

            var AllSpeck = [];
            getSpecks().foreEach(function(Element, pIndex){
                AllSpeck.push(React.createElement("div", {key: pIndex}, React.createElement(Element, null)));
            });
            return (React.createElement("div", null, 

                AllSpeck


            ));
        }
    });

    var AppGroup = React.createClass({displayName: "AppGroup",

        render: function(){
            return (React.createElement("div", null, 

                React.createElement(CBlock, null)


            ));
        }
    });

    var AppSpeck = React.createClass({displayName: "AppSpeck",

        render: function(){
            return (React.createElement("div", null, 

                React.createElement(CBlock, null)


            ));
        }
    });

    var Route = ReactRouter.Route;
    var Router = ReactRouter;
    var DefaultRoute = ReactRouter.DefaultRoute;
    var routes = (
        React.createElement(Route, {handler: App, path: "/"}, 
            React.createElement(DefaultRoute, {handler: AppHome}), 
            React.createElement(Route, {name: "speck", path: "/:groupName/:speckName", handler: AppSpeck}), 
            React.createElement(Route, {name: "group", path: "/:groupName", handler: AppGroup})
        )
    );



    Router.run(routes, function (Handler) {
        React.render(React.createElement(Handler, null), document.body);
    });


    console.log('hello');
});
