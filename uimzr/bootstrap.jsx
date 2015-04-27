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
        React.render(<Handler/>, document.getElementById("uimzr"));
    });


    console.log('hello');
});
