(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {


    var MenuUserSpec = React.createClass({displayName: "MenuUserSpec",

        render: function(){

            var lStyle = {
                width: 200
            };
            return (


                React.createElement(Spec, {title: "menu user (css)", anchor: "core:menuUser", group: "core"}, 
                    React.createElement("p", null, "Меню пользователей."), 

                    React.createElement("div", {style: lStyle}, 

                        React.createElement("div", {className: "mzr-user-menu"}, 
                            React.createElement("ul", {className: "uk-nav"}, 

                                React.createElement("li", {className: "uk-nav-header"}, "Приложение"), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Дневник питания")), 
                                React.createElement("li", {className: "uk-active"}, React.createElement("a", {href: "#"}, "Дневник тренировок")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Вес и измерения")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Женский календарь")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Доступ")), 

                                React.createElement("li", null, React.createElement("button", {className: "uk-button uk-button-primary"}, "Интерактивный курс")), 

                                React.createElement("li", {className: "uk-nav-header"}, "Общение"), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Мой блог")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Друзья")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Фотографии")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Лента новостей")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Фотографии")), 

                                React.createElement("li", {className: "uk-nav-header"}, "Интересное"), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Рецепты")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Лучшие рационы")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Таблицы калорийности")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, "Калькуляторы"))
                            )
                        )
                    )

                )

            );

        }
    });
    return MenuUserSpec;

}));
