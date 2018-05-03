# Cover

<p class="uk-text-lead">Expand images, videos or iframes to cover their entire container and place your own content on top.</p>

## Usage

To have an image cover its parent element, add the `.uk-cover-container` class to the parent and the `uk-cover` attribute to the image.

```html
<div class="uk-cover-container">
    <img src="" alt="" uk-cover>
</div>
```

**Note** To position content on top of the covering element, use the [Position component](position.md). To adapt your content for better visibility, add the `.uk-light` or `.uk-dark` class from the [Inverse component](inverse.md).

```example
<div class="uk-cover-container uk-height-medium">
    <img src="../docs/images/dark.jpg" alt="" uk-cover>
</div>
```

***

## Video

To create a video that covers its parent container, add the `uk-cover` attribute to a video. Wrap a container element around the video and add the `.uk-cover-container` class to clip the content.

The Cover component inherits all properties from the [Video component](utility.md#video) which means videos are muted and play automatically. The video will pause whenever it's not visible and resume once it becomes visible again.

```html
<div class="uk-cover-container">
    <video uk-cover></video>
</div>
```

```example
<div class="uk-cover-container uk-height-medium">
    <video autoplay loop muted playsinline uk-cover>
        <source src="//www.quirksmode.org/html5/videos/big_buck_bunny.mp4" type="video/mp4">
        <source src="//www.quirksmode.org/html5/videos/big_buck_bunny.ogv" type="video/ogg">
    </video>
</div>
```

***

## Iframe

To apply the Cover component to an iframe, you need to add the `uk-cover` attribute to the iframe. Now add the `.uk-cover-container` class to a container element around the iframe to clip the content.

```html
<div class="uk-cover-container">
    <iframe src="" uk-cover></iframe>
</div>
```

```example
<div class="uk-cover-container uk-height-medium">
    <iframe src="//www.youtube.com/embed/YE7VzlLtp-4?autoplay=1&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;loop=1&amp;modestbranding=1&amp;wmode=transparent" width="560" height="315" frameborder="0" allowfullscreen uk-cover></iframe>
</div>
```

***

## Responsive height

To add responsive behavior to your cover image, you need to create an invisible `<canvas>` element and assign `width` and `height` values to it, according to the aspect ratio you want the covered area to have. That way it will adapt the responsive behavior of the image.

```html
<div class="uk-cover-container">
    <canvas width="" height=""></canvas>
    <img src="" alt="" uk-cover>
</div>
```

```example
<div class="uk-cover-container">
    <canvas width="400" height="200"></canvas>
    <img src="../docs/images/dark.jpg" alt="" uk-cover>
</div>
```

***

## Viewport height

Adding the `uk-height-viewport` attribute from the [Utility component](utility.md) will stretch the height of the parent element to fill the whole viewport.

```html
<div class="uk-cover-container" uk-height-viewport>
    <img src="" alt="" uk-cover>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option     | Value   | Default   | Description                           |
|:-----------|:--------|:----------|:--------------------------------------|
| `automute` | Boolean | true      | Tries to automute the iframe's video. |
| `width`    | Number  | undefined | The element's width.                  |
| `height`   | Number  | undefined | The element's height.                 |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.cover(element, options);
```
