# Transition

<p class="uk-text-lead">Create smooth transitions between two states when hovering an element.</p>

## Usage

To apply this component, add the `.uk-transition-toggle` class to a parent element. This will trigger the transition when the element is hovered. Also add `tabindex="0"` to make the transition accessable through keyboard navigation.

Add one of the `.uk-transition-*` classes to the element itself to apply the actual effect.

This component is mostly used in combination with the [Overlay component](overlay.md) as elements are transitioned from invisible to visible state. To place the overlay on top of another element, like an image, use the [Position component](position.md).

```html
<div class="uk-transition-toggle" tabindex="0">
    <div class="uk-transition-fade"></div>
</div>
```

| Class                 | Description              |
|:----------------------|:-------------------------|
| `.uk-transition-fade` | Lets the element fade in |
| `.uk-transition-scale-up`<br> `.uk-transition-scale-down` | The element scales up or down. |
| `.uk-transition-slide-top`<br> `.uk-transition-slide-bottom`<br> `.uk-transition-slide-left`<br> `.uk-transition-slide-right` | Lets the element slide in from the top |
| `.uk-transition-slide-top-small`<br> `.uk-transition-slide-bottom-small`<br>  `.uk-transition-slide-left-small`<br> `.uk-transition-slide-right-small` | The element slides in from the top, bottom, left or right with a smaller distance. |
| `.uk-transition-slide-top-medium`<br> `.uk-transition-slide-bottom-medium`<br>  `.uk-transition-slide-left-medium`<br> `.uk-transition-slide-right-medium`   | The element slides in from the top, bottom, left or right with a medium distance. |

```example
<div class="uk-child-width-1-2 uk-child-width-1-3@s uk-grid-match uk-grid-small" uk-grid>
    <div class="uk-text-center">
        <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
            <img src="../docs/images/dark.jpg" alt="">
            <div class="uk-transition-fade uk-position-cover uk-position-small uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">
                <p class="uk-h4 uk-margin-remove">Fade</p>
            </div>
        </div>
        <p class="uk-margin-small-top">Fade</p>
    </div>
    <div class="uk-text-center">
        <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
            <img src="../docs/images/dark.jpg" alt="">
            <div class="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-default">
                <p class="uk-h4 uk-margin-remove">Bottom</p>
            </div>
        </div>
        <p class="uk-margin-small-top">Bottom</p>
    </div>
    <div class="uk-text-center">
        <div class="uk-inline-clip uk-transition-toggle uk-light" tabindex="0">
            <img src="../docs/images/dark.jpg" alt="">
            <div class="uk-position-center">
                <span class="uk-transition-fade" uk-icon="icon: plus; ratio: 2"></span>
            </div>
        </div>
        <p class="uk-margin-small-top">Icon</p>
    </div>
    <div class="uk-text-center">
        <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
            <img src="images/dark.jpg" alt="">
            <img class="uk-transition-scale-up uk-position-cover" src="images/light.jpg" alt="">
        </div>
        <p class="uk-margin-small-top">2 Images</p>
    </div>
    <div class="uk-text-center">
        <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
            <img class="uk-transition-scale-up uk-transition-opaque" src="../docs/images/dark.jpg" alt="">
        </div>
        <p class="uk-margin-small-top">Scale Up Image</p>
    </div>
    <div class="uk-text-center">
        <div class="uk-inline-clip uk-transition-toggle uk-light" tabindex="0">
            <img src="../docs/images/dark.jpg" alt="">
            <div class="uk-position-center">
                <div class="uk-transition-slide-top-small"><h4 class="uk-margin-remove">Headline</h4></div>
                <div class="uk-transition-slide-bottom-small"><h4 class="uk-margin-remove">Subheadline</h4></div>
            </div>
        </div>
        <p class="uk-margin-small-top">Small Top + Bottom</p>
    </div>
</div>
```