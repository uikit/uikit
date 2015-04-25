(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {


    var MenuUserSpec = React.createClass({

        render: function(){

            var lStyle = {
                width: 200
            };
            return (


                <Spec title="menu user (css)" anchor="core:menuUser" group="core">
                    <p>Меню пользователей.</p>

                    <div style={lStyle}>

                        <div className="mzr-user-menu">
                            <ul className="uk-nav">

                                <li className="uk-nav-header">Приложение</li>

                                <li><a href="#">Дневник питания</a></li>
                                <li className="uk-active"><a href="#">Дневник тренировок</a></li>
                                <li><a href="#">Вес и измерения</a></li>
                                <li><a href="#">Женский календарь</a></li>
                                <li><a href="#">Доступ</a></li>

                                <li><button className="uk-button uk-button-primary">Интерактивный курс</button></li>

                                <li className="uk-nav-header">Общение</li>

                                <li><a href="#">Мой блог</a></li>
                                <li><a href="#">Друзья</a></li>
                                <li><a href="#">Фотографии</a></li>
                                <li><a href="#">Лента новостей</a></li>
                                <li><a href="#">Фотографии</a></li>

                                <li className="uk-nav-header">Интересное</li>

                                <li><a href="#">Рецепты</a></li>
                                <li><a href="#">Лучшие рационы</a></li>
                                <li><a href="#">Таблицы калорийности</a></li>
                                <li><a href="#">Калькуляторы</a></li>
                            </ul>
                        </div>
                    </div>

                </Spec>

            );

        }
    });
    return MenuUserSpec;

}));
