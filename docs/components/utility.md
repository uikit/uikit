# Utility

<p class="uk-text-lead">A collection of useful utility classes to style your content.</p>

## Panel

UIkit uses panels to outline certain sections of your content. These can be arranged in grid columns from the [Grid component](grid.md) component, for example.

Add the `.uk-panel` class to a `<div>` element to create a position context, set box-sizing to border-box, apply a clearfix and to remove the bottom margin of its last child element.

```example
<div class="uk-child-width-1-3@s" uk-grid>
    <div>
        <div class="uk-panel">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-panel">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-panel">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
</div>
```

***

### Scrollable panel

Add the `.uk-panel-scrollable` class to give the panel a fixed height and make it scrollable, if its content exceeds the height. You can also add one of the `.uk-height-*` [classes](#height) to apply a different height.

```example
<div class="uk-panel uk-panel-scrollable">
    <ul class="uk-list">
        <li><label><input class="uk-checkbox" type="checkbox"> Category 1</label></li>
        <li>
            <label><input class="uk-checkbox" type="checkbox"> Category 2</label>
            <ul>
                <li><label><input class="uk-checkbox" type="checkbox"> Category 2.1</label></li>
                <li><label><input class="uk-checkbox" type="checkbox"> Category 2.2</label></li>
                <li>
                    <label><input class="uk-checkbox" type="checkbox"> Category 2.3</label>
                    <ul>
                        <li><label><input class="uk-checkbox" type="checkbox"> Category 2.3.1</label></li>
                        <li><label><input class="uk-checkbox" type="checkbox"> Category 2.3.2</label></li>
                    </ul>
                </li>
                <li><label><input class="uk-checkbox" type="checkbox"> Category 2.4</label></li>
            </ul>
        </li>
        <li><label><input class="uk-checkbox" type="checkbox"> Category 3</label></li>
        <li><label><input class="uk-checkbox" type="checkbox"> Category 4</label></li>
    </ul>

</div>
```

***

## Clearing and floating

Floating elements are taken from the document flow and aligned to the left or right side of their container. It is important to clear floats or in the worst case, you might end up with a scrambled site. The following classes will help you to set up basic layouts.

| Class             | Description                                       |
|:------------------|:--------------------------------------------------|
| `.uk-float-left`  | Add this class to float the element to the left.  |
| `.uk-float-right` | Add this class to float the element to the right. |
| `.uk-clearfix`    | Add this class to a parent container to clear floats. Alternatively, you can create a new block format context, e.g. by adding the `.uk-overflow-hidden` class. |


```example
<div class="uk-clearfix">
    <div class="uk-float-right">
        <div class="uk-card uk-card-default uk-card-body">Right</div>
    </div>
    <div class="uk-float-left">
        <div class="uk-card uk-card-default uk-card-body">Left</div>
    </div>
</div>
```

***

## Overflow

These utilities provide different classes to modify an element's overflow behavior.

| Class                 | Description                               |
|-----------------------|-------------------------------------------|
| `.uk-overflow-hidden` | Add this class to clip content that exceeds the dimensions of its container. |
| `.uk-overflow-auto`   | Add this class to create a container that provides a horizontal or vertical scrollbar whenever the elements inside it are wider or higher than the container itself. |

**Note** The `.uk-overflow-auto` class is useful when having to handle tables on a responsive website, which at some point would just get too big. It also works great on `<pre>` elements.

```example
<div class="uk-overflow-auto uk-height-small">
    <table class="uk-table uk-table-striped uk-table-condensed uk-text-nowrap">
        <thead>
            <tr>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <td>Table Footer</td>
                <td>Table Footer</td>
                <td>Table Footer</td>
                <td>Table Footer</td>
                <td>Table Footer</td>
                <td>Table Footer</td>
                <td>Table Footer</td>
                <td>Table Footer</td>
            </tr>
        </tfoot>
        <tbody>
            <tr>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
            </tr>
            <tr>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
            </tr>
        </tbody>
    </table>
</div>
```

***

## Resize

These utilities provide different classes for resizing elements.

| Class                 | Description                                                |
|:----------------------|:-----------------------------------------------------------|
| `.uk-resize`          | Add this class to enable horizontal and vertical resizing. |
| `.uk-resize-vertical` | Add this class to enable only vertical resizing.           |

<p>Grab and drag the bottom right corner of each box below to resize it</p>

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <pre class="uk-resize-vertical">
            <code>
&lt;!-- Resize vertically --&gt;
&lt;div uk-grid&gt;
    &lt;div class="uk-width-1-2"&gt;...&lt;/div&gt;
    &lt;div class="uk-width-1-2"&gt;...&lt;/div&gt;
&lt;/div&gt;

&lt;div class="uk-child-width-1-2" uk-grid&gt;
    &lt;div&gt;&lt;/div&gt;
    &lt;div&gt;&lt;/div&gt;
&lt;/div&gt;
            </code>
        </pre>
    </div>
    <div>
        <pre class="uk-resize">
            <code>
&lt;!-- Resize horizontally and vertically --&gt;
&lt;div uk-grid&gt;
    &lt;div class="uk-width-1-2"&gt;...&lt;/div&gt;
    &lt;div class="uk-width-1-2"&gt;...&lt;/div&gt;
&lt;/div&gt;

&lt;div class="uk-child-width-1-2" uk-grid&gt;
    &lt;div&gt;&lt;/div&gt;
    &lt;div&gt;&lt;/div&gt;
&lt;/div&gt;
            </code>
        </pre>
    </div>
</div>
```

***

## Display

Add one of these classes to change the display properties of an element.

| Class                      | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `.uk-display-block`        | Forces the element to behave like a block element.         |
| `.uk-display-inline`       | Forces the element to behave like an inline element.       |
| `.uk-display-inline-block` | Forces the element to behave like an inline-block element. |

***

## Inline

These classes are often used to create a position context on containers with an image as a child. The container keeps the same size as the image as well as the responsive behavior. That way content that is placed on top of the image with the [Position component](position.md) will not flow out of the image dimensions.

| Class             | Description                                                                                                            |
|:------------------|:-----------------------------------------------------------------------------------------------------------------------|
| `.uk-inline`      | Add this class to apply inline-block behavior to an element, add a max-width of 100% and to create a position context. |
| `.uk-inline-clip` | Same as `.uk-inline`, it but also clips overflowing child elements.                                                    |

```html
<div class="uk-inline">
    <img alt="">
    <div class="uk-position-cover"></div>
</div>
```

```example
<div class="uk-inline">
    <img src="../docs/images/photo.jpg" width="300" alt="">
    <div class="uk-position-medium uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">Overlay</div>
</div>
```

***

## Height

UIkit provides a number of useful classes to alter a block element's height.

| Class                                             | Description                                                                                   |
|:--------------------------------------------------|:----------------------------------------------------------------------------------------------|
| `.uk-height-1-1`                                  | This class applies a height of 100%. This only works, if the parent element has a set height. |
| `.uk-height-small `<br> `.uk-height-max-small `   | These classes apply a height or max-height of _150px_.                                        |
| `.uk-height-medium `<br> `.uk-height-max-medium ` | These classes apply a height or max-height of _300px_.                                        |
| `.uk-height-large `<br> `.uk-height-max-large `   | These classes apply a height or max-height of _450px_.                                        |

```html
<div class="uk-height-small"></div>
```

```example
<div class="uk-child-width-1-3@s" uk-grid>
    <div>
        <div class="uk-height-small uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle">Small</div>
    </div>
    <div>
        <div class="uk-height-medium uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle">Medium</div>
    </div>
    <div>
        <div class="uk-height-large uk-card uk-card-default uk-card-body uk-flex uk-flex-center uk-flex-middle">Large</div>
    </div>
</div>
```

***

### Viewport height

Add the `uk-height-viewport` attribute to create a container that fills the height of the entire viewport. You can change the height behavior by adding the `offset-top`, `offset-bottom` or `expand` option to the attribute. [Learn more](javascript.md#component-configuration)

| Option          | Value                  | Default | Description                                                                         |
|:----------------|:-----------------------|:--------|:------------------------------------------------------------------------------------|
| `offset-top`    | Boolean                | `false` | Subtracts the element's top offset from its height.                                 |
| `offset-bottom` | Boolean, Number, Pixel | `false` | Subtracts the element's immediately following sibling's height (true), the given percentage (Number), Pixel (px) value from its own height or the given element's height. |
| `expand`        | Boolean                | `true`  | Expand the element's height to make a short page fill the viewport.                 |
| `min-height`    | Number                 | `0`     | Sets a minimum height. Useful if all children are positioned absolute.          |

```html
<div uk-height-viewport></div>

<div uk-height-viewport="offset-top: true"></div>

<div uk-height-viewport="offset-bottom: 20"></div>

<div uk-height-viewport="expand: true"></div>

<div uk-height-viewport="min-height: 300"></div>
```

You can view examples in the tests for [Height Viewport](../assets/uikit/tests/height-viewport.html) and [Height Expand](../assets/uikit/tests/height-expand.html).

***

## Match height

To expand all children of a container to the same height, regardless of their content – for example, inside a grid – add the `uk-height-match` attribute. You can change the height matching behavior by setting the `target` or `row` option to the attribute. [Learn more](javascript.md#component-configuration)

| Option   | Value   | Default | Description                 |
|:---------|:--------|:--------|:----------------------------|
| `target` | String  | `> *`   | Elements that should match. |
| `row`    | Boolean | `true`  | By default only items in the same row will be matched. For example, once grid columns extend to a width of 100%, their heights will no longer be matched. This makes sense, for example, if they stack vertically in narrower viewports. |

```html
<div uk-height-match>
    <div></div>
    <div></div>
</div>
```

`target` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

```html
<span uk-height-match=".my-class"></span>
```

***

### Match cards

You can also target and match specific elements inside the container, like cards. Just add the `target: SELECTOR` option to the attribute.

```html
<div uk-grid uk-height-match="target: SELECTOR">...</div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid uk-height-match="target: > div > .uk-card">
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
</div>
```

***

### Match all

If your grid wraps into multiple rows, only grid columns within the same row are matched. To match grid columns across all rows just add the `row: false` option to the attribute.

```html
<div uk-grid uk-height-match="row: false">...</div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid uk-height-match="target: > div > .uk-card; row: false">
    <div class="uk-first-column">
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
    <div class="uk-grid-margin uk-first-column">
        <div class="uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
    </div>
    <div class="uk-grid-margin">
        <div class="uk-card uk-card-default uk-card-body">Lorem Ipsum</div>
    </div>
</div>
```

***

### Component options

The table below lists the available settings of the `uk-height-match` attribute. [Learn more](javascript.md#component-configuration)

| Option   | Value        | Default | Description                                                                                 |
|:---------|:-------------|:--------|:--------------------------------------------------------------------------------------------|
| `target` | CSS selector | `false` | Elements that should match. By default, direct children will match.                         |
| `row`    | Boolean      | `true`  | If your targets wrap into multiple rows, only grid columns within the same row are matched. |

***

## Responsive objects

In UIkit `<img>`, `<canvas>`, `<audio>` and `<video>` elements adapt to the width of their parent container by default. To apply responsive behavior to iframes, add the `uk-responsive` attribute . For other elements or to apply a different behavior, just add one of the following classes.

| Class                   | Description |
|:------------------------|:------------|
| `.uk-responsive-width`  | Add this class to apply the same responsive behavior to any other element. It adjusts the object's width according to its parent's width, keeping the original aspect ratio.   |
| `.uk-responsive-height` | Add this class to adjust the object's height (instead of its width) according to its parent's height, keeping the original aspect ratio. |
| `.uk-preserve-width`    | Add this class to avoid the default responsive behavior and preserve the original image dimensions. You can also add the class to a parent element and it will be applied to all relevant elements inside it. If you are embedding Google Maps into your site, you may need this to fix the map's images.      |

```html
<img class="uk-responsive-height" src="" alt="">

<iframe src="" width="" height="" frameborder="0" uk-responsive></iframe>
```

***

## Border radius

To modify the border radius of an element, like an image, add one of the following classes.

| Class                | Description                                |
|:---------------------|:-------------------------------------------|
| `.uk-border-rounded` | Add this class to apply rounded corners.   |
| `.uk-border-circle`  | Add this class to a apply a circled shape. |

```example
<img class="uk-border-rounded" src="images/avatar.jpg" width="200" height="200" alt="Border rounded">
<img class="uk-border-circle" src="images/avatar.jpg" width="200" height="200" alt="Border circle">
```

***

## Box shadow

You can apply different box shadows to elements. Just add one of the following classes.

| Class                   | Description                                      |
|:------------------------|:-------------------------------------------------|
| `.uk-box-shadow-small`  | Add this class to apply a small box shadow.      |
| `.uk-box-shadow-medium` | Add this class to apply a medium box shadow.     |
| `.uk-box-shadow-large`  | Add this class to apply a large box shadow.      |
| `.uk-box-shadow-xlarge` | Add this class to apply a very large box shadow. |

```html
<div class="uk-box-shadow-small"></div>
```

```example
<div class="uk-child-width-1-2@s uk-text-center" uk-grid>
    <div>
        <div class="uk-box-shadow-small uk-padding">Small</div>
    </div>

    <div>
        <div class="uk-box-shadow-medium uk-padding">Medium</div>
    </div>

    <div>
        <div class="uk-box-shadow-large uk-padding">Large</div>
    </div>

    <div>
        <div class="uk-box-shadow-xlarge uk-padding">X-Large</div>
    </div>
</div>
```

***

## Box shadow bottom

To apply a box shadow at the bottom of an element so that appears to be hovering, add the `.uk-box-shadow-bottom` class. This can also be combined with one of the other `.uk-box-shadow-*` modifiers.

```html
<div class="uk-box-shadow-bottom"></div>
```

```example
<div class="uk-box-shadow-bottom uk-box-shadow-small uk-width-1-2@s uk-text-center">
    <div class="uk-background-default uk-padding-large">
        Box shadow bottom
    </div>
</div>
```

***

### Hover

To apply a box shadow on hover, add one of the following classes. This can also be used to modify the shadow size on hover. To do so, just combine them with one of the classes above.

| Class                         | Description                                               |
|:------------------------------|:----------------------------------------------------------|
| `.uk-box-shadow-hover-small`  | Add this class to apply a small box shadow on hover.      |
| `.uk-box-shadow-hover-medium` | Add this class to apply a medium box shadow on hover.     |
| `.uk-box-shadow-hover-large`  | Add this class to apply a large box shadow on hover.      |
| `.uk-box-shadow-hover-xlarge` | Add this class to apply a very large box shadow on hover. |

```html
<div class="uk-box-shadow-hover-small"></div>
```

```example
<div class="uk-child-width-1-2@s uk-text-center" uk-grid>
    <div>
        <div class="uk-box-shadow-hover-small uk-padding">Hover Small</div>
    </div>

    <div>
        <div class="uk-box-shadow-hover-xlarge uk-padding">Hover X-Large</div>
    </div>

    <div>
        <div class="uk-box-shadow-small uk-box-shadow-hover-large uk-padding">Small + Hover Large</div>
    </div>

    <div>
        <div class="uk-box-shadow-xlarge uk-box-shadow-hover-medium uk-padding">X-Large + Hover Medium</div>
    </div>
</div>
```

***

## Drop cap

With the `.uk-dropcap` class you can achieve a drop cap within a text by adding it directly to the `<p>` element.

```example
<p class="uk-dropcap">Dorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
```

***

## Leader

To visually connect horizontal items add the `uk-leader` attribute to the element on the left. A line of characters, for example dots, will then fill the remaining space between the item and its adjacent element. This can be useful when creating elements like a pricing list or a table of contents.

```html
<div uk-leader></div>
```

```example
<div class="uk-grid-small" uk-grid>
    <div class="uk-width-expand" uk-leader>Lorem ipsum dolor sit amet</div>
    <div>$20.90</div>
</div>
```

***

### Component options

The table below lists the available settings of the `uk-leader` attribute. [Learn more](javascript.md#component-configuration)

| Option  | Value  | Default     | Description                                                                                             |
|:--------|:-------|:------------|:--------------------------------------------------------------------------------------------------------|
| `fill`  | String | `undefined` | Optional fill character.                                                                                |
| `media` | Integer, String | `false`     | Condition for the space filling - a width as integer (e.g. 640) or a breakpoint (e.g. @s, @m, @l, @xl) or any valid media query (e.g. (min-width: 900px)). |

***

## Logo

With the new `.uk-logo` class you can easily define your logo, for example within your navbar.

```html
<a class="uk-logo" href=""></a>
```

```example
<a class="uk-logo" href="#">Logo</a>
```

Add the `.uk-light` class from the [Inverse component](inverse.md) when displaying the image on dark backgrounds, so that its color will automatically be inverted for better visibility.

```example
<div class="uk-panel uk-padding uk-background-secondary uk-light">
    <a class="uk-logo" href="#">Logo</a>
</div>
```

***

### Logo image

You can also use an `<img>` element, for example an SVG, as a logo.

```html
<a class="uk-logo" href="">
    <img src="" alt="">
</a>
```

You can even automatically display alternative logos for light and dark backgrounds by using the [Inverse component](inverse.md). Just add the `.uk-logo-inverse` class to a second logo image. Depending on the color mode, the inverted logo will be displayed when the `.uk-light` or `.uk-dark` class is applied to the parent element.

```html
<div class="uk-light">
    <a class="uk-logo" href="">
        <img src="" alt="">
        <img class="uk-logo-inverse" src="" alt="">
    </a>
</div>
```

```example
<div class="uk-child-width-expand@s" uk-grid>
    <div>
        <div class="uk-panel uk-padding uk-background-muted">
            <a class="uk-logo" href="#">
                <img src="../docs/images/logo-placeholder.svg" alt="">
                <img class="uk-logo-inverse" src="../docs/images/logo-placeholder-light.svg" alt="">
            </a>
        </div>
    </div>
    <div>
        <div class="uk-panel uk-padding uk-background-secondary uk-light">
            <a class="uk-logo" href="#">
                <img src="../docs/images/logo-placeholder.svg" alt="">
                <img class="uk-logo-inverse" src="../docs/images/logo-placeholder-light.svg" alt="">
            </a>
        </div>
    </div>
</div>
```

***

## Inline SVG

SVGs or Scaleable Vector Graphics are really handy, for example to display a logo that remains crisp when scaling or that is animated. To be able to control your SVG via CSS, just add the `uk-svg` attribute to the image element. This will inject your image into the markup as inline SVG including all attributes, like IDs, classes, width and height, which you can now easily target using CSS.

```html
<img src="" uk-svg>
```

Using the `uk-svg` attribute also allows you to inject a symbol from the SVG file. Just append the symbol's ID to the image path as you would in any fragmented URL.

```example
<!-- Targets the SVG image -->
<img src="../assets/uikit/src/images/icons/cloud-download.svg" width="40" height="40" uk-svg>

<!-- Targets a symbol inside the SVG image -->
<img src="../assets/uikit/tests/images/icons.svg#cloud-upload" width="40" height="40" uk-svg>
```

SVGs will adapt the current color for their stroke and fill color. To prevent this behavior,  you can add the `uk-preserve` class to the SVG itself or to elements inside the SVG.

***

## Gif

To start playing an animated Gif only when it comes into the viewport, add the `uk-gif` attribute. That way a user will see the animation right when he is supposed to.

```html
<img src="" alt="" uk-gif>
```

```example
<img src="../docs/images/animated.gif" alt="" uk-gif>
```

***

## Video

The `uk-video` component offers two advanced functionalities for videos. First, it allows to pause a video whenever it's hidden with CSS and resume once it becomes visible again. In addition the video can also pause when it's not in the vieport and start playing when entering the viewport again. Second, it allows to mute YouTube and Vimeo videos which is often needed if they are used as a background of a section. For example the [Slideshow](slideshow.md#videos), [Lightbox](lightbox.md#content-sources) and [Cover](cover.md#video) components inherit and make use of both functionalities.

To apply this component, add the `uk-video` attribute with its options.


```html
<video uk-video></div>
```

```example
<div class="uk-grid uk-child-width-1-2@s">
    <div>

        <button class="uk-button uk-button-default uk-margin" type="button" uk-toggle="target: +">Toggle HTML5 Video</button>
        <video controls playsinline uk-video="automute: true">
            <source src="//www.quirksmode.org/html5/videos/big_buck_bunny.mp4" type="video/mp4">
            <source src="//www.quirksmode.org/html5/videos/big_buck_bunny.ogv" type="video/ogg">
        </video>

    </div>
    <div>

        <button class="uk-button uk-button-default uk-margin-bottom" type="button" uk-toggle="target: +">Toggle Youtube Video</button>
        <iframe src="//www.youtube.com/embed/YE7VzlLtp-4?autoplay=0&amp;showinfo=0&amp;rel=0&amp;modestbranding=1&amp;playsinline=1" width="560" height="315" frameborder="0" allowfullscreen uk-responsive uk-video="automute: true"></iframe>

    </div>
</div>
```

***

### Component options

The table below lists the available settings of the `uk-video` attribute. [Learn more](javascript.md#component-configuration)

| Option     | Value           | Default | Description                      |
|:-----------|:----------------|:--------|:---------------------------------|
| `autoplay` | Boolean, String | `true`  | The video automatically plays/pauses as it's visible/hidden on the page. A value of `inview` play/pause the video as it enters/leaves the viewport. |
| `automute` | Boolean         | `false` | Automatically mute YouTube or Vimeo videos.    |

`autoplay` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

***

## Blend modes

Add one of the following classes to apply different blend modes to your backgrounds, for example when placing them on images. You can combine these with the [Overlay component](overlay.md). For a better understanding of how background blend modes work, take a look at this [CSS Tricks article](https://css-tricks.com/almanac/properties/b/background-blend-mode/).


| Class                   | Description                                    |
|:------------------------|:-----------------------------------------------|
| `.uk-blend-multiply`    | This class sets the blend mode to multiply.    |
| `.uk-blend-screen`      | This class sets the blend mode to screen.      |
| `.uk-blend-overlay`     | This class sets the blend mode to overlay.     |
| `.uk-blend-darken`      | This class sets the blend mode to darken.      |
| `.uk-blend-lighten`     | This class sets the blend mode to lighten.     |
| `.uk-blend-color-dodge` | This class sets the blend mode to color dodge. |
| `.uk-blend-color-burn`  | This class sets the blend mode to color burn.  |
| `.uk-blend-hard-light`  | This class sets the blend mode to hard light.  |
| `.uk-blend-soft-light`  | This class sets the blend mode to soft light.  |
| `.uk-blend-difference`  | This class sets the blend mode to difference.  |
| `.uk-blend-exclusion`   | This class sets the blend mode to exclusion.   |
| `.uk-blend-hue`         | This class sets the blend mode to hue.         |
| `.uk-blend-saturation`  | This class sets the blend mode to saturation.  |
| `.uk-blend-color`       | This class sets the blend mode to color.       |
| `.uk-blend-luminosity`  | This class sets the blend mode to luminosity.  |

```html
<div class="uk-position-relative">
    <div class="uk-blend-multiply uk-overlay uk-overlay-primary"></div>
    <img src="" alt="">
</div>
```

```example
<div class="uk-child-width-1-2 uk-child-width-1-3@s uk-grid-small uk-light" uk-grid>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-multiply" src="images/dark.jpg" alt="Blend Multiply">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Multiply</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-screen" src="images/dark.jpg" alt="Blend Screen">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Screen</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-overlay" src="images/dark.jpg" alt="Blend Overlay">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Overlay</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-darken" src="images/dark.jpg" alt="Blend Darken">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Darken</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-lighten" src="images/dark.jpg" alt="Blend Lighten">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Lighten</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-color-dodge" src="images/dark.jpg" alt="Blend Color Dodge">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Color Dodge</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-color-burn" src="images/dark.jpg" alt="Blend Color Burn">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Color Burn</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-hard-light" src="images/dark.jpg" alt="Blend Hard Light">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Hard Light</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-soft-light" src="images/dark.jpg" alt="Blend Soft Light">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Soft Light</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-difference" src="images/dark.jpg" alt="Blend Difference">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Difference</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-exclusion" src="images/dark.jpg" alt="Blend Exclusion">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Exclusion</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-hue" src="images/dark.jpg" alt="Blend Hue">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Hue</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-saturation" src="images/dark.jpg" alt="Blend Saturation">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Saturation</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-color" src="images/dark.jpg" alt="Blend Color">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Color</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-luminosity" src="images/dark.jpg" alt="Blend Luminosity">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Luminosity</p>
            </div>
        </div>
    </div>
</div>
```

***

## Transform center

To center an element to itself, add the `uk-transform-center` class. This is particularly useful for absolute positioning.

```example
<div class="uk-inline">
    <img src="images/light.jpg" alt="">
    <a class="uk-position-absolute uk-transform-center" style="left: 50%; top: 50%" href="#" uk-marker></a>
</div>
```

***

## Transform origin

To modify the origin of an animation, like scaling, add one of the `uk-transform-origin-*` classes. This can be combined with the [Animation component](animation.md).

| Class                                | Description                                      |
|:-------------------------------------|:-------------------------------------------------|
| `.uk-transform-origin-top-left`      | The transition originates from the top left.     |
| `.uk-transform-origin-top-center`    | The transition originates from the top.          |
| `.uk-transform-origin-top-right`     | The transition originates from the top right.    |
| `.uk-transform-origin-center-left`   | The transition originates from the left.         |
| `.uk-transform-origin-center-right`  | The transition originates from the right.        |
| `.uk-transform-origin-bottom-left`   | The transition originates from the bottom left.  |
| `.uk-transform-origin-bottom-center` | The transition originates from the bottom.       |
| `.uk-transform-origin-bottom-right`  | The transition originates from the bottom right. |

```html
<div class="uk-transform-origin-bottom-right uk-animation-scale-up"></div>
```

```example
<div class="uk-child-width-1-3@m" uk-grid>
    <div class="uk-animation-toggle">
        <div class="uk-transform-origin-bottom-right uk-card uk-card-default uk-card-body uk-animation-scale-up">
            <p class="uk-text-center">Bottom Right</p>
        </div>
    </div>
    <div class="uk-animation-toggle">
        <div class="uk-transform-origin-top-center uk-card uk-card-default uk-card-body uk-animation-scale-up">
            <p class="uk-text-center">Top Center</p>
        </div>
    </div>
    <div class="uk-animation-toggle">
        <div class="uk-transform-origin-bottom-center uk-card uk-card-default uk-card-body uk-animation-scale-up">
            <p class="uk-text-center">Bottom Center</p>
        </div>
    </div>
</div>
```

***

## Disabled

To disable the click behavior of any element, like a `<a>`, `<button>` or `<iframe>` element, add the `.uk-disabled` class.

```example
<a class="uk-disabled uk-button uk-button-default" href="#">Disabled</a>
```

***

## Drag

To apply a move cursor to elements that are being dragged, add the `.uk-drag` class.

```html
<div class="uk-drag"></div>
```

```example
<div class="uk-drag uk-width-small uk-padding uk-background-muted uk-text-center">
    <i uk-icon="icon: move; ratio: 2"></i>
</div>
```

To create a box shadow on an [upload area](upload.md) when dragging a file over it, add the `.uk-dragover` class.
