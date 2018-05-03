# Background

<p class="uk-text-lead">A collection of utility classes to add different backgrounds to elements.</p>

## Usage

To apply a background color to an element, add one of the following classes. The actual color for each modifier is defined by the UIkit style that you have chosen or customized.

| Class                      | Description                           |
|:---------------------------|:--------------------------------------|
| `.uk-background-default`   | Applies the default background color. |
| `.uk-background-muted`     | Applies a muted background color.     |
| `.uk-background-primary`   | Applies the primary background color. |
| `.uk-background-secondary` | Applies a secondary background color. |

```html
<div class="uk-background-primary"></div>
```

**Note** To adapt your content for better visibility on each background, add the `.uk-light` or `.uk-dark` class from the [Inverse component](inverse.md). Use the [Padding component](padding.md) to add some padding to the elements.

```example
<div class="uk-child-width-1-2@s uk-text-center" uk-grid>
    <div>
        <div class="uk-background-default uk-padding uk-panel">
            <p class="uk-h4">Default</p>
        </div>
    </div>
    <div>
        <div class="uk-background-muted uk-padding uk-panel">
            <p class="uk-h4">Muted</p>
        </div>
    </div>
    <div>
        <div class="uk-background-primary uk-light uk-padding uk-panel">
            <p class="uk-h4">Primary</p>
        </div>
    </div>
    <div>
        <div class="uk-background-secondary uk-light uk-padding uk-panel">
            <p class="uk-h4">Secondary</p>
        </div>
    </div>
</div>
```

***

## Size modifiers

This component features classes to specify the size of background images by keeping its intrinsic ratio.

| Class                    | Description                                                                                    |
|:-------------------------|:-----------------------------------------------------------------------------------------------|
| `.uk-background-cover`   | Scales the background image to completely cover the containing area.                           |
| `.uk-background-contain` | Scales the background image as far as its width and height can fit inside the containing area. |

**Note** When using these classes, the background position automatically shifts to the middle and background-repeat is set to no-repeat.

```html
<div class="uk-background-cover"></div>
```

```example
<div class="uk-child-width-1-2@s uk-light" uk-grid>
    <div>
        <div class="uk-background-cover uk-height-medium uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/dark.jpg);">
            <p class="uk-h4">Cover</p>
        </div>
    </div>
    <div>
        <div class="uk-background-contain uk-background-muted uk-height-medium uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/dark.jpg);">
            <p class="uk-h4">Contain</p>
        </div>
    </div>
</div>
```

***

## Position modifiers

To alter the background position of your image — which is in the top left hand corner of the area by default, add one of the following classes.

| Class                          | Description                                                           |
|:-------------------------------|:----------------------------------------------------------------------|
| `.uk-background-top-left`      | The initial position of the image is in the top left hand corner.     |
| `.uk-background-top-center`    | The initial position of the image is at the top.                      |
| `.uk-background-top-right`     | The initial position of the image is in the top right hand corner.    |
| `.uk-background-center-left`   | The initial position of the image is on the left.                     |
| `.uk-background-center-center` | The initial position of the image is in the middle.                   |
| `.uk-background-center-right`  | The initial position of the image is on the right.                    |
| `.uk-background-bottom-left`   | The initial position of the image is in the bottom left hand corner.  |
| `.uk-background-bottom-center` | The initial position of the image is at the bottom.                   |
| `.uk-background-bottom-right`  | The initial position of the image is in the bottom right hand corner. |

```html
<div class="uk-background-top-left"></div>
```

```example
<div class="uk-child-width-1-2@s uk-light" uk-grid>
    <div>
        <div class="uk-background-top-right uk-background-cover uk-height-medium uk-panel uk-flex uk-flex-middle uk-flex-center" style="background-image: url(../docs/images/dark.jpg);">
            <p class="uk-h4">Top Right</p>
        </div>
    </div>
    <div>
        <div class="uk-background-top-left uk-background-cover uk-height-medium uk-panel uk-flex uk-flex-middle uk-flex-center" style="background-image: url(../docs/images/dark.jpg);">
            <p class="uk-h4">Top Left</p>
        </div>
    </div>
</div>
```

***

## No repeat

To keep smaller images from repeating to fill the background area, add the `.uk-background-norepeat` class.

```html
<div class="uk-background-norepeat"></div>
```

***

## Attachment

You can also apply a fixed background attachment, so that the image remains in its position while scrolling the site.

```html
<div class="uk-background-fixed"></div>
```

```example
<div class="uk-background-fixed uk-background-center-center uk-height-medium uk-width-large" style="background-image: url(../docs/images/dark.jpg);"></div>
```

***

## Responsive

Add one of the following classes to limit the display of background images to certain viewport sizes. This is great in cases where the image and content overlap on a phone screen in a way that would make text illegible.

| Class                     | Description                                                            |
|:--------------------------|:-----------------------------------------------------------------------|
| `.uk-background-image@s`  | Displays the background image on device widths of _640px_ and larger.  |
| `.uk-background-image@m`  | Displays the background image on device widths of _960px_ and larger.  |
| `.uk-background-image@l`  | Displays the background image on device widths of _1200px_ and larger. |
| `.uk-background-image@xl` | Displays the background image on device widths of _1600px_ and larger. |

```html
<div class="uk-background-image@m"></div>
```

Resize your browser window to see the effect in the example below.

```example
<div class="uk-background-image@m uk-background-cover uk-background-muted uk-height-medium uk-width-large uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/dark.jpg);">
    <p class="uk-h4 uk-margin-remove uk-visible@m uk-light">Image shown</p>
    <p class="uk-h4 uk-margin-remove uk-hidden@m">Image not shown</p>
</div>
```

***

## Blend modes

Add one of the following classes to apply different blend modes to your background image. You can combine these with the background color classes, as well. For a better understanding of how background blend modes work, take a look at this [CSS Tricks article](https://css-tricks.com/almanac/properties/b/background-blend-mode/).


| Class                              | Description                                    |
|:-----------------------------------|:-----------------------------------------------|
| `.uk-background-blend-multiply`    | This class sets the blend mode to multiply.    |
| `.uk-background-blend-screen`      | This class sets the blend mode to screen.      |
| `.uk-background-blend-overlay`     | This class sets the blend mode to overlay.     |
| `.uk-background-blend-darken`      | This class sets the blend mode to darken.      |
| `.uk-background-blend-lighten`     | This class sets the blend mode to lighten.     |
| `.uk-background-blend-color-dodge` | This class sets the blend mode to color dodge. |
| `.uk-background-blend-color-burn`  | This class sets the blend mode to color burn.  |
| `.uk-background-blend-hard-light`  | This class sets the blend mode to hard light.  |
| `.uk-background-blend-soft-light`  | This class sets the blend mode to soft light.  |
| `.uk-background-blend-difference`  | This class sets the blend mode to difference.  |
| `.uk-background-blend-exclusion`   | This class sets the blend mode to exclusion.   |
| `.uk-background-blend-hue`         | This class sets the blend mode to hue.         |
| `.uk-background-blend-saturation`  | This class sets the blend mode to saturation.  |
| `.uk-background-blend-color`       | This class sets the blend mode to color.       |
| `.uk-background-blend-luminosity`  | This class sets the blend mode to luminosity.  |

```html
<div class="uk-background-blend-multiply uk-background-primary"></div>
```

```example
<div class="uk-child-width-1-2 uk-child-width-1-3@s uk-grid-small uk-light" uk-grid>
    <div>
        <div class="uk-background-blend-multiply uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Multiply</p>
       </div>
    </div>
    <div>
        <div class="uk-background-blend-screen uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Screen</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-overlay uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Overlay</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-darken uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Darken</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-lighten uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Lighten</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-color-dodge uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Color Dodge</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-color-burn uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Color Burn</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-hard-light uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Hard Light</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-soft-light uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Soft Light</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-difference uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Difference</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-exclusion uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Exclusion</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-hue uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Hue</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-saturation uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Saturation</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-color uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Color</p>
        </div>
    </div>
    <div>
        <div class="uk-background-blend-luminosity uk-background-primary uk-background-cover uk-height-small uk-panel uk-flex uk-flex-center uk-flex-middle" style="background-image: url(../docs/images/photo.jpg);">
            <p class="uk-h4">Luminosity</p>
        </div>
    </div>
</div>
```
