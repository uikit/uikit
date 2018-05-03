# Switcher

<p class="uk-text-lead">Dynamically transition through different content panes.</p>

## Usage

The switcher component consists of a number of toggles and their related content items. Add the `uk-switcher` attribute to the element which contains the toggles. Add the `.uk-switcher` class to the element containing the content items.

By default, the element with the `.uk-switcher` class has to succeed the toggle directly in order for the switcher to function. If you need it to be nested in another element, for example when using a grid, add the `connect: SELECTOR` option to the `uk-switcher` attribute and select the element containing the items for switching.

Typically, the switcher toggles are styled through other components, some of which will be shown here.

```html
<!-- This is the nav containing the toggling elements -->
<ul uk-switcher>
    <li><a href=""></a></li>
</ul>

<!-- This is the container of the content items -->
<ul class="uk-switcher">
    <li></li>
</ul>
```

In this example we are using the [Subnav component](subnav.md).

```example
<ul class="uk-subnav uk-subnav-pill" uk-switcher>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>

<ul class="uk-switcher uk-margin">
    <li>Hello!</li>
    <li>Hello again!</li>
    <li>Bazinga!</li>
</ul>
```

***

## Navigation controls

In some cases you want to switch to another content section from within the active content. This is possible using the `uk-switcher-item` attribute. To target the items, you need to set the attribute to the number of the respective content item.

Setting the attribute to `next` and `previous` will switch to the adjacent items.

```html
<ul class="uk-switcher uk-margin">
    <li><a href="" uk-switcher-item="0"></a></li>
    <li><a href="" uk-switcher-item="1"></a></li>
    <li><a href="" uk-switcher-item="next"></a></li>
    <li><a href="" uk-switcher-item="previous"></a></li>
</ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-switcher>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>
<ul class="uk-switcher uk-margin">
    <li>Hello! <a href="#" uk-switcher-item="2">Switch to item 3</a></li>
    <li>Hello again! <a href="#" uk-switcher-item="next">Next item</a></li>
    <li>Bazinga! <a href="#" uk-switcher-item="previous">Previous item</a></li>
</ul>
```

***

## Connect multiple containers

It is also possible to connect multiple content containers. Just add the `connect` parameter to the `uk-switcher` attribute and use a selector that applies to all items.

```html
<!-- This is the nav containing the toggling elements -->
<ul uk-switcher="connect: .my-class">...</ul>

<!-- These are the containers of the content items -->
<ul class="uk-switcher my-class">...</ul>

<ul class="uk-switcher my-class">...</ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-switcher="connect: .switcher-container">
    <li><a href="#">Active</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>

<h4>Container 1</h4>

<ul class="uk-switcher switcher-container uk-margin">
    <li>Hello!</li>
    <li>Hello again!</li>
    <li>Bazinga!</li>
</ul>

<h4>Container 2</h4>

<ul class="uk-switcher switcher-container uk-margin">
    <li>Hello! The first item.</li>
    <li>Hello again! The second item.</li>
    <li>Bazinga! The third item.</li>
</ul>
```

***

## Animations

You can apply all animations from the [Animation component](animation) to switcher items. To do so, add the `animation` parameter with the relevant class to the `uk-switcher` attribute.

```html
<ul uk-switcher="animation: uk-animation-fade">...</ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-switcher="animation: uk-animation-fade">
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>

<ul class="uk-switcher uk-margin">
    <li>Hello!</li>
    <li>Hello again!</li>
    <li>Bazinga!</li>
</ul>
```

***

### Multiple animations

You can also apply multiple animations from the [Animation component](animation). That way you can add different in and out animations.

```html
<ul uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">...</ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>

<ul class="uk-switcher uk-margin">
    <li>Hello!</li>
    <li>Hello again!</li>
    <li>Bazinga!</li>
</ul>
```

***

## Switcher and subnav

The switcher is easily applied to the [Subnav component](subnav).

```html
<!-- This is the subnav containing the toggling elements -->
<ul class="uk-subnav uk-subnav-pill" uk-switcher>...</ul>

<!-- This is the container of the content items -->
<ul class="uk-switcher"></ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-switcher>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>

<ul class="uk-switcher uk-margin">
    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
    <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
    <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
</ul>
```


***

## Switcher and tab

As an exception to the rule, add the `uk-tab` attribute instead of `uk-switcher` to the tabbed navigation to combine the switcher with the [Tab component](tab).

```html
<!-- This is the subnav containing the toggling elements -->
<ul uk-tab>...</ul>

<!-- This is the container of the content items -->
<ul class="uk-switcher">...</ul>
```

```example
<ul uk-tab>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>

<ul class="uk-switcher uk-margin">
    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
    <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
    <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
</ul>
```

***

### Vertical tabs

Use the [Grid](grid) and [Width](width) components to display content correctly with a vertical tabbed navigation.

```html
<div uk-grid>
    <div class="uk-width-auto">
        <ul class="uk-tab-left" uk-tab="connect: #my-id">...</ul>
    </div>
    <div class="uk-width-expand">
        <ul id="my-id" class="uk-switcher">...</ul>
    </div>
</div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <div uk-grid>
            <div class="uk-width-auto@m">
                <ul class="uk-tab-left" uk-tab="connect: #component-tab-left; animation: uk-animation-fade">
                    <li><a href="#">Active</a></li>
                    <li><a href="#">Item</a></li>
                    <li><a href="#">Item</a></li>
                </ul>
            </div>
            <div class="uk-width-expand@m">
                <ul id="component-tab-left" class="uk-switcher">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                    <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                    <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
                </ul>
            </div>
        </div>
    </div>
    <div>
        <div uk-grid>
            <div class="uk-width-auto@m uk-flex-last@m">
                <ul class="uk-tab-right" uk-tab="connect: #component-tab-right; animation: uk-animation-fade">
                    <li><a href="#">Active</a></li>
                    <li><a href="#">Item</a></li>
                    <li><a href="#">Item</a></li>
                </ul>
            </div>
            <div class="uk-width-expand@m">
                <ul id="component-tab-right" class="uk-switcher">
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                    <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                    <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

***

## Switcher and button

The switcher can also be applied to buttons or button groups from the [Button component](button). Just add the switcher attribute to a block around a group of buttons or to the element with the `.uk-button-group` class.

```html
<!-- This is a switcher using a number of buttons -->
<div uk-switcher>
    <button class="uk-button uk-button-default" type="button"></button>
    <button class="uk-button uk-button-default" type="button"></button>
</div>

<ul class="uk-switcher">...</ul>
```

```example
<div uk-switcher="animation: uk-animation-fade">
    <button class="uk-button uk-button-default" type="button">Item</button>
    <button class="uk-button uk-button-default" type="button">Item</button>
    <button class="uk-button uk-button-default" type="button">Item</button>
</div>

<ul class="uk-switcher uk-margin">
    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
    <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
    <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
</ul>
```


***

## Switcher and nav

To apply the switcher to the [Nav component](nav), add the `uk-switcher` attribute to the nav `<ul>` element. Use the [Grid](grid) and [Width](width) components to arrange nav and content in a grid layout.

```html
<div uk-grid>
    <div class="uk-width-small">
        <ul class="uk-nav uk-nav-default" uk-switcher="connect: #my-id">...</ul>
    </div>
    <div class="uk-width-expand">
        <ul id="my-id" class="uk-switcher">...</ul>
    </div>
</div>
```

```example
<div uk-grid>
    <div class="uk-width-small@m">

        <ul class="uk-nav uk-nav-default" uk-switcher="connect: #component-nav; animation: uk-animation-fade; toggle: > :not(.uk-nav-header)">
            <li><a href="#">Active</a></li>
            <li><a href="#">Item</a></li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
    <div class="uk-width-expand@m">

        <ul id="component-nav" class="uk-switcher">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
            <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, sed do eiusmod.</li>
        </ul>

    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option      | Value        | Default | Description                                                                                              |
|:------------|:-------------|:--------|:---------------------------------------------------------------------------------------------------------|
| `connect`   | CSS selector | `false` | Related item's container. By default, this is the next element with the 'uk-switcher' class.             |
| `toggle `   | CSS selector | `> *`   | The toggle selector, which triggers content switching on click.                                          |
| `active `   | Number       | `0`     | Active index on init. Providing a negative number indicates a position starting from the end of the set. |
| `animation` | String       | `false` | The space separated names of animations to use. Comma separate for animation out.                        |
| `duration`  | Number       | `200`   | The animation duration.                                                                                  |
| `swiping`   | Boolean      | `true`  | Use swiping.                                                                                             |

`connect` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

```html
<span uk-switcher=".switcher-container"></span>
```

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.switcher(element, options);
```

### Events

The following events will be triggered on the connected items of the elements with this component attached:

| Name         | Description                                                              |
|:-------------|:-------------------------------------------------------------------------|
| `beforeshow` | Fires before an item is shown. Can prevent showing by returning `false`. |
| `show`       | Fires after an item is shown.                                            |
| `shown`      | Fires after the item's show animation has completed.                     |
| `beforehide` | Fires before an item is hidden. Can prevent hiding by returning `false`. |
| `hide`       | Fires after an item's hide animation has started.                        |
| `hidden`     | Fires after an item is hidden.                                           |

### Methods

The following methods are available for the component:

#### Show

```js
UIkit.switcher(element).show(index);
```

Shows the Switcher item with given index.

| Name    | Type                  | Default | Description                           |
|:--------|:----------------------|:--------|:--------------------------------------|
| `index` | String, Integer, Node | 0       | Switcher item to show. 0 based index. |
