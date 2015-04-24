require([
    'uimzr/spec/core/block/block',
    'SpecMenu'
], function(CBlock){



    var App = React.createClass({

        render: function(){
            return (<div>

                <CBlock></CBlock>

            </div>);
        }
    });

    var Route = ReactRouter.Route;
    var Router = ReactRouter;

    var routes = (
        <Route handler={App} path="/">

        </Route>
    );

    Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.body);
    });


    console.log('hello');
});
