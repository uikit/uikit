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

                        React.createElement("aside", {className: "mzr-user-menu mzr-shadow"}, 

                            React.createElement("div", {className: "mzr-user-menu-header"}, 
                                React.createElement("img", {className: "mzr-avatar", src: "http://upload-1f47061a063c9bb9706729066dc63a02.commondatastorage.googleapis.com/resize_cache/24511/baa33f78e6ab4760fb3031ec096e6105/main/c10/c102c53774cde6b1ebf9200fa8555680/e06c9f80dbf264087a97f9410f14d2b2.jpg"}), 
                                React.createElement("a", {className: "el-title mzr-link-to-text"}, "Моя страница"), 
                                React.createElement("div", {className: "el-meta"}, React.createElement("a", {href: "#"}, "Настройки"), " | ", React.createElement("a", {href: "#"}, "Выйти"))
                            ), 

                            React.createElement("ul", {className: "uk-nav uk-nav-side uk-nav-parent-icon"}, 


                                React.createElement("li", {className: "uk-nav-header"}, "Приложение"), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-book283"}), " Интерактивный курс ", React.createElement("div", {className: "uk-badge"}, React.createElement("i", {className: "uk-icon-flag"})))), 
                                React.createElement("li", {className: "uk-active"}, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-restaurant23"}), " Дневник питания")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-standing92"}), " Дневник тренировок ", React.createElement("span", {className: "uk-badge uk-badge-notification"}, "55"))), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-scale17"}), " Вес и измерения")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-calendar146"}), " Женский календарь")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-settings48"}), " Личные данные")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-locked59"}), " Доступ")), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "uk-icon-question-circle"}), " Справка")), 
                                React.createElement("li", {className: "uk-nav-header"}, "Общение"), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-blog4"}), " Мой блог")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-add199"}), " Друзья")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("span", {className: "flaticon-photos12"}), " Фотографии")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("span", {className: "flaticon-web42"}), " Лента новостей")), 

                                React.createElement("li", {className: "uk-nav-header"}, "Интересное"), 

                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-cook1"}), " Рецепты")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-businessman272"}), " Истории успеха")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-restaurant23"}), React.createElement("i", {className: "flaticon-standing92"}), " Дневники питания и тренировок")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-five8"}), " Лучшие рационы")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-blog4"}), " Блоги")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-table19"}), " Таблицы калорийности")), 
                                React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "flaticon-calculator69"}), " Калькуляторы")), 

                                React.createElement("li", {className: "uk-nav-header"}, "Калорийность продуктов"), 
                                React.createElement("li", null, React.createElement("a", {href: "/base_of_food/food_1516/index.php"}, React.createElement("i", {className: "flaticon-chicken3"}), " Мясо •консервы птица •колбасы •субпродукты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1519/index.php"}, React.createElement("i", {className: "flaticon-healthy-food5"}), " Овощи •зелень •соленья •консервы")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_3168/index.php"}, React.createElement("i", {className: "flaticon-drink64"}), " Молоко •масло •сыры •мороженное")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1539/index.php"}, React.createElement("i", {className: "flaticon-sprig2"}), " Крупы •зернобобовые •зерновые")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1520/index.php"}, React.createElement("i", {className: "flaticon-apple55"}), " Фрукты •ягода •варенье •компоты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1526/index.php"}, React.createElement("i", {className: "flaticon-seed5"}), " Орехи и семена")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1542/index.php"}, React.createElement("i", {className: "flaticon-bread14"}), " Хлеб")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1523/index.php"}, React.createElement("i", {className: "flaticon-juice4"}), " Напитки •соки •алкогольные •напитки")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1515/index.php"}, React.createElement("i", {className: "flaticon-fish2"}), " Рыба •икра •копченая •соленая •консервы")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_13764/index.php"}, React.createElement("i", {className: "flaticon-egg16"}), " Яйца")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1518/index.php"}, React.createElement("i", {className: "flaticon-sweet9"}), " Кондитерские изделия •фаст фуд")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1517/index.php"}, React.createElement("i", {className: "flaticon-fungus3"}), " Грибы")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1522/index.php"}, React.createElement("i", {className: "flaticon-olives"}), " Жиры")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_21215/index.php"}, React.createElement("i", {className: "flaticon-wheat5"}), " Мука, крахмал и макаронные изделия")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_1528/index.php"}, React.createElement("i", {className: "flaticon-salt"}), " Специи, приправы и соусы")), 


                                React.createElement("li", {className: "uk-nav-header"}, "Калорийность продуктов (USDA)"), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/baking/"}, React.createElement("i", {className: "flaticon-croissant3"}), " Выпечка")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/fat/"}, React.createElement("i", {className: "flaticon-olives"}), " Жиры и масла")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/macaroni/"}, React.createElement("i", {className: "flaticon-sprig2"}), " Крупы и макароны")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/milk/"}, React.createElement("i", {className: "flaticon-drink64"}), " Молочные и яичные продукты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/vegetable/"}, React.createElement("i", {className: "flaticon-healthy-food5"}), " Овощи и овощные продукты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/nuts/"}, React.createElement("i", {className: "flaticon-seed5"}), " Орехи, семена")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/beef/"}, React.createElement("i", {className: "flaticon-cow12"}), " Продукты из говядины")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/chicken/"}, React.createElement("i", {className: "flaticon-chicken3"}), " Птица")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/fish/"}, React.createElement("i", {className: "flaticon-fish2"}), " Рыба и морепродукты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/pork/"}, React.createElement("i", {className: "flaticon-farm6"}), " Свинина")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/spices/"}, React.createElement("i", {className: "flaticon-salt"}), " Специи и травы")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/fruit/"}, React.createElement("i", {className: "flaticon-apple55"}), " Фрукты и фруктовые соки")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/usda/fastfood/"}, React.createElement("i", {className: "flaticon-flaticon-fast-food"}), " Фаст-фуд")), 

                                React.createElement("li", {className: "uk-nav-header"}, "Калорийность продуктов (только калории)"), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_22471/index.php"}, React.createElement("i", {className: "flaticon-fastfood6"}), " KFC")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_21273/index.php"}, React.createElement("i", {className: "flaticon-fast-food"}), " Фаст фуд")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_21484/index.php"}, React.createElement("i", {className: "flaticon-can"}), " Бондюэль ")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_21327/index.php"}, React.createElement("i", {className: "flaticon-sushi15"}), " Японская кухня")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_21546/index.php"}, React.createElement("i", {className: "flaticon-nachos"}), " Чипсы, сушеная рыба, сухарики")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_food/food_21636/index.php"}, React.createElement("i", {className: "flaticon-factory6"}), " Продукты по производителям")), 


                                React.createElement("li", {className: "uk-nav-header"}, "Калорийность рецептов"), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21252/index.php"}, React.createElement("i", {className: "flaticon-healthy8"}), " Варенье и джемы")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21243/index.php"}, React.createElement("i", {className: "flaticon-chicken2"}), " Вторые блюда")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21249/index.php"}, React.createElement("i", {className: "flaticon-croissant3"}), " Выпечка")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21244/index.php"}, React.createElement("i", {className: "flaticon-spaghetti1"}), " Гарниры")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21245/index.php"}, React.createElement("i", {className: "flaticon-sweet9"}), " Десерты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21254/index.php"}, React.createElement("i", {className: "flaticon-healthy8"}), " Заготовки")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21250/index.php"}, React.createElement("i", {className: "flaticon-nachos"}), " Закуски")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21247/index.php"}, React.createElement("i", {className: "flaticon-hot5"}), " Каши")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21248/index.php"}, React.createElement("i", {className: "flaticon-juice4"}), " Напитки")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21242/index.php"}, React.createElement("i", {className: "flaticon-cook4"}), " Первые блюда")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21253/index.php"}, React.createElement("i", {className: "flaticon-kitchenpack15"}), " Полуфабрикаты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21241/index.php"}, React.createElement("i", {className: "flaticon-salad"}), " Салаты")), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21251/index.php"}, React.createElement("i", {className: "flaticon-sauce1"}), " Соусы и заправки")), 


                                React.createElement("li", {className: "uk-nav-header"}, "Статьи"), 
                                React.createElement("li", null, React.createElement("a", {href: "http://www.health-diet.ru/base_of_meals/meals_21252/index.php"}, React.createElement("i", {className: "flaticon-healthy8"}), " Варенье и джемы"))
                            )
                        )
                    )

                )

            );

        }
    });
    return MenuUserSpec;

}));
