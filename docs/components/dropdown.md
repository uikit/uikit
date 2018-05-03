# Dropdown

<p class="uk-text-lead">Defines different styles for a toggleable dropdown.</p>

## Usage

Basically, a dropdown is a specific case of the [drop](drop.md) that provides its own styling. Any content, like a button, can toggle a dropdown. Just add the `uk-dropdown` attribute to a block element following the toggle.

```html
<button type="button"></button>
<div uk-dropdown></div>
```

A dropdown can be enabled by hovering and clicking the toggle. Just add the `mode: click` option to the attribute to force `click` mode only. If you want to group the toggle and the dropdown, you can just add the `.uk-inline` class from the [Utility component](utility.md#inline) to a container element around both.

```html
<div class="uk-inline">
    <button type="button"></button>
    <div uk-dropdown="mode: click"></div>
</div>
```

```example
<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Hover</button>
    <div uk-dropdown>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
</div>

<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Click</button>
    <div uk-dropdown="mode: click">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
</div>
```

***

## Nav in dropdown

A dropdown can contain a nav from the [Nav component](nav.md). Just add the `.uk-nav` class and the `.uk-dropdown-nav` modifier to a `<ul>` element.

```html
<button type="button"></button>
<div uk-dropdown>
    <ul class="uk-nav uk-dropdown-nav">...</ul>
</div>
```

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div uk-dropdown>
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
```

***

## Grid in dropdown

You can place a grid from the [Grid component](grid.md) inside a dropdown, which can hold a navigation or any other content. Just wrap the content with a `<div>` element and add the `uk-grid` attribute. If the grid should stack automatically, whenever the dropdown no longer fits its container, just add the `.uk-dropdown-grid` class.

```html
<div class="uk-width-large" uk-dropdown>
    <div class="uk-dropdown-grid uk-child-width-1-2@m" uk-grid>...</div>
</div>
```

Use one of the classes from the [Width component](width.md) to adjust the dropdown's width.

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div class="uk-width-large" uk-dropdown>
    <div class="uk-dropdown-grid uk-child-width-1-2@m" uk-grid>
        <div>
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
        <div>
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
    </div>
</div>
```

***

## Position

Add one of the following options to the `uk-dropdown` attribute to adjust the dropdown's alignment.

```html
<div uk-dropdown="pos: top-left"></div>
```

```example
<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Top Right</button>
    <div uk-dropdown="pos: top-right">
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
</div>

<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Bottom Justify</button>
    <div uk-dropdown="pos: bottom-justify">
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
</div>

<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Right Center</button>
    <div uk-dropdown="pos: right-center">
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
</div>
```

| Position         | Description                                                                       |
|:-----------------|:----------------------------------------------------------------------------------|
| `bottom-left`    | Aligns the dropdown to the bottom left.                                           |
| `bottom-center`  | Aligns the dropdown to the bottom center.                                         |
| `bottom-right`   | Aligns the dropdown to the bottom right.                                          |
| `bottom-justify` | Aligns the dropdown to the bottom and justifies its width to the related element. |
| `top-left`       | Aligns the dropdown to the top left.                                              |
| `top-center`     | Aligns the dropdown to the top center.                                            |
| `top-right`      | Aligns the dropdown to the top right.                                             |
| `top-justify`    | Aligns the dropdown to the top and justifies its width to the related element.    |
| `left-top`       | Aligns the dropdown to the left top.                                              |
| `left-center`    | Aligns the dropdown to the left center.                                           |
| `left-bottom`    | Aligns the dropdown to the left bottom.                                           |
| `right-top`      | Aligns the dropdown to the right top.                                             |
| `right-center`   | Aligns the dropdown to the right center.                                          |
| `right-bottom`   | Aligns the dropdown to the right bottom.                                          |

***

## Boundary

By default, the dropdown flips automatically when it exceeds the viewport's edge. If you want to flip it according to a container's boundary, just add the `boundary: .my-class` option to the `uk-dropdown` attribute, using a selector for the container. That way you can determine any parent element as the drop's boundary.

```html
<div class="my-class">
    <button type="button"></button>
    <div uk-dropdown="boundary: .my-class"></div>
</div>
```

```example
<div class="boundary uk-panel uk-placeholder uk-width-2-3@s">

    <button class="uk-button uk-button-default uk-float-left" type="button">Hover</button>
    <div uk-dropdown="boundary: .boundary">
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

    <button class="uk-button uk-button-default uk-float-right" type="button">Hover</button>
    <div uk-dropdown="boundary: .boundary">
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

</div>
```

***

### Boundary alignment

You can also align the dropdown to its boundary. To do so, add the `boundary-align: true` option to the attribute.

```html
<div class="my-class">
    <button type="button"></button>
    <div uk-dropdown="boundary: .my-class; boundary-align: true"></div>
</div>
```

```example
<div class="boundary-align uk-panel uk-placeholder">

    <button class="uk-button uk-button-default uk-float-left" type="button">Justify</button>
    <div uk-dropdown="pos: bottom-justify; boundary: .boundary-align; boundary-align: true">
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

    <button class="uk-button uk-button-default uk-float-right" type="button">Center</button>
    <div uk-dropdown="pos: bottom-center; boundary: .boundary-align; boundary-align: true">
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

</div>
```

***

## Offset

To define a custom offset between the dropdown container and the toggle, add the `offset` option with a value for the offset, measured in pixels.

```html
<div uk-dropdown="offset: 80"></div>
```

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div uk-dropdown="offset: 80">
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
```

***

## Animation

Apply one or more animations to the dropdown by adding the `animation: uk-animation-*` option with one of the classes from the [Animation component](animation.md). You can also determine the animation's duration. Just add the `duration` option with your value.

```html
<div uk-dropdown="animation: uk-animation-slide-top-small; duration: 1000"></div>
```

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div uk-dropdown="animation: uk-animation-slide-top-small; duration: 1000">
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
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option           | Value           | Default        | Description                                                                                        |
|:-----------------|:----------------|:---------------|:---------------------------------------------------------------------------------------------------|
| `toggle`         | String, Boolean | `true`         | CSS selector for the element to be used as the toggler. By default, the preceding element is used. |
| `pos`            | String          | `bottom-left`  | The position of the dropdown.                                                                      |
| `mode`           | String          | `click, hover` | Comma separated list of dropdown trigger behaviour modes: `hover`, `click`                         |
| `delay-show`     | Number          | `0`            | Delay time in milliseconds before a dropdown is displayed in hover mode.                           |
| `delay-hide`     | Number          | `800`          | Delay time in milliseconds before a dropdown is hidden in hover mode.                              |
| `boundary`       | String          | `window`       | CSS selector of the element to maintain the drop's visibility.                                     |
| `boundary-align` | Boolean         | `false`        | Align the dropdown to its boundary.                                                                |
| `flip`           | Boolean, String | `true`         | Automatically flip the drop. Possible values are `false`, `true`, `x` or `y`.                      |
| `offset`         | Number          | `0`            | The offset of the dropdown's container.                                                            |
| `animation`      | String          | `false`        | Space separated names of animations to apply.                                                      |
| `duration`       | Number          | `200`          | Animation duration in milliseconds.                                                                |                                                      |
***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.dropdown(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name         | Description                                                              |
|:-------------|:-------------------------------------------------------------------------|
| `toggle`     | Fires before an item is toggled.                                         |
| `beforeshow` | Fires before an item is shown. Can prevent showing by returning `false`. |
| `show`       | Fires after an item is shown.                                            |
| `shown`      | Fires after the item's show animation has completed.                     |
| `beforehide` | Fires before an item is hidden. Can prevent hiding by returning `false`. |
| `hide`       | Fires after an item is hidden.                                           |
| `hidden`     | Fires after an item is hidden.                                           |
| `stack`      | Fires when the `drop-stack`class is applied.                             |

### Methods

The following methods are available for the component:

#### Show

```js
UIkit.dropdown(element).show();
```

Shows the Dropdown.

#### Hide

```js
UIkit.dropdown(element).hide();
```

Hides the Dropdown.
