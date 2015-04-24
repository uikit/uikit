require([
    'uimzr/spec/core/block/block'
], function(CBlock){

    

    var App = React.createClass({displayName: "App",

        render: function(){
            return (React.createElement("div", null, 

                React.createElement(CBlock, null)

            ));
        }
    });

    var Route = ReactRouter.Route;
    var Router = ReactRouter;

    var routes = (
        React.createElement(Route, {handler: App, path: "/"}

        )
    );

    Router.run(routes, function (Handler) {
        React.render(React.createElement(Handler, null), document.body);
    });


    console.log('hello');
});
