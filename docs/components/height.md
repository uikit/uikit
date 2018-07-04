# Height

<p class="uk-text-lead">Define the height of elements depending on the viewport or match the heights of different elements.</p>

UIkit's Height component offers three options to set heights: using simple fixed height utility classes, depending on the viewport or by matching the heights of different elements.

***

## Usage

UIkit provides a number of useful classes to alter an element's height.

| Class                                             | Description                                                                                   |
|:--------------------------------------------------|:----------------------------------------------------------------------------------------------|
| `.uk-height-1-1`                                  | This class applies a height of 100%. This only works if the parent element has a set height. |
| `.uk-height-small `<br> `.uk-height-max-small `   | These classes apply a height or max-height of _150px_.                                        |
| `.uk-height-medium `<br> `.uk-height-max-medium ` | These classes apply a height or max-height of _300px_.                                        |
| `.uk-height-large `<br> `.uk-height-max-large `   | These classes apply a height or max-height of _450px_.                                        |

```html
<div class="uk-height-small"></div>
```

```example
<div class="uk-child-width-1-3@s" uk-grid>
    <div>
        <div class="uk-height-small uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle">Small</div>
    </div>
    <div>
        <div class="uk-height-medium uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle">Medium</div>
    </div>
    <div>
        <div class="uk-height-large uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle">Large</div>
    </div>
</div>
```

***

## Viewport height

Add the `uk-height-viewport` attribute to create a container that fills the height of the entire viewport. You can change the height behavior by adding the `offset-top`, `offset-bottom` or `expand` option to the attribute. [Learn more](javascript.md#component-configuration)

| Option          | Value                  | Default | Description                                                                         |
|:----------------|:-----------------------|:--------|:------------------------------------------------------------------------------------|
| `offset-top`    | Boolean                | `false` | Subtracts the element's top offset from its height.                                 |
| `offset-bottom` | Boolean, Number, Pixel | `false` | Subtracts the height (true) of the sibling that immediately follows the element, the given percentage (Number), Pixel (px) value from element's own height or the given element's height. |
| `expand`        | Boolean                | `true`  | Expands the element's height to make a short page fill the viewport.                |
| `min-height`    | Number                 | `0`     | Sets a minimum height. Useful if all children are positioned absolute.          |

```html
<div uk-height-viewport></div>

<div uk-height-viewport="offset-top: true"></div>

<div uk-height-viewport="offset-bottom: 20"></div>

<div uk-height-viewport="expand: true"></div>

<div uk-height-viewport="min-height: 300"></div>
```

You can view examples in the tests for [Height Viewport](/uikit/tests/height-viewport.html) and [Height Expand](/uikit/tests/height-expand.html).

***

## Match height

To expand all children of a container to the same height regardless of their content, for example inside a grid, add the `uk-height-match` attribute. You can change the height matching behavior by setting the `target` or `row` option to the attribute. [Learn more](javascript.md#component-configuration)

| Option   | Value   | Default | Description                 |
|:---------|:--------|:--------|:----------------------------|
| `target` | String  | `> *`   | Elements that should match. |
| `row`    | Boolean | `true`  | By default only items in the same row will be matched. For example, once grid columns extend to a width of 100%, their heights will no longer be matched. This makes sense, for example, if they stack vertically in narrower viewports. |

```html
<div uk-height-match>
    <div></div>
    <div></div>
</div>
```

`target` is the _Primary_ option, and its key may be omitted if it's the only option in the attribute value.

```html
<span uk-height-match=".my-class"></span>
```

***

### Match cards

You can also target and match specific elements inside the container, like cards. Just add the `target: SELECTOR` option to the attribute.

```html
<div uk-grid uk-height-match="target: SELECTOR">...</div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid uk-height-match="target: > div > .uk-card">
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
</div>
```

***

### Match all

If your grid wraps into multiple rows, only grid columns within the same row are matched. To match grid columns across all rows, just add the `row: false` option to the attribute.

```html
<div uk-grid uk-height-match="row: false">...</div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid uk-height-match="target: > div > .uk-card; row: false">
    <div class="uk-first-column">
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
    <div class="uk-grid-margin uk-first-column">
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
    </div>
    <div class="uk-grid-margin">
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
</div>
```

***

## Component options

The table below lists the available settings of the `uk-height-match` attribute. [Learn more](javascript.md#component-configuration)

| Option   | Value        | Default | Description                                                                                 |
|:---------|:-------------|:--------|:--------------------------------------------------------------------------------------------|
| `target` | CSS selector | `> *` | Elements that should match. By default, direct children will match.                         |
| `row`    | Boolean      | `true`  | If your targets wrap into multiple rows, only grid columns within the same row are matched. |

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.heightMatch(element, options);
```
