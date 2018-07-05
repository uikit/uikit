# Filter

<p class="uk-text-lead">Filter or sort items in any given layout by meta data.</p>

The Filter component is often used together with the [Grid component](grid.md), especially the masonry grid, but it's not bound to it. Any layout can be filtered or sorted no matter how the items are positioned. Items fade and move with smooth transitions between the different filtering and sorting states.

***

## Usage

To apply this component, you need a container element with the `uk-filter="target: SELECTOR"` attribute. Inside this container create a list of filter controls as well as the layout items you want to filter. Use the `target: SELECTOR` option to select the element containing the layout items.

```html
<div uk-filter="target: .js-filter">

    <!-- Filter controls -->
    <ul>
        <li><a href="#"></a></li>
    </ul>

    <!-- Layout items -->
    <ul class="js-filter">
        <li></li>
    </ul>

</div>
```

Next, we need to define the meta data for each layout item, for example which category the item belongs to. Use any HTML class or attribute to do so.

To apply a filter control, add the `uk-filter-control` attribute. To define the meta data that should be filtered, use the `filter: SELECTOR` option. The selector can be any CSS selector like a HTML class or an attribute you define for the layout items.

```html
<div uk-filter="target: .js-filter">

    <ul>
        <li uk-filter-control="filter: .tag-blue"><a href="#"></a></li>
    </ul>

    <ul class="js-filter">
        <li class="tag-blue"></li>
    </ul>

</div>
```

If `target` is the only option in the `uk-filter` attribute value, you can also use `uk-filter="SELECTOR"`. The same applies to the filter control. If `filter` is the only option in the `uk-filter-control` attribute value, you can also use `uk-filter-control="SELECTOR"`.

```html
<div uk-filter=".js-filter">

    <ul>
        <li uk-filter-control=".tag-blue"><a href="#"></a></li>
    </ul>

    <ul class="js-filter">
        <li class="tag-blue"></li>
    </ul>

</div>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <ul class="uk-subnav uk-subnav-pill">
        <li uk-filter-control=".tag-white"><a href="#">White</a></li>
        <li uk-filter-control=".tag-blue"><a href="#">Blue</a></li>
        <li uk-filter-control=".tag-black"><a href="#">Black</a></li>
    </ul>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid>
        <li class="tag-white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li class="tag-blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li class="tag-white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li class="tag-white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li class="tag-black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li class="tag-black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li class="tag-blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li class="tag-black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li class="tag-blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li class="tag-white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li class="tag-blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li class="tag-black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
    </ul>

</div>
```

The Filter component comes unstyled, which allows you to use any of the other UIkit components to create the filter controls and layout items. For example, the [Nav](nav.md), [Subnav](subnav.md) and [Tab](tab.md) components can be used to style the filter controls. Usually, the [Grid component](grid.md) is used to create the item layout.

***

## Active state

Add the `.uk-active` class to a filter control, and the filter will be applied initially.

```html
<li class="uk-active" uk-filter-control="[data-color='blue']">...</li>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <ul class="uk-subnav uk-subnav-pill">
        <li class="uk-active" uk-filter-control="[data-color='white']"><a href="#">White</a></li>
        <li uk-filter-control="[data-color='blue']"><a href="#">Blue</a></li>
        <li uk-filter-control="[data-color='black']"><a href="#">Black</a></li>
    </ul>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
    </ul>

</div>
```

***

## Reset filter

To reset the filter and target all items, use the `uk-filter-control` attribute without any specified selector.

```html
<li uk-filter-control>...</li>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <ul class="uk-subnav uk-subnav-pill">
        <li class="uk-active" uk-filter-control><a href="#">All</a></li>
        <li uk-filter-control="[data-color='white']"><a href="#">White</a></li>
        <li uk-filter-control="[data-color='blue']"><a href="#">Blue</a></li>
        <li uk-filter-control="[data-color='black']"><a href="#">Black</a></li>
    </ul>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-color="blue">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-color="black">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
    </ul>

</div>
```

***

## Meta Data

Items can have different meta data for filtering. You just need to define the HTML classes or `data` attributes and create the corresponding CSS selectors for the filter controls. This example uses `data` attributes for the filter instead of HTML classes.

```html
<div uk-filter="target: .js-filter">

    <ul>
        <li uk-filter-control="[data-tags*='blue']"><a href="#"></a></li>
    </ul>

    <ul class="js-filter">
        <li data-tags="blue dark"></li>
    </ul>

</div>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <ul class="uk-subnav uk-subnav-pill">
        <li uk-filter-control="[data-tags*='white']"><a href="#">White</a></li>
        <li uk-filter-control="[data-tags*='blue']"><a href="#">Blue</a></li>
        <li uk-filter-control="[data-tags*='black']"><a href="#">Black</a></li>
        <li uk-filter-control="[data-tags*='dark']"><a href="#">Dark Colors</a></li>
    </ul>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid>
        <li data-tags="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-tags="blue dark">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-tags="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-tags="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-tags="black dark">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-tags="black dark">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-tags="blue dark">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-tags="black dark">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
        <li data-tags="blue dark">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-tags="white">
            <div class="uk-card uk-card-default uk-card-body">Item</div>
        </li>
        <li data-tags="blue dark">
            <div class="uk-card uk-card-primary uk-card-body">Item</div>
        </li>
        <li data-tags="black dark">
            <div class="uk-card uk-card-secondary uk-card-body">Item</div>
        </li>
    </ul>

</div>
```

***

## Multiple Filters

Define different types of meta data and add any number of controls to filter them. The filter controls are exclusive, meaning just one criteria is filtered at a time.

```html
<div uk-filter="target: .js-filter">

    <ul>
        <li uk-filter-control="[data-color='blue']"><a href="#"></a></li>
    </ul>

    <ul>
        <li uk-filter-control="[data-size='small']"><a href="#"></a></li>
    </ul>

    <ul class="js-filter">
        <li data-color="blue" data-size="small"></li>
    </ul>

</div>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <div class="uk-grid-small uk-grid-divider uk-child-width-auto" uk-grid>
        <div>
            <ul class="uk-subnav uk-subnav-pill" uk-margin>
                <li class="uk-active" uk-filter-control><a href="#">All</a></li>
            </ul>
        </div>
        <div>
            <ul class="uk-subnav uk-subnav-pill" uk-margin>
                <li uk-filter-control="[data-color='white']"><a href="#">White</a></li>
                <li uk-filter-control="[data-color='blue']"><a href="#">Blue</a></li>
                <li uk-filter-control="[data-color='black']"><a href="#">Black</a></li>
            </ul>
        </div>
        <div>
            <ul class="uk-subnav uk-subnav-pill" uk-margin>
                <li uk-filter-control="[data-size='small']"><a href="#">Small</a></li>
                <li uk-filter-control="[data-size='medium']"><a href="#">Medium</a></li>
                <li uk-filter-control="[data-size='large']"><a href="#">Large</a></li>
            </ul>
        </div>
    </div>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid="masonry: true">
        <li data-color="white" data-size="large">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="small">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="white" data-size="medium">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="white" data-size="small">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="medium">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="small">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="medium">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="large">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="large">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="white" data-size="large">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="medium">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="small">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
    </ul>

</div>
```

***

## Groups

To filter items by multiple criteria at the same time, the filter controls need to be grouped. Just add the `group: NAME` option to the `uk-filter-control` attribute and define group names for the meta data.

```html
<div uk-filter="target: .js-filter">

    <ul>
        <li uk-filter-control="filter: [data-color='blue']; group: color"><a href="#"></a></li>
        <li uk-filter-control="filter: [data-color='white']; group: color"><a href="#"></a></li>
    </ul>

    <ul>
        <li uk-filter-control="filter: [data-size='small']; group: size"><a href="#"></a></li>
        <li uk-filter-control="filter: [data-size='large']; group: size"><a href="#"></a></li>
    </ul>

    <ul class="js-filter">
        <li data-color="blue" data-size="small"></li>
    </ul>

</div>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <div class="uk-grid-small uk-grid-divider uk-child-width-auto" uk-grid>
        <div>
            <ul class="uk-subnav uk-subnav-pill" uk-margin>
                <li class="uk-active" uk-filter-control><a href="#">All</a></li>
            </ul>
        </div>
        <div>
            <ul class="uk-subnav uk-subnav-pill" uk-margin>
                <li uk-filter-control="filter: [data-color='white']; group: data-color"><a href="#">White</a></li>
                <li uk-filter-control="filter: [data-color='blue']; group: data-color"><a href="#">Blue</a></li>
                <li uk-filter-control="filter: [data-color='black']; group: data-color"><a href="#">Black</a></li>
            </ul>
        </div>
        <div>
            <ul class="uk-subnav uk-subnav-pill" uk-margin>
                <li uk-filter-control="filter: [data-size='small']; group: size"><a href="#">Small</a></li>
                <li uk-filter-control="filter: [data-size='medium']; group: size"><a href="#">Medium</a></li>
                <li uk-filter-control="filter: [data-size='large']; group: size"><a href="#">Large</a></li>
            </ul>
        </div>
    </div>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid="masonry: true">
        <li data-color="white" data-size="large">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="small">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="white" data-size="medium">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="white" data-size="small">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="medium">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="small">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="medium">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="large">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="large">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="white" data-size="large">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="blue" data-size="medium">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
        <li data-color="black" data-size="small">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">Item</div>
            </div>
        </li>
    </ul>

</div>
```

***

## Sorting

To sort items alphanumerically, just add the `sort: ATTRIBUTE` option to the `uk-filter-control` attribute and define the meta data attribute by which the items should be sorted. By default, items are sorted in ascending order. Add the `order: desc` to sort items in descending order.

```html
<div uk-filter="target: .js-filter">

    <ul>
        <li uk-filter-control="sort: data-color"><a href="#"></a></li>
        <li uk-filter-control="sort: data-color; order: desc"><a href="#"></a></li>
    </ul>

    <ul class="js-filter">
        <li data-color="blue"></li>
    </ul>

</div>
```

```html : uikit
<div uk-filter="target: .js-filter">

    <ul class="uk-subnav uk-subnav-pill">
        <li class="uk-active" uk-filter-control="sort: data-date"><a href="#">Ascending</a></li>
        <li uk-filter-control="sort: data-date; order: desc"><a href="#">Descending</a></li>
    </ul>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid>
        <li data-date="2016-06-01">
            <div class="uk-card uk-card-default uk-card-body">2016-06-01</div>
        </li>
        <li data-date="2016-12-13">
            <div class="uk-card uk-card-primary uk-card-body">2016-12-13</div>
        </li>
        <li data-date="2017-05-20">
            <div class="uk-card uk-card-default uk-card-body">2017-05-20</div>
        </li>
        <li data-date="2017-09-17">
            <div class="uk-card uk-card-default uk-card-body">2017-09-17</div>
        </li>
        <li data-date="2017-11-03">
            <div class="uk-card uk-card-secondary uk-card-body">2017-11-03</div>
        </li>
        <li data-date="2017-12-25">
            <div class="uk-card uk-card-secondary uk-card-body">2017-12-25</div>
        </li>
        <li data-date="2018-01-30">
            <div class="uk-card uk-card-primary uk-card-body">2018-01-30</div>
        </li>
        <li data-date="2018-02-01">
            <div class="uk-card uk-card-secondary uk-card-body">2018-02-01</div>
        </li>
        <li data-date="2018-03-11">
            <div class="uk-card uk-card-primary uk-card-body">2018-03-11</div>
        </li>
        <li data-date="2018-06-13">
            <div class="uk-card uk-card-default uk-card-body">2018-06-13</div>
        </li>
        <li data-date="2018-10-27">
            <div class="uk-card uk-card-primary uk-card-body">2018-10-27</div>
        </li>
        <li data-date="2018-12-02">
            <div class="uk-card uk-card-secondary uk-card-body">2018-12-02</div>
        </li>
    </ul>

</div>
```

***

## Masonry Grid

A filter is often applied to a [Masonry](grid.md#masonry) grid. The filter transition works perfectly with any kind of layout no matter how the items are positioned. It even works with the [Parallax](grid.md#parallax) option from the grid.

Here is a comprehensive example with a masonry grid:

```html : uikit
<div uk-filter="target: .js-filter">

    <div class="uk-grid-small uk-flex-middle" uk-grid>
        <div class="uk-width-expand">

            <div class="uk-grid-small uk-grid-divider uk-child-width-auto" uk-grid>
                <div>
                    <ul class="uk-subnav uk-subnav-pill" uk-margin>
                        <li class="uk-active" uk-filter-control><a href="#">All</a></li>
                    </ul>
                </div>
                <div>
                    <ul class="uk-subnav uk-subnav-pill" uk-margin>
                        <li uk-filter-control="[data-color='white']"><a href="#">White</a></li>
                        <li uk-filter-control="[data-color='blue']"><a href="#">Blue</a></li>
                        <li uk-filter-control="[data-color='black']"><a href="#">Black</a></li>
                    </ul>
                </div>
                <div>
                    <ul class="uk-subnav uk-subnav-pill" uk-margin>
                        <li uk-filter-control="[data-size='small']"><a href="#">Small</a></li>
                        <li uk-filter-control="[data-size='medium']"><a href="#">Medium</a></li>
                        <li uk-filter-control="[data-size='large']"><a href="#">Large</a></li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="uk-width-auto uk-text-nowrap">


            <span class="uk-active" uk-filter-control="sort: data-name"><a class="uk-icon-link" href="#" uk-icon="icon: arrow-down"></a></span>
            <span uk-filter-control="sort: data-name; order: desc"><a class="uk-icon-link" href="#" uk-icon="icon: arrow-up"></a></span>

        </div>
    </div>

    <ul class="js-filter uk-child-width-1-2 uk-child-width-1-3@m uk-text-center" uk-grid="masonry: true">
        <li data-color="white" data-size="large" data-name="A">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">A</div>
            </div>
        </li>
        <li data-color="blue" data-size="small" data-name="B">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">B</div>
            </div>
        </li>
        <li data-color="white" data-size="medium" data-name="C">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">C</div>
            </div>
        </li>
        <li data-color="white" data-size="small" data-name="D">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">D</div>
            </div>
        </li>
        <li data-color="black" data-size="medium" data-name="E">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">E</div>
            </div>
        </li>
        <li data-color="black" data-size="small" data-name="F">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">F</div>
            </div>
        </li>
        <li data-color="blue" data-size="medium" data-name="G">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">G</div>
            </div>
        </li>
        <li data-color="black" data-size="large" data-name="H">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">H</div>
            </div>
        </li>
        <li data-color="blue" data-size="large" data-name="I">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">I</div>
            </div>
        </li>
        <li data-color="white" data-size="large" data-name="J">
            <div class="uk-card uk-card-default uk-card-body">
                <canvas width="600" height="800"></canvas>
                <div class="uk-position-center">J</div>
            </div>
        </li>
        <li data-color="blue" data-size="medium" data-name="K">
            <div class="uk-card uk-card-primary uk-card-body">
                <canvas width="600" height="600"></canvas>
                <div class="uk-position-center">K</div>
            </div>
        </li>
        <li data-color="black" data-size="small" data-name="L">
            <div class="uk-card uk-card-secondary uk-card-body">
                <canvas width="600" height="400"></canvas>
                <div class="uk-position-center">L</div>
            </div>
        </li>
    </ul>

</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option      | Value           | Default | Description                                          |
|:------------|:----------------|:--------|:-----------------------------------------------------|
| `target`    | String          | ''      | The targeted list on which to apply the filter to.   |
| `selActive` | String, Boolean | false   | A selector for the initially active filter controls. |

`target` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.filter(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name           | Description                              |
|:---------------|:-----------------------------------------|
| `beforeFilter` | Fires before the filter is applied.      |
| `afterFilter`  | Fires after the filter has been applied. |
