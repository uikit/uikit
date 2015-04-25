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


    var App = React.createClass({

        render: function(){

            return (<div>

                <SpecMenu />
                <SBlock></SBlock>
                <MenuPageSpec></MenuPageSpec>

                <MenuMainSpec></MenuMainSpec>
                <MenuUserSpec></MenuUserSpec>

            </div>);
        }
    });


    var AppHome = React.createClass({

        render: function(){

            var AllSpeck = [];
            getSpecks().foreEach(function(Element, pIndex){
                AllSpeck.push(<div key={pIndex}><Element></Element></div>);
            });
            return (<div>

                {AllSpeck}


            </div>);
        }
    });

    var AppGroup = React.createClass({

        render: function(){
            return (<div>

                <CBlock></CBlock>


            </div>);
        }
    });

    var AppSpeck = React.createClass({

        render: function(){
            return (<div>

                <CBlock></CBlock>


            </div>);
        }
    });

    var Route = ReactRouter.Route;
    var Router = ReactRouter;
    var DefaultRoute = ReactRouter.DefaultRoute;
    var routes = (
        <Route handler={App} path="/">
            <DefaultRoute handler={AppHome} />
            <Route name="speck" path="/:groupName/:speckName" handler={AppSpeck} />
            <Route name="group" path="/:groupName" handler={AppGroup} />
        </Route>
    );



    Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.body);
    });


    console.log('hello');
});
