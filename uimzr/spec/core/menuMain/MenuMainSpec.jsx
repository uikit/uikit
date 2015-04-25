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
                            <button className="uk-button uk-button-primary mzr-navbar-button"><i className="uk-icon-navicon"></i><div>Меню</div></button>
                        </div>
                        <a href="/" className="uk-navbar-brand mzr-navbar-logo"></a>
                        <div className="uk-navbar-content">
                            <button className="uk-button uk-button-primary mzr-navbar-button"><i className="uk-icon-hand-o-right"></i>Начать программу похудения</button>
                        </div>
                        <ul className="uk-navbar-nav">
                            <li>
                                <a href="">Истории успеха</a>
                            </li>
                            <li>
                                <a href="">Дневники</a>
                            </li>
                            <li>
                                <a href="">Рецепты</a>
                            </li>
                            <li>
                                <a href="">Таблицы калорийности</a>
                            </li>
                        </ul>

                        <div className="uk-navbar-content uk-navbar-flip ">
                            <button className="uk-button uk-button-primary mzr-navbar-button"><i className="uk-icon-sign-in"></i><div>Войти</div></button>

                        </div>

                    </nav>
                </div>


            );

        }
    });
    return menuMainSpec;

}));
