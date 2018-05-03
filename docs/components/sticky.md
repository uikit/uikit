# Sticky

<p class="uk-text-lead">Make elements remain at the top of the viewport, like a sticky navigation.</p>

## Usage

To create an element that remains at the top of the viewport when scrolling down the site, add the `uk-sticky` attribute to that element.

```html
<div uk-sticky></div>
```

```example
<div class="uk-card uk-card-default uk-card-body" style="z-index: 980;" uk-sticky="bottom: #offset">Stick to the top</div>
```

**Note** Example elements on this page are only sticky until you scroll down to the next heading and disappear afterwards. This was done so as not to clutter your screen with all variations of sticky containers.

***

## Offset

You can position the element below the viewport edge. Add the `offset` attribute and the distance in pixels.

```html
<div uk-sticky="offset: 100"></div>
```

```example
<div class="uk-card uk-card-default uk-card-body" style="z-index: 980;" uk-sticky="offset: 100; bottom: #top">Stick 100px below the top</div>
```

***

## Top

To apply the sticky behavior with a delay, add the `top` attribute, which can be defined either by a number representing the offset in pixels, but also viewport height or a CSS selector.

```html
<!-- Sticks after 100px of scrolling -->
<div uk-sticky="top: 100"></div>

<!-- Sticks after 100vh -->
<div uk-sticky="top: 100vh"></div>

<!-- Sticks to the top of the container -->
<div id="my-id">
    <div uk-sticky="top: #my-id"></div>
</div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body" style="z-index: 980;" uk-sticky="top: 200; bottom: #animation">Stick to the top but only after 200px scrolling</div>
    </div>
    <div>
        <div id="container-1" class="uk-background-muted uk-height-medium" style="margin-bottom: 200px;">
            <div class="uk-card uk-card-default uk-card-body" style="z-index: 980;" uk-sticky="top: #container-1; bottom: #animation">Stick to the top but below the box</div>
        </div>
    </div>
</div>
```

***

## Animation

Add an animation from the [Animation component](animation.md) in order to have the sticky element reappear smoothly.

```html
<div uk-sticky="animation: uk-animation-slide-top"></div>
```

```example
<div class="uk-card uk-card-default uk-card-body" style="margin-bottom: 200px; z-index: 980;" uk-sticky="top: 100; animation: uk-animation-slide-top; bottom: #sticky-on-scroll-up">Animation Slide Top</div>
```

***

## Sticky on scroll up

You can make the sticky element show only when scrolling up to save space. Together with an animation, this makes for a very smooth experience.

```html
<div uk-sticky="show-on-up: true"></div>
```

```example
<div class="uk-card uk-card-default uk-card-body" style="margin-bottom: 200px; z-index: 980;" uk-sticky="show-on-up: true; animation: uk-animation-slide-top; bottom: #bottom">Slide in on scroll up</div>
```

***

## Bottom

Bind the sticky behavior to a specific element, so that it disappears after scrolling past that point of the page.

```html
<!-- Sticks until the bottom of its parent container -->
<div>
    <div uk-sticky="bottom: true"></div>
</div>

<!-- Sticks until the second container -->
<div uk-sticky="bottom: #my-id"></div>
<div id="my-id"></div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <div class="uk-background-muted uk-height-medium">
            <div class="uk-height-medium uk-background-muted">
                <div class="uk-card uk-card-default uk-card-body" style="z-index: 980;" uk-sticky="bottom: true">Stick until the bottom of its parent container</div>
            </div>
        </div>
    </div>
    <div>
        <div>
            <div class="uk-card uk-card-default uk-card-body" style="z-index: 980;" uk-sticky="bottom: #container-2">Stick until the next headline</div>
        </div>
    </div>
</div>

<h3 id="container-2">Some Headline</h3>

```

***

## Responsive

You also have the possibility of disabling the sticky behavior for different devices by applying the `media` option to the `uk-sticky` attribute and adding the appropriate viewport width. The element will be sticky from the specified viewport width and upwards, but not below.

```html
<div uk-sticky="media: 640"></div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option          | Value                                 | Default     | Description                                                                                                   |
|:----------------|:--------------------------------------|:------------|:--------------------------------------------------------------------------------------------------------------|
| `top`           | Number, viewport height, CSS selector | `0`         | The top offset from where the element should be stick.                                                        |
| `bottom `       | Boolean, CSS selector                 | `false`     | The bottom offset until the element should stick. (true: parent element, prefixed with '!' a parent selector) |
| `offset `       | Number                                | `0`         | The offset the Sticky should be fixed to.                                                                     |
| `animation `    | String                                | `false`     | The animation to use when the element becomes sticky.                                                         |
| `cls-active`    | String                                | `uk-active` | The active class.                                                                                             |
| `cls-inactive`  | String                                | `''`        | The inactive class.                                                                                           |
| `width-element` | CSS selector                          | `false`     | The element the Sticky should get its width from in active mode.                                              |
| `show-on-up`    | Boolean                               | `false`     | Only show sticky element when scrolling up.                                                                   |
| `media `        | Integer, String                       | `false`     | Condition for the active status - a width as integer (e.g. 640) or a breakpoint (e.g. @s, @m, @l, @xl) or any valid media query (e.g. (min-width: 900px)).       |
| `target `       | Boolean                               | `false`     | Initially make sure that the Sticky is not over a targeted element via location hash.                         |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.sticky(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name       | Description                                  |
|:-----------|:---------------------------------------------|
| `active`   | Fires after the element becomes sticky.      |
| `inactive` | Fires after the element is no longer sticky. |
