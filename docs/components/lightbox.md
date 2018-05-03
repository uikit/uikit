# Lightbox

<p class="uk-text-lead">Create a responsive lightbox gallery with images and videos.</p>

The lightbox component is fully responsive and supports touch and swipe navigation, as well as mouse drag for desktops. When swiping between slides the animation literally sticks at your fingertip or mouse cursor. Clicking fast on the previous and next navigation, will make animations even accelerate to keep up with your pace. All animations are hardware accelerated for a smoother performance.

## Usage

To apply this component, add the `uk-lightbox` attribute to a container to turn all anchors inside that container into lightbox links.

```html
<div uk-lightbox>
    <a href="image.jpg"></a>
</div>
```

```example
<div uk-lightbox>
    <a class="uk-button uk-button-default" href="../docs/images/photo.jpg">Open Lightbox</a>
</div>
```

***

## Alt Attribute

To add an `alt` attribute to the image in the lightbox, set the `data-alt` attribute on an anchor.

```html
<div uk-lightbox>
    <a href="image.jpg" data-alt="Image"></a>
</div>
```

```example
<div uk-lightbox>
    <a class="uk-button uk-button-default" href="../docs/images/photo.jpg" data-alt="Image">Open Lightbox</a>
</div>
```

***

## Caption

To display a caption at the bottom of the lightbox, set the `data-caption` attribute on an anchor.

```html
<div uk-lightbox>
    <a href="image.jpg" data-caption="Caption"></a>
</div>
```

```example
<div uk-lightbox>
    <a class="uk-button uk-button-default" href="../docs/images/photo.jpg" data-caption="Caption">Open Lightbox</a>
</div>
```

***

## Animations

By default, the Lightbox gallery uses a slide animation. You can set the `animation` option to use a different one. Possible values are `slide`, `fade` and `scale`.

```html
<div uk-lightbox="animation: fade">
    <a href="image.jpg"></a>
</div>
```

```example
<div class="uk-h3">Slide</div>
<div class="uk-child-width-1-3@m" uk-grid uk-lightbox="animation: slide">
    <div>
        <a class="uk-inline" href="../docs/images/photo.jpg" data-caption="Caption 1">
            <img src="../docs/images/photo.jpg" alt="">
        </a>
    </div>
    <div>
        <a class="uk-inline" href="../docs/images/dark.jpg" data-caption="Caption 2">
            <img src="../docs/images/dark.jpg" alt="">
        </a>
    </div>
    <div>
        <a class="uk-inline" href="../docs/images/light.jpg" data-caption="Caption 3">
            <img src="../docs/images/light.jpg" alt="">
        </a>
    </div>
</div>

<div class="uk-h3">Fade</div>
<div class="uk-child-width-1-3@m" uk-grid uk-lightbox="animation: fade">
    <div>
        <a class="uk-inline" href="../docs/images/photo.jpg" data-caption="Caption 1">
            <img src="../docs/images/photo.jpg" alt="">
        </a>
    </div>
    <div>
        <a class="uk-inline" href="../docs/images/dark.jpg" data-caption="Caption 2">
            <img src="../docs/images/dark.jpg" alt="">
        </a>
    </div>
    <div>
        <a class="uk-inline" href="../docs/images/light.jpg" data-caption="Caption 3">
            <img src="../docs/images/light.jpg" alt="">
        </a>
    </div>
</div>

<div class="uk-h3">Scale</div>
<div class="uk-child-width-1-3@m" uk-grid uk-lightbox="animation: scale">
    <div>
        <a class="uk-inline" href="../docs/images/photo.jpg" data-caption="Caption 1">
            <img src="../docs/images/photo.jpg" alt="">
        </a>
    </div>
    <div>
        <a class="uk-inline" href="../docs/images/dark.jpg" data-caption="Caption 2">
            <img src="../docs/images/dark.jpg" alt="">
        </a>
    </div>
    <div>
        <a class="uk-inline" href="../docs/images/light.jpg" data-caption="Caption 3">
            <img src="../docs/images/light.jpg" alt="">
        </a>
    </div>
</div>
```

***

## Content sources

A lightbox is not restricted to images. Other media, like videos, can be displayed as well. The video will pause whenever it's not visible and resume once it becomes visible again. To display a poster image for a video, set the `data-poster` attribute.

```html
<div uk-lightbox>
    <a class="uk-button" href="video.mp4" data-poster="image.jpg"></a>
    <a class="uk-button" href="https://www.youtube.com/watch?v=YE7VzlLtp-4"></a>
    <a class="uk-button" href="https://vimeo.com/1084537"></a>
    <a class="uk-button" href="https://www.google.com/maps"></a>
</div>
```

```example
<div uk-lightbox>
    <a class="uk-button uk-button-default" href="../docs/images/photo.jpg" data-caption="Image">Image</a>
    <a class="uk-button uk-button-default" href="//www.quirksmode.org/html5/videos/big_buck_bunny.mp4" data-caption="Video">Video</a>
    <a class="uk-button uk-button-default" href="//www.youtube.com/watch?v=YE7VzlLtp-4" data-caption="YouTube">YouTube</a>
    <a class="uk-button uk-button-default" href="//vimeo.com/1084537" data-caption="Vimeo">Vimeo</a>
    <a class="uk-button uk-button-default" href="//www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4740.819266853735!2d9.99008871708242!3d53.550454675412404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3f9d24afe84a0263!2sRathaus!5e0!3m2!1sde!2sde!4v1499675200938" data-caption="Google Maps" data-type="iframe">Google Maps</a>
</div>
```

***

###  Manual content type

The Lightbox uses the `href` attribute to figure out the type of the linked content. If no filename extension is defined in the path, just add the `data-type` attribute to the `<a>` tag.

TODO You can also set `data-type="video"` when linking to a video. Otherwise, the lightbox will show an iframe by default.

| Option               | Description                            |
|:---------------------|:---------------------------------------|
| `data-type="image"`  | The content type is an image.          |
| `data-type="video"`  | The content type is a video.           |
| `data-type="iframe"` | The content type is a regular website. |

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

### Lightbox

| Option              | Value           | Default | Description                                          |
|:--------------------|:----------------|:--------|:-----------------------------------------------------|
| `animation`         | String          | `slide` | Lightbox animation mode: `slide`, `fade` or `scale`. |
| `autoplay`          | Number          | `0`     | Lightbox autoplays. (Delay in milliseconds)          |
| `autoplay-interval` | Number          | `0`     | The delay between switching slides in autoplay mode. |
| `pause-on-hover`    | Boolean         | false   | Pause autoplay mode on hover.                        |
| `video-autoplay`    | Boolean         | false   | Lightbox videos autoplay.                            |
| `index`             | String, Integer | 0       | Lightbox item to show. 0 based index.                |
| `toggle`            | CSS selector    | `a`     | Toggle selector - opens the Lightbox Panel upon click. |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
// To apply lightbox to a group of links
UIkit.lightbox(element, options);

// To dynamically initialize the lightbox panel
UIkit.lightboxPanel(panelOptions);
```

### Methods

The following methods are available for the component:

#### Show

```js
UIkit.lightbox(element).show(index);
```

Shows the Lightbox's Panel and item.

#### Hide

```js
UIkit.lightbox(element).hide();
```

Hides the Lightbox's Panel.

### Lightbox Panel Options

If you only want to use the lightbox panel directly through the JS API, you can set the following options.

| Option              | Value   | Default        | Description                                                                           |
|:--------------------|:--------|:---------------|:--------------------------------------------------------------------------------------|
| `animation`         | String  | `slide`        | Lightbox animation mode: `slide`, `fade` or `scale`.                                  |
| `autoplay`          | Boolean  | `false`       | Lightbox autoplays.                                          |
| `autoplay-interval` | Number  | `7000`            | The delay between switching slides in autoplay mode.                                  |
| `pause-on-hover`    | Boolean | `false`          | Pause autoplay mode on hover.                                                         |
| `video-autoplay`    | Boolean | `false`          | Lightbox videos autoplay.                                                             |
| `index`             | Number  | `0`            | The initial item to show. (zero based)                                                |
| `velocity`          | Number  | `2`            | The animation velocity (pixel/ms).                                                    |
| `preload`           | Number  | `1`            | The number of items to preload. (left and right of the currently active item)         |
| `items`             | Array   | `[]`           | An array of items to display, e.g. `[{source: 'images/size1.jpg', caption: '900x600'}]` |
| `template`          | String  | Default markup | The template string.                                                                  |
| `delay-controls`    | Number  | `3000`         | Delay time before controls fade out in ms.                                            |

### Events

The following events will be triggered on elements with this component attached:

| Name             | Description                                              |
|:-----------------|:---------------------------------------------------------|
| `beforeshow`     | Fires before the Lightbox is shown.                      |
| `beforehide`     | Fires before the Lightbox is hidden.                     |
| `show`           | Fires after the Lightbox is shown.                       |
| `shown`          | Fires after the Lightbox's show animation has completed. |
| `hide`           | Fires after the Lightbox's hide animation has started.   |
| `hidden`         | Fires after the Lightbox is hidden.                      |
| `itemload`       | Fires when an item loads.                                |
| `beforeitemshow` | Fires before an item is shown.                           |
| `itemshow`       | Fires after an item is shown.                            |
| `itemshown`      | Fires after an item's show animation has completed.      |
| `beforeitemhide` | Fires before an item is hidden.                          |
| `itemhide`       | Fires after an item's hide animation has started.        |
| `itemhidden`     | Fires after an item's hide animation has completed.      |

### Methods

The following methods are available for the component:

#### Show

```js
UIkit.lightboxPanel(element).show(index);
```

Shows the Lightbox Panel and item.

| Name    | Type            | Default | Description                           |
|:--------|:----------------|:--------|:--------------------------------------|
| `index` | String, Integer | 0       | Lightbox item to show. 0 based index. |

#### Hide

```js
UIkit.lightboxPanel(element).hide();
```

Hides the Lightbox Panel.

#### startAutoplay

```js
UIkit.lightboxPanel(element).startAutoplay();
```

Starts the Lightbox's autoplay.

#### stopAutoplay

```js
UIkit.lightboxPanel(element).stopAutoplay();
```

Stops the Lightbox's autoplay.
