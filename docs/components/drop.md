# Drop

<p class="uk-text-lead">Position any element in relation to another element.</p>

## Usage

Any content, like a button, can toggle the drop component. Just add the `uk-drop` attribute to a block element following the toggle.

```html
<button type="button"></button>
<div uk-drop></div>
```

A dropdown can be enabled by hovering and clicking the toggle. Just add the `mode: click` option to the attribute to force `click` mode only. If you want to group the toggle and the dropdown, you can just add the `.uk-inline` class from the [Utility component](utility.md#inline) to a container element around both.

```html
<div class="uk-inline">
    <button type="button"></button>
    <div uk-drop="mode: click"></div>
</div>
```

**Note** The Drop component has no default styling. In this example, we've used a card from the [Card component](card.md) for visualization.

```example
<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Hover</button>
    <div uk-drop>
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>
</div>

<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Click</button>
    <div uk-drop="mode: click">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>
</div>
```

***

## Grid in drop

You can place a grid from the [Grid component](grid.md) inside a drop. Just wrap the content with a `<div>` element and add the `uk-grid` attribute. If the grid should stack automatically, whenever the drop no longer fits its container, just add the `.uk-drop-grid` class.

```html
<div class="uk-width-large" uk-drop>
    <div class="uk-drop-grid uk-child-width-1-2@m" uk-grid>...</div>
</div>
```

Use one of the classes from the [Width component](width.md) to adjust the drop's width.

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div class="uk-width-large" uk-drop>
    <div class="uk-card uk-card-body uk-card-default">
        <div class="uk-drop-grid uk-child-width-1-2@m" uk-grid>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </div>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </div>
        </div>
    </div>
</div>
```

***

## Position

Add one of the following options to the `uk-drop` attribute to adjust the drop's alignment.

```html
<div uk-drop="pos: top-left"></div>
```

```example
<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Top Right</button>
    <div uk-drop="pos: top-right">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>
</div>

<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Bottom Justify</button>
    <div uk-drop="pos: bottom-justify">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>
</div>

<div class="uk-inline">
    <button class="uk-button uk-button-default" type="button">Right Center</button>
    <div uk-drop="pos: right-center">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>
</div>
```

| Position         | Description                                                                   |
|:-----------------|:------------------------------------------------------------------------------|
| `bottom-left`    | Aligns the drop to the bottom left.                                           |
| `bottom-center`  | Aligns the drop to the bottom center.                                         |
| `bottom-right`   | Aligns the drop to the bottom right.                                          |
| `bottom-justify` | Aligns the drop to the bottom and justifies its width to the related element. |
| `top-left`       | Aligns the drop to the top left.                                              |
| `top-center`     | Aligns the drop to the top center.                                            |
| `top-right`      | Aligns the drop to the top right.                                             |
| `top-justify`    | Aligns the drop to the top and justifies its width to the related element.    |
| `left-top`       | Aligns the drop to the left top.                                              |
| `left-center`    | Aligns the drop to the left center.                                           |
| `left-bottom`    | Aligns the drop to the left bottom.                                           |
| `right-top`      | Aligns the drop to the right top.                                             |
| `right-center`   | Aligns the drop to the right center.                                          |
| `right-bottom`   | Aligns the drop to the right bottom.                                          |

***

## Boundary

By default, the drop flips automatically when it exceeds the viewport's edge. If you want to flip it according to a container's boundary, just add the `boundary: .my-class` option to the `uk-drop` attribute, using a selector for the container. That way you can determine any parent element as the drop's boundary.

```html
<div class="my-class">
    <button type="button"></button>
    <div uk-drop="boundary: .my-class"></div>
</div>
```

```example
<div class="boundary uk-panel uk-placeholder uk-width-2-3@s">

    <button class="uk-button uk-button-default uk-float-left" type="button">Hover</button>
    <div uk-drop="boundary: .boundary">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>

    <button class="uk-button uk-button-default uk-float-right" type="button">Hover</button>
    <div uk-drop="boundary: .boundary">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>

</div>
```

***

### Boundary alignment

You can also align the drop to its boundary. To do so, add the `boundary-align: true` option to the attribute.

```html
<div class="my-class">
    <button type="button"></button>
    <div uk-drop="boundary: .my-class; boundary-align: true"></div>
</div>
```

```example
<div class="boundary-align uk-panel uk-placeholder">

    <button class="uk-button uk-button-default uk-float-left" type="button">Justify</button>
    <div uk-drop="pos: bottom-justify; boundary: .boundary-align; boundary-align: true">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>

    <button class="uk-button uk-button-default uk-float-right" type="button">Center</button>
    <div uk-drop="pos: bottom-center; boundary: .boundary-align; boundary-align: true">
        <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
    </div>

</div>
```

***

## Offset

To define a custom offset between the drop container and the toggle, add the `offset` option with a value for the offset, measured in pixels.

```html
<div uk-drop="offset: 80"></div>
```

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div uk-drop="offset: 80">
    <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
</div>
```

***

## Animation

Apply one or more animations to the dropdown by adding the `animation: uk-animation-*` option with one of the classes from the [Animation component](animation.md). You can also determine the animation's duration. Just add the `duration` option with your value.

```html
<div uk-drop="animation: uk-animation-slide-top-small; duration: 1000"></div>
```

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div uk-drop="animation: uk-animation-slide-top-small; duration: 1000">
    <div class="uk-card uk-card-body uk-card-default">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option           | Value           | Default        | Description                                                                                        |
|:-----------------|:----------------|:---------------|:---------------------------------------------------------------------------------------------------|
| `toggle`         | String, Boolean | `true`         | CSS selector for the element to be used as the toggler. By default, the preceding element is used. |
| `pos`            | String          | `bottom-left`  | The position of the drop.                                                                          |
| `mode`           | String          | `click, hover` | Comma separated list of drop trigger behaviour modes: `hover`, `click`                             |
| `delay-show`     | Number          | `0`            | Delay time in milliseconds before a drop is displayed in hover mode.                               |
| `delay-hide`     | Number          | `800`          | Delay time in milliseconds before a drop is hidden in hover mode.                                  |
| `boundary`       | String          | `window`       | CSS selector of the element to maintain the drop's visibility.                                     |
| `boundary-align` | Boolean         | `false`        | Align the drop to its boundary.                                                                    |
| `flip`           | Boolean, String | `true`         | Automatically flip the drop. Possible values are `false`, `true`, `x` or `y`.                      |
| `offset`         | Number          | `0`            | The offset of the drop's container.                                                                |
| `animation`      | String          | `false`        | Space separated names of animations to apply.                                                      |
| `duration`       | Number          | `200`          | Animation duration in milliseconds.                                                                |

`pos` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

```html
<span uk-drop="top-left"></span>
```

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.drop(element, options);
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
UIkit.drop(element).show();
```

Shows the Drop.

#### Hide

```js
UIkit.drop(element).hide();
```

Hides the Drop.
