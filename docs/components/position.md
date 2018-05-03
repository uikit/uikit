# Position

<p class="uk-text-lead">A collection of utility classes to position content.</p>

## Usage

To apply this component, add one of the `.uk-position-*` classes to a block element. When using this component to place content on top of an image, add the `.uk-inline` class from the [Utility component](utility.md#inline) to a container element around the image and the element to create a position context.

**Note** This is often used to position an overlay from the [Overlay component](overlay.md). Use the `.uk-light` or `.uk-dark` class from the [Inverse component](inverse.md) to apply a light or dark color for better visibility.

| Class                 | Description                          |
|:----------------------|:-------------------------------------|
| `.uk-position-top`    | Positions the element at the top.    |
| `.uk-position-left`   | Positions the element at the left.   |
| `.uk-position-right`  | Positions the element at the right.  |
| `.uk-position-bottom` | Positions the element at the bottom. |

```html
<div class="uk-inline">

    <!-- Place any content, like an image, here -->

    <div class="uk-position-center"></div>

</div>
```

```example
<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-top uk-overlay uk-overlay-default uk-text-center">Top</div>
    <div class="uk-position-bottom uk-overlay uk-overlay-default uk-text-center">Bottom</div>
    <div class="uk-position-left uk-overlay uk-overlay-default uk-flex uk-flex-middle">Left</div>
    <div class="uk-position-right uk-overlay uk-overlay-default uk-flex uk-flex-middle">Right</div>

</div>
```

***

### X and Y directions

You can also apply more specific positions that won't spread over one side of the parent container by adding one of the following classes.

| Class                        | Description                                              |
|:-----------------------------|:---------------------------------------------------------|
| `.uk-position-top-left`      | Positions the element at the top left.                   |
| `.uk-position-top-center`    | Positions the element at the top center.                 |
| `.uk-position-top-right`     | Positions the element at the top right.                  |
| `.uk-position-center`        | Positions the element vertically centered in the middle. |
| `.uk-position-center-left`   | Positions the element vertically centered on the left.   |
| `.uk-position-center-right`  | Positions the element vertically centered on the right.  |
| `.uk-position-bottom-left`   | Positions the element at the bottom left.                |
| `.uk-position-bottom-center` | Positions the element at the bottom center.              |
| `.uk-position-bottom-right`  | Positions the element at the bottom right.               |


```html
<div class="uk-position-top-right"></div>
```

```example
<div class="uk-inline">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-top-left uk-overlay uk-overlay-default">Top Left</div>
    <div class="uk-position-top-center uk-overlay uk-overlay-default">Top Center</div>
    <div class="uk-position-top-right uk-overlay uk-overlay-default">Top Right</div>
    <div class="uk-position-center-left uk-overlay uk-overlay-default">Center Left</div>
    <div class="uk-position-center uk-overlay uk-overlay-default">Center</div>
    <div class="uk-position-center-right uk-overlay uk-overlay-default">Center Right</div>
    <div class="uk-position-bottom-left uk-overlay uk-overlay-default">Bottom Left</div>
    <div class="uk-position-bottom-center uk-overlay uk-overlay-default">Bottom Center</div>
    <div class="uk-position-bottom-right uk-overlay uk-overlay-default">Bottom Right</div>

</div>
```

***

### Cover

If you want a position element to cover its container, just add the `.uk-position-cover` class.


```html
<div class="uk-position-cover"></div>
```

```example
<div class="uk-inline">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">Cover</div>

</div>
```

***

### Outside

There are two classes to center elements outside on the left and right of the parent container. This is useful to position the [Slidenav component](slidenav.md) outside of an [Slideshow](slideshow.md) or [Slider](slider.md) component.

| Class                           | Description                                                     |
|:--------------------------------|:----------------------------------------------------------------|
| `.uk-position-center-left-out`  | Positions the element vertically centered outside on the left.  |
| `.uk-position-center-right-out` | Positions the element vertically centered outside on the right. |

**Note** Once the outside positioned element sticks out of the viewport to the right, it will cause a horizontal scrollbar. Use the [Visibility component](visibility.md) to hide the outside positioned element on a smaller viewports and show an inside positioned element instead.

```html
<div class="uk-position-center-left-out"></div>
```

```example
<div class="uk-inline">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-center-left-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>
    <div class="uk-position-center-right-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>

</div>
```

***

## Small modifier

To apply a small margin to positioned elements, add the `.uk-position-small` class.

```html
<div class="uk-position-small uk-position-center"></div>
```

```example
<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-small uk-position-top-left uk-overlay uk-overlay-default">Top Left</div>
    <div class="uk-position-small uk-position-top-center uk-overlay uk-overlay-default">Top Center</div>
    <div class="uk-position-small uk-position-top-right uk-overlay uk-overlay-default">Top Right</div>
    <div class="uk-position-small uk-position-center-left uk-overlay uk-overlay-default">Center Left</div>
    <div class="uk-position-small uk-position-center uk-overlay uk-overlay-default">Center</div>
    <div class="uk-position-small uk-position-center-right uk-overlay uk-overlay-default">Center Right</div>
    <div class="uk-position-small uk-position-bottom-left uk-overlay uk-overlay-default">Bottom Left</div>
    <div class="uk-position-small uk-position-bottom-center uk-overlay uk-overlay-default">Bottom Center</div>
    <div class="uk-position-small uk-position-bottom-right uk-overlay uk-overlay-default">Bottom Right</div>

</div>

<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-small uk-position-top uk-overlay uk-overlay-default uk-text-center">Top</div>
    <div class="uk-position-small uk-position-bottom uk-overlay uk-overlay-default uk-text-center">Bottom</div>
    <div class="uk-position-small uk-position-left uk-overlay uk-overlay-default uk-flex uk-flex-middle">Left</div>
    <div class="uk-position-small uk-position-right uk-overlay uk-overlay-default uk-flex uk-flex-middle">Right</div>

</div>

<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-small uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">Cover</div>

</div>

<div class="uk-margin uk-text-center">
    <div class="uk-inline-block uk-width-large">

        <img src="../docs/images/photo.jpg" alt="">

        <div class="uk-position-small uk-position-center-left-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>
        <div class="uk-position-small uk-position-center-right-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>

    </div>
</div>
```

***

## Medium modifier

To apply a medium margin to positioned elements, add the `.uk-position-medium` class.

```html
<div class="uk-position-medium uk-position-center"></div>
```

```example
<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-medium uk-position-top-left uk-overlay uk-overlay-default">Top Left</div>
    <div class="uk-position-medium uk-position-top-center uk-overlay uk-overlay-default">Top Center</div>
    <div class="uk-position-medium uk-position-top-right uk-overlay uk-overlay-default">Top Right</div>
    <div class="uk-position-medium uk-position-center-left uk-overlay uk-overlay-default">Center Left</div>
    <div class="uk-position-medium uk-position-center uk-overlay uk-overlay-default">Center</div>
    <div class="uk-position-medium uk-position-center-right uk-overlay uk-overlay-default">Center Right</div>
    <div class="uk-position-medium uk-position-bottom-left uk-overlay uk-overlay-default">Bottom Left</div>
    <div class="uk-position-medium uk-position-bottom-center uk-overlay uk-overlay-default">Bottom Center</div>
    <div class="uk-position-medium uk-position-bottom-right uk-overlay uk-overlay-default">Bottom Right</div>

</div>

<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-medium uk-position-top uk-overlay uk-overlay-default uk-text-center">Top</div>
    <div class="uk-position-medium uk-position-bottom uk-overlay uk-overlay-default uk-text-center">Bottom</div>
    <div class="uk-position-medium uk-position-left uk-overlay uk-overlay-default uk-flex uk-flex-middle">Left</div>
    <div class="uk-position-medium uk-position-right uk-overlay uk-overlay-default uk-flex uk-flex-middle">Right</div>

</div>

<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-medium uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">Cover</div>

</div>

<div class="uk-margin uk-text-center">
    <div class="uk-inline-block uk-width-large">

        <img src="../docs/images/photo.jpg" alt="">

        <div class="uk-position-medium uk-position-center-left-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>
        <div class="uk-position-medium uk-position-center-right-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>

    </div>
</div>
```

***

## Large modifier

To apply a large margin to positioned elements, add the `.uk-position-large` class.

```html
<div class="uk-position-large uk-position-center"></div>
```

```example
<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-large uk-position-top-left uk-overlay uk-overlay-default">Top Left</div>
    <div class="uk-position-large uk-position-top-center uk-overlay uk-overlay-default">Top Center</div>
    <div class="uk-position-large uk-position-top-right uk-overlay uk-overlay-default">Top Right</div>
    <div class="uk-position-large uk-position-center-left uk-overlay uk-overlay-default">Center Left</div>
    <div class="uk-position-large uk-position-center uk-overlay uk-overlay-default">Center</div>
    <div class="uk-position-large uk-position-center-right uk-overlay uk-overlay-default">Center Right</div>
    <div class="uk-position-large uk-position-bottom-left uk-overlay uk-overlay-default">Bottom Left</div>
    <div class="uk-position-large uk-position-bottom-center uk-overlay uk-overlay-default">Bottom Center</div>
    <div class="uk-position-large uk-position-bottom-right uk-overlay uk-overlay-default">Bottom Right</div>

</div>

<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-large uk-position-top uk-overlay uk-overlay-default uk-text-center">Top</div>
    <div class="uk-position-large uk-position-bottom uk-overlay uk-overlay-default uk-text-center">Bottom</div>
    <div class="uk-position-large uk-position-left uk-overlay uk-overlay-default uk-flex uk-flex-middle">Left</div>
    <div class="uk-position-large uk-position-right uk-overlay uk-overlay-default uk-flex uk-flex-middle">Right</div>

</div>

<div class="uk-inline uk-margin">

    <img src="../docs/images/photo.jpg" alt="">

    <div class="uk-position-large uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">Cover</div>

</div>

<div class="uk-margin uk-text-center">
    <div class="uk-inline-block uk-width-large">

        <img src="../docs/images/photo.jpg" alt="">

        <div class="uk-position-large uk-position-center-left-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>
        <div class="uk-position-large uk-position-center-right-out uk-overlay uk-overlay-primary uk-visible@s">Out</div>

    </div>
</div>
```

***

## Utility classes

This component features a number of general position utility classes:

| Class                   | Description                                   |
|:------------------------|:----------------------------------------------|
| `.uk-position-relative` | Add this class to apply relative positioning. |
| `.uk-position-absolute` | Add this class to apply absolute positioning. |
| `.uk-position-fixed`    | Add this class to apply fixed positioning.    |
| `.uk-position-z-index`  | Add this class to apply a z-index of 1.       |
