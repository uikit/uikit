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

                            <div className="mzr-user-menu-header">
                                <img className="mzr-avatar" src="http://upload-1f47061a063c9bb9706729066dc63a02.commondatastorage.googleapis.com/resize_cache/24511/baa33f78e6ab4760fb3031ec096e6105/main/c10/c102c53774cde6b1ebf9200fa8555680/e06c9f80dbf264087a97f9410f14d2b2.jpg"/>
                                <a className="el-title mzr-link-to-text">Моя страница</a>
                                <div className="el-meta"><a href="#">Настройки</a> | <a href="#">Выйти</a></div>
                            </div>

                            <ul className="uk-nav uk-nav-side uk-nav-parent-icon">


                                <li className="uk-nav-header">Приложение</li>

                                <li><a href="#"><i className="flaticon-book283"></i> Интерактивный курс <div className="uk-badge"><i className="uk-icon-flag"></i></div></a></li>
                                <li className="uk-active"><a href="#"><i className="flaticon-restaurant23"></i> Дневник питания</a></li>
                                <li><a href="#"><i className="flaticon-standing92"></i> Дневник тренировок <span className="uk-badge uk-badge-notification">55</span></a></li>
                                <li><a href="#"><i className="flaticon-scale17"></i> Вес и измерения</a></li>
                                <li><a href="#"><i className="flaticon-calendar146"></i> Женский календарь</a></li>
                                <li><a href="#"><i className="flaticon-settings48"></i> Личные данные</a></li>
                                <li><a href="#"><i className="flaticon-locked59"></i> Доступ</a></li>

                                <li><a href="#"><i className="uk-icon-question-circle"></i> Справка</a></li>
                                <li className="uk-nav-header">Общение</li>

                                <li><a href="#"><i className="flaticon-blog4"></i> Мой блог</a></li>
                                <li><a href="#"><i className="flaticon-add199"></i> Друзья</a></li>
                                <li><a href="#"><span className="flaticon-photos12"></span> Фотографии</a></li>
                                <li><a href="#"><span className="flaticon-web42"></span> Лента новостей</a></li>

                                <li className="uk-nav-header">Интересное</li>

                                <li><a href="#"><i className="flaticon-cook1"></i> Рецепты</a></li>
                                <li><a href="#"><i className="flaticon-five8"></i> Лучшие рационы</a></li>
                                <li><a href="#"><i className="flaticon-businessman272"></i> Истории успеха</a></li>
                                <li><a href="#"><i className="flaticon-restaurant23"></i><i className="flaticon-standing92"></i> Дневники питания и тренировок</a></li>
                                <li><a href="#"><i className="flaticon-blog4"></i> Блоги</a></li>
                                <li><a href="#"><i className="flaticon-table19"></i> Таблицы калорийности</a></li>
                                <li><a href="#"><i className="flaticon-calculator69"></i> Калькуляторы</a></li>

                                <li className="uk-nav-header">Калорийность продуктов</li>
                                <li><a href="/base_of_food/food_1516/index.php"><i className="flaticon-chicken3"></i> Мясо •консервы птица •колбасы •субпродукты</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1519/index.php"><i className="flaticon-healthy-food5"></i> Овощи •зелень •соленья •консервы</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_3168/index.php"><i className="flaticon-drink64"></i> Молоко •масло •сыры •мороженное</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1539/index.php"><i className="flaticon-sprig2"></i> Крупы •зернобобовые •зерновые</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1520/index.php"><i className="flaticon-apple55"></i> Фрукты •ягода •варенье •компоты</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1526/index.php"><i className="flaticon-seed5"></i> Орехи и семена</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1542/index.php"><i className="flaticon-bread14"></i> Хлеб</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1523/index.php"><i className="flaticon-juice4"></i> Напитки •соки •алкогольные •напитки</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1515/index.php"><i className="flaticon-fish2"></i> Рыба •икра •копченая •соленая •консервы</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_13764/index.php"><i className="flaticon-egg16"></i> Яйца</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1518/index.php"><i className="flaticon-sweet9"></i> Кондитерские изделия •фаст фуд</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1517/index.php"><i className="flaticon-fungus3"></i> Грибы</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1522/index.php"><i className="flaticon-olives"></i> Жиры</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_21215/index.php"><i className="flaticon-wheat5"></i> Мука, крахмал и макаронные изделия</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_1528/index.php"><i className="flaticon-salt"></i> Специи, приправы и соусы</a></li>


                                <li className="uk-nav-header">Калорийность продуктов (USDA)</li>
                                <li><a href="http://www.health-diet.ru/usda/baking/"><i className="flaticon-croissant3"></i> Выпечка</a></li>
                                <li><a href="http://www.health-diet.ru/usda/fat/"><i className="flaticon-olives"></i> Жиры и масла</a></li>
                                <li><a href="http://www.health-diet.ru/usda/macaroni/"><i className="flaticon-sprig2"></i> Крупы и макароны</a></li>
                                <li><a href="http://www.health-diet.ru/usda/milk/"><i className="flaticon-drink64"></i> Молочные и яичные продукты</a></li>
                                <li><a href="http://www.health-diet.ru/usda/vegetable/"><i className="flaticon-healthy-food5"></i> Овощи и овощные продукты</a></li>
                                <li><a href="http://www.health-diet.ru/usda/nuts/"><i className="flaticon-seed5"></i> Орехи, семена</a></li>
                                <li><a href="http://www.health-diet.ru/usda/beef/"><i className="flaticon-cow12"></i> Продукты из говядины</a></li>
                                <li><a href="http://www.health-diet.ru/usda/chicken/"><i className="flaticon-chicken3"></i> Птица</a></li>
                                <li><a href="http://www.health-diet.ru/usda/fish/"><i className="flaticon-fish2"></i> Рыба и морепродукты</a></li>
                                <li><a href="http://www.health-diet.ru/usda/pork/"><i className="flaticon-farm6"></i> Свинина</a></li>
                                <li><a href="http://www.health-diet.ru/usda/spices/"><i className="flaticon-salt"></i> Специи и травы</a></li>
                                <li><a href="http://www.health-diet.ru/usda/fruit/"><i className="flaticon-apple55"></i> Фрукты и фруктовые соки</a></li>
                                <li><a href="http://www.health-diet.ru/usda/fastfood/"><i className="flaticon-flaticon-fast-food"></i> Фаст-фуд</a></li>

                                <li className="uk-nav-header">Калорийность продуктов (только калории)</li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_22471/index.php"><i className="flaticon-fastfood6"></i> KFC</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_21273/index.php"><i className="flaticon-fast-food"></i> Фаст фуд</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_21484/index.php"><i className="flaticon-can"></i> Бондюэль </a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_21327/index.php"><i className="flaticon-sushi15"></i> Японская кухня</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_21546/index.php"><i className="flaticon-nachos"></i> Чипсы, сушеная рыба, сухарики</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_food/food_21636/index.php"><i className="flaticon-factory6"></i> Продукты по производителям</a></li>


                                <li className="uk-nav-header">Калорийность рецептов</li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21252/index.php"><i className="flaticon-healthy8"></i> Варенье и джемы</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21243/index.php"><i className="flaticon-chicken2"></i> Вторые блюда</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21249/index.php"><i className="flaticon-croissant3"></i> Выпечка</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21244/index.php"><i className="flaticon-spaghetti1"></i> Гарниры</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21245/index.php"><i className="flaticon-sweet9"></i> Десерты</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21254/index.php"><i className="flaticon-healthy8"></i> Заготовки</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21250/index.php"><i className="flaticon-nachos"></i> Закуски</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21247/index.php"><i className="flaticon-hot5"></i> Каши</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21248/index.php"><i className="flaticon-juice4"></i> Напитки</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21242/index.php"><i className="flaticon-cook4"></i> Первые блюда</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21253/index.php"><i className="flaticon-kitchenpack15"></i> Полуфабрикаты</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21241/index.php"><i className="flaticon-salad"></i> Салаты</a></li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21251/index.php"><i className="flaticon-sauce1"></i> Соусы и заправки</a></li>


                                <li className="uk-nav-header">Статьи</li>
                                <li><a href="http://www.health-diet.ru/base_of_meals/meals_21252/index.php"><i className="flaticon-healthy8"></i> Варенье и джемы</a></li>
                            </ul>
                        </div>
                    </div>

                </Spec>

            );

        }
    });
    return MenuUserSpec;

}));
