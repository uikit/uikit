(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {


    var MenuPageSpec = React.createClass({

        render: function(){

            return (

                <Spec title="menu page (css, jsx)" anchor="core:menuPage" group="core">
                    <p>Меню страницы.</p>

                    <nav className="uk-navbar mzr-navbar--menu-page">
                        <div className="uk-navbar-content mzr-navbar-header">
                            Дневник питания
                        </div>

                        <ul className="uk-navbar-nav mzr-navbar-date">
                            <li>
                                <a href=""><i className="uk-icon-chevron-left"></i></a>
                            </li>
                            <li>
                                <a>01.01.2015</a>
                            </li>
                            <li>
                                <a href=""><i className="uk-icon-chevron-right"></i></a>
                            </li>
                            <li>
                                <a href=""><i className="uk-icon-calendar mzr-navbar-button-icon"></i></a>
                            </li>
                        </ul>

                        <ul className="uk-navbar-nav uk-navbar-flip">
                            <li>
                                <a href="" className="uk-navbar-nav-subtitle"><i className="uk-icon-calendar"></i><div>Справка <br/> приложения</div></a>
                            </li>
                            <li>
                                <a href="" className="uk-navbar-nav-subtitle"><i className="uk-icon-calendar"></i><div>Одна</div></a>
                            </li>
                            <li>
                                <a href="" className="uk-navbar-nav-subtitle"><i className="uk-icon-ellipsis-v"></i><div>Еще</div></a>
                            </li>

                        </ul>


                    </nav>


                </Spec>

            );

        }
    });
    return MenuPageSpec;

}));
