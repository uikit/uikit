# Tab

<p class="uk-text-lead">Create a tabbed navigation with different styles.</p>

## Usage

The tab component consists of clickable tabs, that are aligned side by side in a list. Its JavaScript functionality extends the [Switcher component](switcher.md) and is necessary to dynamically transition through different contents using the tabbed navigation.

| Class/Attribute | Description                                                                                                          |
|:----------------|:---------------------------------------------------------------------------------------------------------------------|
| `uk-tab`        | Add this attribute to a `<ul>` element to define the Tab component. Use `<a>` elements as tab items within the list. |
| `.uk-active `   | Add this class to a list item to apply an active state.                                                              |
| `.uk-disabled ` | Add this class to a list item to apply a disabled state. Also remove the `href` attribute from the anchor to make it inaccessible through keyboard navigation. |

```html
<ul uk-tab>
    <li class="uk-active"><a href=""></a></li>
    <li><a href=""></a></li>
    <li class="uk-disabled"><a></a></li>
</ul>
```

```example
<ul uk-tab>
    <li class="uk-active"><a href="#">Left</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li class="uk-disabled"><a>Disabled</a></li>
</ul>
```

***

## Bottom modifier

Add the `.uk-tab-bottom` class to flip tab items to the bottom.

```html
<ul class="uk-tab-bottom" uk-tab>...</ul>
```

```example
<ul class="uk-tab-bottom" uk-tab>
    <li class="uk-active"><a href="#">Left</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>
```

***

## Left/Right modifiers

Add the `.uk-tab-left` or `.uk-tab-right` class to align tabs vertically to the left or right side. To save space, the alignment automatically switches back to horizontal when the viewport width goes below 960px. Add the `media` option with your own value to the `uk-tab` attribute to modify this behavior.

When using the vertical alignment, you will usually create a grid to apply the layout as seen in the [Switcher example](switcher.md#vertical-tabs).

```html
<ul class="uk-tab-left" uk-tab>...</ul>

<ul class="uk-tab-right" uk-tab>...</ul>
```

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <ul class="uk-tab-left" uk-tab>
            <li class="uk-active"><a href="#">Left</a></li>
            <li><a href="#">Item</a></li>
            <li><a href="#">Item</a></li>
        </ul>
    </div>

    <div>
        <ul class="uk-tab-right" uk-tab>
            <li class="uk-active"><a href="#">Right</a></li>
            <li><a href="#">Item</a></li>
            <li><a href="#">Item</a></li>
        </ul>
    </div>
</div>
```

***

## Alignment

You can combine tabs with the [Flex component](flex.md) or the [Width component](width.md) to modify the alignment of the navigations.

```html
<ul class="uk-flex-right" uk-tab>...</ul>
```

```example
<div class="uk-margin-medium-top">
    <ul class="uk-flex-center" uk-tab>
        <li class="uk-active"><a href="#">Center</a></li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>

<div>
    <ul class="uk-flex-right" uk-tab>
        <li class="uk-active"><a href="#">Right</a></li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>

<div>
    <ul class="uk-child-width-expand" uk-tab>
        <li class="uk-active"><a href="#">Justify</a></li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>
```

***

## Tabs and Dropdown

Tabs can be used to trigger a dropdown menu from the [Dropdown component](dropdown.md).

```html
<ul uk-tab>
    <li>

        <!-- This is the menu item toggling the dropdown -->
        <a href=""></a>

        <!-- This is the dropdown -->
        <div uk-dropdown="mode: click">
            <ul class="uk-nav uk-dropdown-nav">...</ul>
        </div>

    </li>
</ul>
```

```example
<ul uk-tab>
    <li class="uk-active"><a href="#">Active</a></li>
    <li><a href="#">Item</a></li>
    <li>
        <a href="#">More <span class="uk-margin-small-left" uk-icon="icon: triangle-down"></span></a>
        <div uk-dropdown="mode: click">
            <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-active"><a href="#">Active</a></li>
                <li><a href="#">Item</a></li>
                <li class="uk-nav-header">Header</li>
                <li><a href="#">Item</a></li>
                <li><a href="#">Item</a></li>
                <li class="uk-nav-divider"></li>
                <li><a href="#">Item</a></li>
            </ul>
        </div>
    </li>
</ul>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option      | Value           | Default | Description                                                                                               |
|:------------|:----------------|:--------|:----------------------------------------------------------------------------------------------------------|
| `connect`   | CSS selector    | `false` | Related item's container. By default, this is the next element with the 'uk-switcher' class.              |
| `toggle `   | CSS selector    | `> *`   | The toggle selector, which triggers content switching on click.                                           |
| `active `   | Number          | `0`     | Active index on init. Providing a negative number indicates a position starting from the end of the set.  |
| `animation` | String          | `false` | The space separated names of animations to use. Comma separate for animation out.                         |
| `duration`  | Number          | `200`   | The animation duration.                                                                                   |
| `swiping`   | Boolean         | `true`  | Use swiping.                                                                                              |
| `media`     | Integer, String | `960`   | When to switch to horizontal mode - a width as integer (e.g. 640) or a breakpoint (e.g. @s, @m, @l, @xl) or any valid media query (e.g. (min-width: 900px)). |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.tab(element, options);
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
UIkit.tab(element).show(index);
```

Shows the Tab item with given index.

| Name    | Type                  | Default | Description                      |
|:--------|:----------------------|:--------|:---------------------------------|
| `index` | String, Integer, Node | 0       | Tab item to show. 0 based index. |
