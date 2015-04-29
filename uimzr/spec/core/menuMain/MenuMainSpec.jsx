(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {

    var menuMainSpec = React.createClass({

        render: function(){

            return (

                <div>
                    <Spec title="menu main (css)" anchor="core:menuMain" group="core">
                        <p>Меню страницы для не авторизованного пользователя.</p>
                    </Spec>
                    <nav className="uk-navbar">
                        <div className="uk-navbar-content">
                            <a className="uk-button uk-button-primary mzr-navbar-button"><i className="uk-icon-navicon"></i><div>Меню</div></a>
                        </div>
                        <a href="/" className="uk-navbar-brand mzr-navbar-logo"></a>
                        <div className="uk-navbar-content">
                            <a className="uk-button uk-button-primary mzr-navbar-button mzr-navbar-button-oneline"><i className="uk-icon-hand-o-right"></i>Начать программу похудения</a>
                        </div>
                        <ul className="uk-navbar-nav">
                            <li>
                                <a href="">Моя страница</a>
                            </li>
                            <li className="mzr-navbar-nav-line">
                                <a href="">Истории успеха</a>
                            </li>
                            <li className="mzr-navbar-nav-line">
                                <a href="">Дневники</a>
                            </li>
                            <li className="mzr-navbar-nav-line">
                                <a href="">Рецепты</a>
                            </li>
                            <li className="mzr-navbar-nav-line">
                                <a href="">Таблицы калорийности</a>
                            </li>
                            <li className="uk-parent" data-uk-dropdown>
                                <a href=""><i className="uk-icon-ellipsis-h "></i></a>
                                <div className="uk-dropdown uk-dropdown-navbar">
                                    <ul className="uk-nav uk-nav-navbar">
                                        <li><a href="#">Item</a></li>
                                        <li><a href="#">Another item</a></li>
                                        <li className="uk-nav-header">Header</li>
                                        <li><a href="#">Item</a></li>
                                        <li><a href="#">Another item</a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a href="#">Separated item</a></li>
                                    </ul>
                                </div>
                            </li>


                        </ul>

                        <div className="uk-navbar-content uk-navbar-flip ">
                            <a className="uk-button uk-button-primary mzr-navbar-button"><i className="uk-icon-sign-in"></i><div>Войти</div></a>

                        </div>

                    </nav>
                </div>


            );

        }
    });
    return menuMainSpec;

}));
