# Dotnav

<p class="uk-text-lead">Create a dot navigation to operate slideshows or to scroll to different page sections.</p>

## Usage

To create a navigation with dots, use the following classes. This component is built with Flexbox. So to align a dotnav, you can use [Flex component](flex.md).

| Class         | Description                                                                                                         |
|:--------------|:--------------------------------------------------------------------------------------------------------------------|
| `.uk-dotnav`  | Add this class to a `<ul>` element to define the Dotnav component. Use `<a>` elements as nav items within the list. |
| `.uk-active ` | Add this class to a list item to apply an active state.                                                             |                                                         |

```html
<ul class="uk-dotnav">
    <li class="uk-active"><a href=""></a></li>
    <li><a href=""></a></li>
</ul>
```

```example
<ul class="uk-dotnav">
    <li class="uk-active"><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
    <li><a href="#">Item 4</a></li>
    <li><a href="#">Item 5</a></li>
</ul>
```

***

## Vertical alignment

The dotnav can also be displayed vertically. Just add the `.uk-dotnav-vertical` modifier.

```html
<ul class="uk-dotnav uk-dotnav-vertical">...</ul>
```

```example
<ul class="uk-dotnav uk-dotnav-vertical">
    <li class="uk-active"><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
    <li><a href="#">Item 4</a></li>
    <li><a href="#">Item 5</a></li>
</ul>
```


***

## Position as overlay

To position the dotnav on top of an element or the [Slideshow component](slideshow.md) for example, add one of the `.uk-position-*` classes from the [Position component](position.md) to a `div` element wrapping the dotnav. To create a position context on the container, add the `.uk-position-relative` class.

Use the `.uk-light` or `.uk-dark` class from the [Inverse component](inverse.md) to apply a light or dark color for better visibility.

```html
<div class="uk-position-relative uk-light">

    <!-- The element which is wrapped goes here -->

    <div class="uk-position-bottom-center uk-position-small">
        <ul class="uk-dotnav">...</ul>
    </div>

</div>
```

```example
<div class="uk-position-relative uk-light" uk-slideshow>

    <ul class="uk-slideshow-items">
        <li>
            <img src="../docs/images/photo.jpg" alt="" uk-cover>
        </li>
        <li>
            <img src="../docs/images/dark.jpg" alt="" uk-cover>
        </li>
        <li>
            <img src="../docs/images/size1.jpg" alt="" uk-cover>
        </li>
    </ul>

    <div class="uk-position-bottom-center uk-position-small">
        <ul class="uk-dotnav">
            <li uk-slideshow-item="0"><a href="#">Item 1</a></li>
            <li uk-slideshow-item="1"><a href="#">Item 2</a></li>
            <li uk-slideshow-item="2"><a href="#">Item 3</a></li>
        </ul>
    </div>

</div>
```

***

## Vertically center in viewport

The dotnav can also be centered vertically inside your viewport by adding the `.uk-position-center-right` and `.uk-position-fixed` classes from the [Position component](position.md). This is useful for typical onepage websites.

```html
<div class="uk-position-center-right uk-position-medium uk-position-fixed">
    <ul class="uk-dotnav uk-dotnav-vertical">...</ul>
</div>
```
