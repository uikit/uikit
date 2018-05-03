# Slidenav

<p class="uk-text-lead">Defines a navigation with previous and next buttons to flip through slideshows.</p>

## Usage

To create a navigation with previous and next buttons, just add the `uk-slidenav` attribute to `<a>` elements. Add the `previous` or `next` parameter to the attribute to style the nav items as previous or next buttons.

```html
<a href="" uk-slidenav-next></a>
<a href="" uk-slidenav-previous></a>
```

```example
<a href="#" uk-slidenav-previous></a>
<a href="#" uk-slidenav-next></a>
```

***

## Large modifier

To increase the size of the slidenav icons, add the `.uk-slidenav-large` class.

```html
<a href="" class="uk-slidenav-large" uk-slidenav-next></a>
<a href="" class="uk-slidenav-large" uk-slidenav-previous></a>
```

```example
<a href="#" class="uk-slidenav-large" uk-slidenav-previous></a>
<a href="#" class="uk-slidenav-large" uk-slidenav-next></a>
```

***

## Slidenav container

To display a conjoint slidenav, wrap the slidenav items inside a `<div>` element and add the `.uk-slidenav-container` class, as well as one of the `.uk-position-*` classes.

```html
<div class="uk-slidenav-container">
    <a href="" uk-slidenav-previous></a>
    <a href="" uk-slidenav-next></a>
</div>
```

```example
<div class="uk-slidenav-container">
    <a href="" uk-slidenav-previous></a>
    <a href="" uk-slidenav-next></a>
</div>
```

***

## Position as overlay

To position the slidenav on top of an element or the [Slideshow component](slideshow.md) for example, just add one of the `.uk-position-*` classes from the [Position component](position.md). To create a position context on the container, add the `.uk-position-relative` class.

Use the `.uk-light` or `.uk-dark` class from the [Inverse component](inverse.md) to apply a light or dark color for better visibility.

```html
<div class="uk-position-relative uk-light">

    <!-- The element which is wrapped goes here -->

    <a class="uk-position-center-left" href="" uk-slidenav-previous></a>
    <a class="uk-position-center-right" href="" uk-slidenav-next></a>

</div>
```

**Note** You can also apply the [Visibility component](visibility.md#show-on-hover), so that the slidenav only appears on hover.

```example
<div class="uk-position-relative uk-visible-toggle uk-light" uk-slideshow>

    <ul class="uk-slideshow-items">
        <li>
            <img src="../docs/images/photo.jpg" alt="" uk-cover>
        </li>
        <li>
            <img src="../docs/images/dark.jpg" alt="" uk-cover>
        </li>
        <li>
            <img src="../docs/images/light.jpg" alt="" uk-cover>
        </li>
    </ul>

    <a class="uk-slidenav-large uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slideshow-item="previous"></a>
    <a class="uk-slidenav-large uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slideshow-item="next"></a>

</div>
```