(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Spec'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('Spec'));
    }
}(this, function (Spec) {


    var MenuPageSpec = React.createClass({displayName: "MenuPageSpec",

        render: function(){

            return (

                React.createElement(Spec, {title: "menu page (css, jsx)", anchor: "core:menuPage", group: "core"}, 
                    React.createElement("p", null, "Меню страницы."), 

                    React.createElement("nav", {className: "uk-navbar mzr-navbar--menu-page"}, 
                        React.createElement("div", {className: "uk-navbar-content mzr-navbar-header"}, 
                            "Дневник питания"
                        ), 

                        React.createElement("ul", {className: "uk-navbar-nav mzr-navbar-date"}, 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, React.createElement("i", {className: "uk-icon-chevron-left"}))
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", null, "01.01.2015")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, React.createElement("i", {className: "uk-icon-chevron-right"}))
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: ""}, React.createElement("i", {className: "uk-icon-calendar mzr-navbar-button-icon"}))
                            )
                        ), 

                        React.createElement("ul", {className: "uk-navbar-nav uk-navbar-flip"}, 
                            React.createElement("li", null, 
                                React.createElement("a", {href: "", className: "uk-navbar-nav-subtitle"}, React.createElement("i", {className: "uk-icon-calendar"}), React.createElement("div", null, "Справка ", React.createElement("br", null), " приложения"))
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: "", className: "uk-navbar-nav-subtitle"}, React.createElement("i", {className: "uk-icon-calendar"}), React.createElement("div", null, "Одна"))
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: "", className: "uk-navbar-nav-subtitle"}, React.createElement("i", {className: "uk-icon-ellipsis-v"}), React.createElement("div", null, "Еще"))
                            )

                        )


                    )


                )

            );

        }
    });
    return MenuPageSpec;

}));
