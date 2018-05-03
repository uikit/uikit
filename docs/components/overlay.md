# Overlay

<p class="uk-text-lead">Create an image overlay, which comes in different styles.</p>

## Usage

Add the `.uk-overlay` class to an element following an image to create the overlay panel. To create a position context, add the `.uk-inline` class from the [Utility component](utility.md#inline) to a container element around both. Finally, add one of the `.uk-position-*` classes from the [Position component](position.md) to align the overlay.

```html
<div class="uk-inline">
    <img src="" alt="">
    <div class="uk-overlay uk-position-bottom"></div>
</div>
```

**Note** Add the `.uk-light` or `.uk-dark` class, so that elements will be optimized for better visibility on dark or light images.

```example
<div class="uk-inline">
    <img src="../docs/images/photo.jpg" alt="">
    <div class="uk-overlay uk-light uk-position-bottom">
        <p>Default Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
</div>
```

***

## Style modifiers

By default, the overlay has padding, but no additional styling. Add one of these modifier classes to add a background color to the overlay.

### Default

For a simple background color, add the `.uk-overlay-default` class.

```example
<div class="uk-child-width-1-2@m" uk-grid>
    <div>

        <div class="uk-inline">
            <img src="../docs/images/photo.jpg" alt="">
            <div class="uk-overlay uk-overlay-default uk-position-bottom">
                <p>Default Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>

    </div>
    <div>

        <div class="uk-inline">
            <img src="../docs/images/photo.jpg" alt="">
            <div class="uk-overlay-default uk-position-cover"></div>
            <div class="uk-overlay uk-position-bottom uk-dark">
                <p>Default Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>

    </div>
</div>
```

***

### Primary

For a prominent background color, add the `.uk-overlay-primary` class.

```example
<div class="uk-child-width-1-2@m" uk-grid>
    <div>

        <div class="uk-inline">
            <img src="../docs/images/photo.jpg" alt="">
            <div class="uk-overlay uk-overlay-primary uk-position-bottom">
                <p>Default Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>

    </div>
    <div>

        <div class="uk-inline">
            <img src="../docs/images/photo.jpg" alt="">
            <div class="uk-overlay-primary uk-position-cover"></div>
            <div class="uk-overlay uk-position-bottom uk-light">
                <p>Default Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>

    </div>
</div>
```

***

## Overlay icon

To display an overlay icon, add the `uk-overlay-icon` attribute to a `<span>` element inside the overlay.

```html
<div class="uk-position-center">
    <span uk-overlay-icon></span>
</div>
```

```example
<div class="uk-child-width-1-2@m" uk-grid>
    <div>

        <div class="uk-inline uk-light">
            <img src="../docs/images/dark.jpg" alt="">
            <div class="uk-position-center">
                <span uk-overlay-icon></span>
            </div>
        </div>

    </div>
    <div>

        <div class="uk-inline uk-dark">
            <img src="images/photo.jpg" alt="">
            <div class="uk-overlay-default uk-position-cover">
                <div class="uk-position-center">
                    <span uk-overlay-icon></span>
                </div>
            </div>
        </div>

    </div>
</div>
```

***

## Position

Add one of the `.uk-position-*` classes from the [Position component](position.md) to align the overlay.

```html
<div class="uk-overlay uk-position-top"></div>
```

```example
<div class="uk-child-width-1-2@m" uk-grid>
    <div>
        <div class="uk-inline">
            <img src="../docs/images/photo.jpg" alt="">
            <div class="uk-overlay uk-overlay-default uk-position-top">
                <p>Top</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline">
            <img src="../docs/images/photo.jpg" alt="">
            <div class="uk-overlay uk-overlay-default uk-position-center">
                <p>Center</p>
            </div>
        </div>
    </div>
</div>
```
