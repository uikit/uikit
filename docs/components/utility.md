# Utility

<p class="uk-text-lead">A collection of useful utility classes to style your content.</p>

## Panel

UIkit uses panels to outline certain sections of your content. These can be arranged in grid columns from the [Grid component](grid.md) component, for example.

Add the `.uk-panel` class to a `<div>` element to create a position context, set box-sizing to border-box, apply a clearfix and to remove the bottom margin of its last child element.

```html : uikit
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

```html : uikit
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


```html : uikit
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

```html : uikit
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

```html : uikit
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

```html : uikit
<div class="uk-inline">
    <img src="/uikit/tests/images/photo.jpg" width="300" alt="">
    <div class="uk-position-medium uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle">Overlay</div>
</div>
```

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

```html : uikit
<img class="uk-border-rounded" src="/uikit/tests/images/avatar.jpg" width="200" height="200" alt="Border rounded">
<img class="uk-border-circle" src="/uikit/tests/images/avatar.jpg" width="200" height="200" alt="Border circle">
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

```html : uikit
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

```html : uikit
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

```html : uikit
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

```html : uikit
<p class="uk-dropcap">Dorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
```

***

## Logo

With the new `.uk-logo` class you can easily define your logo, for example within your navbar.

```html
<a class="uk-logo" href=""></a>
```

```html : uikit
<a class="uk-logo" href="#">Logo</a>
```

Add the `.uk-light` class from the [Inverse component](inverse.md) when displaying the image on dark backgrounds, so that its color will automatically be inverted for better visibility.

```html : uikit
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

```html : uikit
<div class="uk-child-width-expand@s" uk-grid>
    <div>
        <div class="uk-panel uk-padding uk-background-muted">
            <a class="uk-logo" href="#">
                <img src="/uikit/docs/images/logo-placeholder.svg" alt="">
                <img class="uk-logo-inverse" src="/uikit/docs/images/logo-placeholder-light.svg" alt="">
            </a>
        </div>
    </div>
    <div>
        <div class="uk-panel uk-padding uk-background-secondary uk-light">
            <a class="uk-logo" href="#">
                <img src="/uikit/docs/images/logo-placeholder.svg" alt="">
                <img class="uk-logo-inverse" src="/uikit/docs/images/logo-placeholder-light.svg" alt="">
            </a>
        </div>
    </div>
</div>
```

**Note** To inject a SVG logo as inline SVG, use the [SVG component](svg.md).

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

```html : uikit
<div class="uk-child-width-1-2 uk-child-width-1-3@s uk-grid-small uk-light" uk-grid>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-multiply" src="/uikit/tests/images/dark.jpg" alt="Blend Multiply">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Multiply</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-screen" src="/uikit/tests/images/dark.jpg" alt="Blend Screen">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Screen</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-overlay" src="/uikit/tests/images/dark.jpg" alt="Blend Overlay">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Overlay</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-darken" src="/uikit/tests/images/dark.jpg" alt="Blend Darken">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Darken</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-lighten" src="/uikit/tests/images/dark.jpg" alt="Blend Lighten">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Lighten</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-color-dodge" src="/uikit/tests/images/dark.jpg" alt="Blend Color Dodge">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Color Dodge</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-color-burn" src="/uikit/tests/images/dark.jpg" alt="Blend Color Burn">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Color Burn</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-hard-light" src="/uikit/tests/images/dark.jpg" alt="Blend Hard Light">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Hard Light</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-soft-light" src="/uikit/tests/images/dark.jpg" alt="Blend Soft Light">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Soft Light</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-difference" src="/uikit/tests/images/dark.jpg" alt="Blend Difference">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Difference</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-exclusion" src="/uikit/tests/images/dark.jpg" alt="Blend Exclusion">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Exclusion</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-hue" src="/uikit/tests/images/dark.jpg" alt="Blend Hue">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Hue</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-saturation" src="/uikit/tests/images/dark.jpg" alt="Blend Saturation">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Saturation</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-color" src="/uikit/tests/images/dark.jpg" alt="Blend Color">
            <div class="uk-position-center">
                <p class="uk-h4 uk-margin-remove">Color</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-inline uk-background-primary">
            <img class="uk-blend-luminosity" src="/uikit/tests/images/dark.jpg" alt="Blend Luminosity">
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

```html : uikit
<div class="uk-inline">
    <img src="/uikit/tests/images/light.jpg" alt="">
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

```html : uikit
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

```html : uikit
<a class="uk-disabled uk-button uk-button-default" href="#">Disabled</a>
```

***

## Drag

To apply a move cursor to elements that are being dragged, add the `.uk-drag` class.

```html
<div class="uk-drag"></div>
```

```html : uikit
<div class="uk-drag uk-width-small uk-padding uk-background-muted uk-text-center">
    <i uk-icon="icon: move; ratio: 2"></i>
</div>
```

To create a box shadow on an [upload area](upload.md) when dragging a file over it, add the `.uk-dragover` class.
