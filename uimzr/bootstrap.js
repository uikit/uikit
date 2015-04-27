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


    //var AppTest = React.createClass({
    //
    //    componentDidMount:function(){
    //
    //        $('pre code').each(function(i, block) {
    //            //hljs.highlightBlock(block);
    //        });
    //        //$("#test").html(React.renderToStaticMarkup(this.props.children));
    //        var lText = React.renderToStaticMarkup(this.props.children);
    //        console.log(lText);
    //        //$("#test").append(lText);
    //
    //        //var sdd = style_html(lText);
    //        var beautify_js = require('js-beautify');
    //
    //        $("#test2").append("<pre className='prettyprint linenums'>"  +
    //        $("#test").html().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    //        +"</pre>");
    //    },
    //    render: function(){
    //        var lText = React.renderToStaticMarkup(this.props.children);
    //
    //        console.log(lText);
    //        return (<div>
    //
    //            <pre className="prettyprint linenums">
    //               {lText}
    //            </pre>
    //
    //
    //
    //        </div>);
    //    }
    //});

    //React.renderToStaticMarkup(this.props.children[0])
    //document.createTextNode(React.findDOMNode(this))
    //console.log(React.findDOMNode(this).innerHTML);


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
        React.render(React.createElement(Handler, null), document.getElementById("uimzr"));
    });


    console.log('hello');
});
