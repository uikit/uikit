# Flex

<p class="uk-text-lead">Utilize the power of flexbox to create a wide range of layouts.</p>

The Flex component has an essential role in building layouts in UIkit. A lot of components, for example the [Grid](grid.md) as well as horizontal navigations, like the [Navbar](navbar.md), [Subnav](subnav.md), [Breadcrumb](breadcrumb.md), [Pagination](pagination.md), [Tab](tab.md) and [Dotnav](dotnav.md) are built with flexbox and can be used together with the utility classes from this component.

***

## Usage

To apply the flexbox layout model, use one of the following classes. By default, all flex items are aligned to the left, as wide as their content and matched in height.

| Class             | Description                                                  |
|:------------------|:-------------------------------------------------------------|
| `.uk-flex`        | Create the flex container and behave like a block element.   |
| `.uk-flex-inline` | Create the flex container and behave like an inline element. |

```html
<div class="uk-flex">
    <div></div>
</div>
```

```example
<div class="uk-flex">
    <div class="uk-card uk-card-default uk-card-body">Item 1</div>
    <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 2</div>
    <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 3</div>
</div>
```

***

## Horizontal alignment

These classes define the horizontal alignment of flex items and distribute the space between them. Add one or more of them to the flex container in order to configure the alignments of the flex items. By default, flex items are aligned to the left as does the `.uk-flex-left` class.

| Class              | Description                                                                                        |
|:-------------------|:---------------------------------------------------------------------------------------------------|
| `.uk-flex-left`    | Add this class to align flex items to the left.                                                    |
| `.uk-flex-center`  | Add this class to center flex items along the main axis.                                           |
| `.uk-flex-right`   | Add this class to align flex items to the right.                                                   |
| `.uk-flex-between` | Add this class to distribute items evenly, with equal space between the items along the main axis. |
| `.uk-flex-around`  | Add this class to distribute items evenly with equal space on both sides of each item.             |

```html
<div class="uk-flex uk-flex-center">
    <div></div>
</div>
```

```example
<div class="uk-flex uk-flex-center">
    <div class="uk-card uk-card-default uk-card-body">Item 1</div>
    <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 2</div>
    <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 3</div>
</div>
```

***

### Responsive

UIkit provides a number of responsive flex classes for horizontal alignment. Basically, they work just like the usual flex alignment classes, except that they have suffixes that represent the breakpoint from which they come to effect.

| Class | Description |
|:------|:------------|
| `.uk-flex-left@s`<br> `.uk-flex-center@s`<br> `.uk-flex-right@s`<br> `.uk-flex-between@s`<br> `.uk-flex-around@s` | Only affects device widths of _640px_ and higher. |
| `.uk-flex-left@m`<br> `.uk-flex-center@m`<br> `.uk-flex-right@m`<br> `.uk-flex-between@m`<br> `.uk-flex-around@m` | Only affects device widths of _960px_ and higher. |
| `.uk-flex-left@l`<br> `.uk-flex-center@l`<br> `.uk-flex-right@l`<br> `.uk-flex-between@l`<br> `.uk-flex-around@l` | Only affects device widths of _1200px_ and higher. |
| `.uk-flex-left@xl`<br> `.uk-flex-center@xl`<br> `.uk-flex-right@xl`<br> `.uk-flex-between@xl`<br> `.uk-flex-around@xl` | Only affects device widths of _1600px_ and higher. |

```html
<div class="uk-flex uk-flex-center@m uk-flex-right@l">
    <div></div>
</div>
```

```example
<div class="uk-flex uk-flex-center@m uk-flex-right@l">
    <div class="uk-card uk-card-default uk-card-body">Item 1</div>
    <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 2</div>
    <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 3</div>
</div>
```

***

## Vertical alignment

These classes define the vertical alignment of flex items. By default, flex items fill the height of their container as does the `.uk-flex-stretch` class.


| Class              | Description                                                             |
|:-------------------|:------------------------------------------------------------------------|
| `.uk-flex-stretch` | Add this class to expand flex items to fill the height of their parent. |
| `.uk-flex-top`     | Add this class to align flex items to the top.                          |
| `.uk-flex-middle`  | Add this class to center flex items along the cross axis.               |
| `.uk-flex-bottom`  | Add this class to align flex items to the bottom.                       |

```html
<div class="uk-flex uk-flex-middle"></div>
```

```example
<div class="uk-flex uk-flex-middle uk-text-center">
  <div class="uk-card uk-card-default uk-card-body">Item 1</div>
   <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 2<br>...</div>
   <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 3<br>...<br>...</div>
</div>
```

***

## Direction modifiers

These classes define the axis that flex items are placed on and their direction. By default, items run horizontally from left to right as does the `.uk-flex-row` class.

| Class                     | Description                                               |
|:--------------------------|:----------------------------------------------------------|
| `.uk-flex-row`            | Add this class to lay out flex items as horizontal rows.  |
| `.uk-flex-row-reverse`    | Add this class to lay out flex items from right to left.  |
| `.uk-flex-column`         | Add this class to lay out flex items as vertical columns. |
| `.uk-flex-column-reverse` | Add this class to lay out flex items from bottom to top.  |

```html
<div class="uk-flex uk-flex-column"></div>
```

```example
<div class="uk-flex uk-flex-column uk-width-1-3">
   <div class="uk-card uk-card-default uk-card-body">Item 1</div>
   <div class="uk-card uk-card-default uk-card-body uk-margin-top">Item 2</div>
   <div class="uk-card uk-card-default uk-card-body uk-margin-top">Item 3</div>
</div>
```

***

## Wrap modifiers

By default, flex items are fit into one line and run from left to right. Add one of these classes to modify the behavior of wrapping flex items.

| Class                   | Description                                                                                       |
|:------------------------|:--------------------------------------------------------------------------------------------------|
| `.uk-flex-wrap`         | Add this class to make flex items wrap into another line when they no longer fit their container. |
| `.uk-flex-wrap-reverse` | Add this class to change the items' direction so that they run from right to left.                |
| `.uk-flex-nowrap`       | Add this class to force the flex items into one line. This is the default behavior.               |

The following classes modify the alignment of wrapping flex items.

| Class                   | Description                                                                                                                |
|:------------------------|:---------------------------------------------------------------------------------------------------------------------------|
| `.uk-flex-wrap-stretch` | Add this class, so that item lines stretch to take up the remaining space                                                  |
| `.uk-flex-wrap-between` | Add this class to distribute item lines evenly, with the first row at the top and last row at the bottom of the container. |
| `.uk-flex-wrap-around`  | Add this class to distribute lines evenly with equal space at the top and bottom of each row.                              |
| `.uk-flex-wrap-top`     | Add this class to align multiline flex items to the top.                                                                   |
| `.uk-flex-wrap-middle`  | Add this class to vertically center multirow flex items.                                                                   |
| `.uk-flex-wrap-bottom`  | Add this class to align multiline flex items to the bottom.                                                                |

```html
<div class="uk-flex uk-flex-wrap uk-flex-wrap-around"></div>
```

```example
<div class="uk-flex uk-flex-wrap uk-flex-wrap-around uk-background-muted uk-height-medium">
    <div class="uk-width-1-3 uk-card uk-card-default uk-card-body uk-card-small">Item 1</div>
    <div class="uk-width-1-2 uk-card uk-card-default uk-card-body uk-card-small uk-margin-left">Item 2</div>
    <div class="uk-width-1-3 uk-card uk-card-default uk-card-body uk-card-small">Item 3</div>
    <div class="uk-width-1-3 uk-card uk-card-default uk-card-body uk-card-small uk-margin-left">Item 4</div>
    <div class="uk-width-1-2 uk-card uk-card-default uk-card-body uk-card-small">Item 5</div>
    <div class="uk-width-1-3 uk-card uk-card-default uk-card-body uk-card-small uk-margin-left">Item 6</div>
</div>
```

***

## Item order

By default, flex items are laid out according to the source order. To display a certain item as the first or last one, just add one of these classes.

| Class                                      | Description                                   |
|:-------------------------------------------|:----------------------------------------------|
| `.uk-flex-first`                           | Displays the item as the first one.           |
| `.uk-flex-last`                            | Displays the item as the last one.            |
| `.uk-flex-first@s`<br> `.uk-flex-last@s`   | Affects device widths of _640px_ and higher.  |
| `.uk-flex-first@m`<br> `.uk-flex-last@m`   | Affects device widths of _960px_ and higher.  |
| `.uk-flex-first@l`<br> `.uk-flex-last@l`   | Affects device widths of _1200px_ and higher. |
| `.uk-flex-first@xl`<br> `.uk-flex-last@xl` | Affects device widths of _1600px_ and higher. |

```html
<div class="uk-flex">
  <div></div>
  <div class="uk-flex-first"></div>
</div>
```

```example
<div class="uk-flex">
   <div class="uk-card uk-card-default uk-card-body uk-flex-last uk-margin-left">Item 1</div>
   <div class="uk-card uk-card-default uk-card-body uk-flex-first">Item 2</div>
   <div class="uk-card uk-card-default uk-card-body uk-margin-left">Item 3</div>
</div>
```

***

## Item dimensions

To determine how much space a flex item should take up, add one of the following classes to the item. By default, items determine their size by their content, but are allowed to shrink.

| Class           | Description                                            |
|:----------------|:-------------------------------------------------------|
| `.uk-flex-none` | The box's size is determined by its content.           |
| `.uk-flex-auto` | The space is allocated considering the item's content. |
| `.uk-flex-1`    | The space is allocated solely based on flex.           |

***

## Flex and grid

The Flex component can be combined with a grid from the [Grid component](grid.md).

```example
<div class="uk-flex-middle" uk-grid>
    <div class="uk-width-2-3@m">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
    </div>
    <div class="uk-width-1-3@m uk-flex-first">
        <img src="../docs/images/light.jpg" alt="Image">
    </div>
</div>
```
