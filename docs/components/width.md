# Width

<p class="uk-text-lead">Define the width of elements for different viewport sizes.</p>

UIkit's width component is often used in combination with [grids](grid.md) to split content into responsive columns. You can apply fractions, automatic width or expand units to fill the remaining space and combine these modes.

***

## Usage

Add one of the `.uk-width-*` classes to an element to determine its size. Typically, you would use a grid from the [Grid component](grid.md) and its child elements to create the units.

| Class                              | Description                                           |
|:-----------------------------------|:------------------------------------------------------|
| `.uk-width-1-1`                    | Fills 100% of the available width.                    |
| `.uk-width-1-2`                    | The element takes up halves of its parent container.  |
| `.uk-width-1-3` to `.uk-width-2-3` | The element takes up thirds of its parent container.  |
| `.uk-width-1-4` to `.uk-width-3-4` | The element takes up fourths of its parent container. |
| `.uk-width-1-5` to `.uk-width-4-5` | The element takes up fifths of its parent container.  |
| `.uk-width-1-6` to `.uk-width-5-6` | The element takes up sixths of its parent container.  |

**Note** We remove redundancy into each set of unit classes, so that for instance instead of .uk-width-3-6 you should use .uk-width-1-2.

```html
<div uk-grid>
    <div class="uk-width-1-2"></div>
    <div class="uk-width-1-2"></div>
</div>
```

```example
<div class="uk-text-center" uk-grid>
    <div class="uk-width-1-3">
        <div class="uk-card uk-card-default uk-card-body">1-3</div>
    </div>
    <div class="uk-width-1-3">
        <div class="uk-card uk-card-default uk-card-body">1-3</div>
    </div>
    <div class="uk-width-1-3">
        <div class="uk-card uk-card-default uk-card-body">1-3</div>
    </div>
</div>

<div class="uk-text-center" uk-grid>
    <div class="uk-width-1-2">
        <div class="uk-card uk-card-default uk-card-body">1-2</div>
    </div>
    <div class="uk-width-1-2">
        <div class="uk-card uk-card-default uk-card-body">1-2</div>
    </div>
</div>

<div class="uk-text-center" uk-grid>
    <div class="uk-width-1-4">
        <div class="uk-card uk-card-default uk-card-body">1-4</div>
    </div>
    <div class="uk-width-3-4">
        <div class="uk-card uk-card-default uk-card-body">3-4</div>
    </div>
</div>
```

***

## Auto & expand

The width component provides additional modifiers to give you more flexibility in the distribution of items.

| Class              | Description                                                            |
|:-------------------|:-----------------------------------------------------------------------|
| `.uk-width-auto`   | The item expands only to the width of its own content.                 |
| `.uk-width-expand` | The item expands to fill up the remaining space of the grid container. |

```html
<div uk-grid>
    <div class="uk-width-auto"></div>
    <div class="uk-width-expand"></div>
</div>
```

```example
<div class="uk-text-center" uk-grid>
    <div class="uk-width-auto">
        <div class="uk-card uk-card-default uk-card-body">Auto</div>
    </div>
    <div class="uk-width-expand">
        <div class="uk-card uk-card-default uk-card-body">Expand</div>
    </div>
</div>
```

***

## Equal child widths

To create a grid whose child elements' widths are evenly split, you don't have to apply the same class to each list item within the grid. Just add one of the `.uk-child-width-*` classes to the grid itself.

| Class                    | Description                                                         |
|:-------------------------|:--------------------------------------------------------------------|
| `.uk-child-width-1-2`    | All elements take up half of their parent container.                |
| `.uk-child-width-1-3`    | All elements take up a third of their parent container.             |
| `.uk-child-width-1-4`    | All elements take up a fourth of their parent container.            |
| `.uk-child-width-1-5`    | All elements take up a fifth of their parent container.             |
| `.uk-child-width-1-6`    | All elements take up a sixth of their parent container.             |
| `.uk-child-width-auto`   | Divides the grid into equal units depending on the content size.    |
| `.uk-child-width-expand` | Divides the grid into equal units depending on the available space. |

```html
<div class="uk-child-width-1-4" uk-grid>
    <div></div>
    <div></div>
    ...
</div>
```

```example
<div class="uk-child-width-1-4 uk-grid-small uk-text-center" uk-grid>
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

Items that use width classes with fractions will break into a new row, if they no longer fit their container's width. When using one of the _expand_ classes, however, the space will be evenly distributed among items that always stay in the same row.

```html
<div class="uk-child-width-expand" uk-grid>
    <div></div>
    <div></div>
    ...
</div>
```

```example
<div class="uk-child-width-expand uk-grid-small uk-text-center" uk-grid>
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

## Fixed width

In addition to the calculated width classes, you can also add one of the following classes, which apply fixed widths.

| Class               | Description                       |
|:--------------------|:----------------------------------|
| `.uk-width-small`   | Applies a fixed width of _150px_. |
| `.uk-width-medium`  | Applies a fixed width of _300px_. |
| `.uk-width-large`   | Applies a fixed width of _450px_. |
| `.uk-width-xlarge`  | Applies a fixed width of _600px_. |
| `.uk-width-xxlarge` | Applies a fixed width of _750px_. |

```html
<div class="uk-width-medium"></div>
```

```example
<div class="uk-width-small uk-margin"><div class="uk-card uk-card-small uk-card-default uk-card-body">Small</div></div>
<div class="uk-width-medium uk-margin"><div class="uk-card uk-card-small uk-card-default uk-card-body">Medium</div></div>
<div class="uk-width-large uk-margin"><div class="uk-card uk-card-small uk-card-default uk-card-body">Large</div></div>
<div class="uk-width-xlarge uk-margin"><div class="uk-card uk-card-small uk-card-default uk-card-body">X Large</div></div>
<div class="uk-width-xxlarge uk-margin"><div class="uk-card uk-card-small uk-card-default uk-card-body">XX Large</div></div>
```

***

## Mixing widths

You can also combine `.uk-child-width-*` classes with `.uk-width-*` classes for individual items. That way it is possible, for example, to create a grid with one item that has a specific width and all other items expanding to fill the remaining space.

```html
<div class="uk-child-width-expand" uk-grid>
    <div></div>
    <div class="uk-width-1-3"></div>
    <div></div>
    ...
</div>
```

```example
<div class="uk-child-width-expand uk-grid-small uk-text-center" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Expand</div>
    </div>
    <div class="uk-width-1-3">
        <div class="uk-card uk-card-default uk-card-body">1-3</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Expand</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Expand</div>
    </div>
</div>
```

***

## Responsive width

UIkit provides a number of responsive widths classes. Basically they work just like the usual width classes, except that they have suffixes that represent the breakpoint from which they come to effect. These classes can be combined with the [Visibility component](visibility.md). This is great to adjust your layout and content for different device sizes.

| Class                                       | Description                                                                             |
|:--------------------------------------------|:----------------------------------------------------------------------------------------|
| `.uk-width-*`<br> `.uk-child-width-*`       | Affects all device widths, grid columns stay side by side.                              |
| `.uk-width-*@s`<br> `.uk-child-width-*@s`   | Affects device widths of _640px_ and larger. Grid columns will stack on smaller sizes.  |
| `.uk-width-*@m`<br> `.uk-child-width-*@m`   | Affects device widths of _960px_ and larger. Grid columns will stack on smaller sizes.  |
| `.uk-width-*@l`<br> `.uk-child-width-*@l`   | Affects device widths of _1200px_ and larger. Grid columns will stack on smaller sizes. |
| `.uk-width-*@xl`<br> `.uk-child-width-*@xl` | Affects device widths of _1600px_ and larger. Grid columns will stack on smaller sizes. |

```example
<div class="uk-grid-match uk-grid-small uk-text-center" uk-grid>
    <div class="uk-width-1-2@m">
        <div class="uk-card uk-card-default uk-card-body">1-2@m</div>
    </div>
    <div class="uk-width-1-4@m">
        <div class="uk-card uk-card-default uk-card-body">1-4@m</div>
    </div>
    <div class="uk-width-1-4@m">
        <div class="uk-card uk-card-default uk-card-body">1-4@m</div>
    </div>
    <div class="uk-width-1-5@m uk-hidden@l">
        <div class="uk-card uk-card-secondary uk-card-body">1-5@m<br>hidden@l</div>
    </div>
    <div class="uk-width-1-5@m uk-width-1-3@l">
        <div class="uk-card uk-card-default uk-card-body">1-5@m<br>1-3@l</div>
    </div>
    <div class="uk-width-3-5@m uk-width-2-3@l">
        <div class="uk-card uk-card-default uk-card-body">3-5@m<br>2-3@l</div>
    </div>
</div>

<div class="uk-grid-match uk-grid-small uk-text-center" uk-grid>
    <div class="uk-width-auto@m uk-visible@l">
        <div class="uk-card uk-card-primary uk-card-body">auto@m<br>visible@l</div>
    </div>
    <div class="uk-width-1-3@m">
        <div class="uk-card uk-card-default uk-card-body">1-3@m</div>
    </div>
    <div class="uk-width-expand@m">
        <div class="uk-card uk-card-default uk-card-body">expand@m</div>
    </div>
</div>
```
