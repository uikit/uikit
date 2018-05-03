# Grid Parallax

<p class="uk-text-lead">Move single columns of a grid at different speeds while scrolling.</p>

The Grid Parallax allows you to add a scrolling parallax effect to columns within a Grid from the [Grid component](grid.md). To do so you need to add the attribute `uk-grid-parallax` to the grid.

**Note** Don't add the `uk-grid` attribute. `uk-grid-parallax` already inherits from the Grid component.

```html
<div uk-grid-parallax>...</div>
```

There are two types of markup to apply this effect. The following example uses 3 defined columns.

```example
<div class="uk-child-width-expand@s uk-text-center" uk-grid-parallax>
    <div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
        <div class="uk-card uk-card-default uk-card-body uk-grid-margin">Item</div>
    </div>
</div>
```

***

The parallax effect is also applied, if grid columns wrap into the next line which is shown in this example. With the `translate` option you can adjust the speed of the scrolling, by default it has the value 150.

```example
<div class="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l uk-text-center" uk-grid-parallax="translate:200">
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option      | Value  | Default | Descriptio                                                                       |
|:------------|:-------|:--------|:---------------------------------------------------------------------------------|
| `target`    | String | `false` | Selector string for child elements to translate. Defaults to element's children. |
| `translate` | Number | `150`   | Translate value. The value must be a positive integer.                           |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.gridParallax(element, options);
```
