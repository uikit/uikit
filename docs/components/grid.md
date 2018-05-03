# Grid

<p class="uk-text-lead">Create a fully responsive, fluid and nestable grid layout.</p>

The Grid system of UIkit allows you to arrange block elements in columns and works closely together with the [Width component](width.md) to determine how much space of the container each item will take up. It can also be combined with the [Flex component](flex.md) to align and order grid items.

***

## Usage

To create the grid container, add the `uk-grid` attribute to a `<div>` element. Add child `<div>` elements to create the cells. By default, all grid cells are stacked. To place them side by side, add one of the classes from the [Width component](width.md). Using `uk-child-width-expand` will automatically apply equal width to items, regardless of how many there are.

**Note** There's no need to add a `uk-grid` class, as it will get added via JavaScript. However, if UIkit's JavaScript is [deferred](https://developer.mozilla.org/de/docs/Web/HTML/Element/script#attr-defer), the class should be added to prevent stacking while loading.

```html
<div uk-grid>
    <div></div>
    <div></div>
</div>
```
**Note** Often cards from the [Card component](card.md) are used inside a grid. In the following examples too for visualization.

```example
<div class="uk-child-width-expand@s uk-text-center" uk-grid>
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

## Gutter modifiers

The Grid component comes with a default gutter, that is decreased automatically from a certain breakpoint, usually on a smaller desktop viewport width. To apply a different gutter, add one of the following classes.

| Class               | Description                                                                             |
|:--------------------|:----------------------------------------------------------------------------------------|
| `.uk-grid-small`    | Add this class to apply a small gutter.                                                 |
| `.uk-grid-medium`   | Add this class to apply a medium gutter like the default one, but without a breakpoint. |
| `.uk-grid-large`    | Add this class to apply a large gutter with breakpoints.                                |
| `.uk-grid-collapse` | Add this class to remove the grid gutter entirely.                                      |

```html
<div class="uk-grid-small" uk-grid>...</div>
```

```example
<div class="uk-grid-small uk-child-width-expand@s uk-text-center" uk-grid>
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

```example
<div class="uk-grid-medium uk-child-width-expand@s uk-text-center" uk-grid>
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

```example
<div class="uk-grid-large uk-child-width-expand@s uk-text-center" uk-grid>
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

```example
<div class="uk-grid-collapse uk-child-width-expand@s uk-text-center" uk-grid>
    <div>
        <div class="uk-background-muted uk-padding">Item</div>
    </div>
    <div>
        <div class="uk-background-primary uk-padding uk-light">Item</div>
    </div>
    <div>
        <div class="uk-background-secondary uk-padding uk-light">Item</div>
    </div>
</div>
```

***

## Nested grid

You can easily extend your grid layout with nested grids.

```html
<div uk-grid>
    <div>
        <div uk-grid>
            <div></div>
            <div></div>
        </div>
    </div>
    <div>
        <div uk-grid>
            <div></div>
            <div></div>
        </div>
    </div>
</div>
```

```example
<div class="uk-child-width-1-2 uk-text-center" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
	</div>
	<div>
		<div class="uk-child-width-1-2 uk-text-center" uk-grid>
			<div>
				<div class="uk-card uk-card-primary uk-card-body">Item</div>
			</div>
			<div>
				<div class="uk-card uk-card-primary uk-card-body">Item</div>
			</div>
		</div>
	</div>
</div>
```

***

## Divider modifier

Add the `.uk-grid-divider` class to separate grid cells with lines. This class can be combined with the gutter modifiers. As soon as the grid stacks, the divider lines will become horizontal.

```html
<div class="uk-grid-divider" uk-grid>...</div>
```

```example
<div class="uk-grid-divider uk-child-width-expand@s" uk-grid>
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
    <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
</div>
```

***

## Match height

To match the height of the direct child of each cell, add the `.uk-grid-match` class. This is needed to match the height of cards from the [Card component](card.md).

```html
<div class="uk-grid-match" uk-grid>....</div>
```

```example
<div class="uk-grid-match uk-child-width-expand@s uk-text-center" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
     </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item<br>...</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item<br>...<br>...</div>
    </div>
</div>
```

***

### Match only one cell

You can also match the height of the direct child of just one cell. To do so, add the `.uk-grid-item-match` class to the grid item whose child you want to match.

```html
<div uk-grid>
    <div class="uk-grid-item-match"></div>
    <div></div>
</div>
```

```example
<div class="uk-child-width-expand@s" uk-grid>
    <div class="uk-grid-item-match">
        <div class="uk-card uk-card-default uk-card-body">
            <h3>Heading</h3>
            <p>
                Lorem ipsum dolor sit amet.
            </p>
        </div>
     </div>
    <div>
        <h3>Heading</h3>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
    </div>
</div>
```

***

### JavaScript

For a more specific selection of the elements whose heights should be matched, add the `target: SELECTOR` option to the `uk-height-match` attribute from the [Utility component](utility.md).

```html
<div uk-grid uk-height-match="target: > div > .uk-card">
    <div>
        <div class="uk-card uk-card-default"></div>
    </div>
    <div>
        <div class="uk-card uk-card-default"></div>
    </div>
</div>
```

```example
<div class="uk-child-width-expand@s uk-text-center" uk-grid uk-height-match="target: > div > .uk-card">
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item</div>
     </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item<br>...</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item<br>...<br>...</div>
    </div>
</div>
```

***

## Grid and width

The grid is mostly used in combination with the [Width component](width.md). This allows for great flexibility when determining the column widths.

```html
<div uk-grid>
    <div class="uk-width-auto@m"></div>
    <div class="uk-width-1-3@m"></div>
    <div class="uk-width-expand@m"></div>
</div>
```

```example
<div class="uk-text-center" uk-grid>
    <div class="uk-width-auto@m">
        <div class="uk-card uk-card-default uk-card-body">Auto</div>
    </div>
    <div class="uk-width-1-3@m">
        <div class="uk-card uk-card-default uk-card-body">1-3</div>
    </div>
    <div class="uk-width-expand@m">
        <div class="uk-card uk-card-default uk-card-body">Expand</div>
    </div>
</div>
```

***

### Child width

If the grid columns are evenly split, you can add one of the `.uk-child-width-*` classes to the grid container, instead of adding a class to each of the items.

```html
<div class="uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>...</div>
```

```example
<div class="uk-child-width-1-2@s uk-child-width-1-3@m uk-text-center" uk-grid>
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

For more detailed information, take a look at the [Width component](width.md).

***

## Grid and flex

You can easily combine the grid with the [Flex component](flex.md). That way you can modify the items' alignment, ordering, direction and wrapping. This allows you, for example, to flip the cells' display order for wider viewports. All this works together with the gutter and divider modifiers.

```html
<div class="uk-flex-center" uk-grid>
    <div></div>
    <div class="uk-flex-first"></div>
</div>
```

```example
<div class="uk-grid-small uk-child-width-1-4@s uk-flex-center uk-text-center" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item 1</div>
    </div>
    <div class="uk-flex-last">
        <div class="uk-card uk-card-secondary uk-card-body">Item 2</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item 3</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item 4</div>
    </div>
    <div class="uk-flex-first">
        <div class="uk-card uk-card-primary uk-card-body">Item 5</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Item 6</div>
    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option         | Value  | Default         | Description                                                                                                |
|:---------------|:-------|:----------------|:-----------------------------------------------------------------------------------------------------------|
| `margin `      | String | uk-grid-margin  | This class is added to items that break into the next row, typically to create margin to the previous row. |
| `first-column` | String | uk-first-column | This class is added to the first element in each row.                                                      |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.grid(element, options);
```
