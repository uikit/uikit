(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {

    var menuMainSpec = React.createClass({displayName: "menuMainSpec",

        render: function(){

            return (

                React.createElement("div", null, 
                    React.createElement(Spec, {title: "menu main (css)", anchor: "core:menuMain", group: "core"}, 
                        React.createElement("p", null, "Меню страницы для не авторизованного пользователя.")
                    ), 
                    React.createElement("nav", {className: "uk-navbar"}, 
                        React.createElement("div", {className: "uk-navbar-content"}, 
                            React.createElement("button", {className: "uk-button uk-button-primary mzr-navbar-button"}, React.createElement("i", {className: "uk-icon-navicon"}), React.createElement("div", null, "Меню"))
                        ), 
                        React.createElement("a", {href: "/", className: "uk-navbar-brand mzr-navbar-logo"}), 
                        React.createElement("div", {className: "uk-navbar-content"}, 
                            React.createElement("button", {className: "uk-button uk-button-primary mzr-navbar-button"}, React.createElement("i", {className: "uk-icon-hand-o-right"}), "Начать программу похудения")
                        ), 
                        React.createElement("ul", {className: "uk-navbar-nav"}, 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, "Истории успеха")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, "Дневники")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, "Рецепты")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, "Таблицы калорийности")
                            )
                        ), 

                        React.createElement("div", {className: "uk-navbar-content uk-navbar-flip "}, 
                            React.createElement("button", {className: "uk-button uk-button-primary mzr-navbar-button"}, React.createElement("i", {className: "uk-icon-sign-in"}), React.createElement("div", null, "Войти"))

                        )

                    )
                )


            );

        }
    });
    return menuMainSpec;

}));
