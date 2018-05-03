# Card

<p class="uk-text-lead">Create layout boxes with different styles.</p>

## Usage

The Card component consists of the card itself, the card body and an optional card title. Typically, cards are arranged in grid columns from the [Grid component](grid.md).

| Class            | Description                                                                    |
|:-----------------|:-------------------------------------------------------------------------------|
| `.uk-card`       | Add this class to a `<div>` element to define the Card component.              |
| `.uk-card-body`  | Add this class to the card to create padding between the card and its content. |
| `.uk-card-title` | Add this class to a heading to define a card title.                            |

```html
<div class="uk-card uk-card-body">
    <h3 class="uk-card-title"></h3>
</div>
```

By default, a card is blank. That is why it is important to add a modifier class for styling. In our example we are using the `.uk-card-default` class.

```example
<div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <h3 class="uk-card-title">Default</h3>
    <p>Lorem ipsum <a href="#">dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</div>
```

***

## Style modifiers

UIkit includes a number of modifiers that can be used to add a specific style to cards.

| Class                | Description                                                                 |
|:---------------------|:----------------------------------------------------------------------------|
| `.uk-card-default`   | Add this class to create a visually styled box.                             |
| `.uk-card-primary`   | Add this class to modify the card and emphasize it with a primary color.    |
| `.uk-card-secondary` | Add this class to modify the card and give it a secondary background color. |

```html
<div class="uk-card uk-card-default"></div>

<div class="uk-card uk-card-primary"></div>

<div class="uk-card uk-card-secondary"></div>
```

```example
<div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Default</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-primary uk-card-body">
            <h3 class="uk-card-title">Primary</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-secondary uk-card-body">
            <h3 class="uk-card-title">Secondary</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
</div>
```

***

## Hover modifier

To create a hover effect on the card, add the `.uk-card-hover` class. This comes in handy when working with anchors and can be combined with the other card modifiers.

```html
<div class="uk-card uk-card-hover"></div>
```

```example
<div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
    <div>
        <div class="uk-card uk-card-hover uk-card-body">
            <h3 class="uk-card-title">Hover</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-hover uk-card-body">
            <h3 class="uk-card-title">Default</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-primary uk-card-hover uk-card-body uk-light">
            <h3 class="uk-card-title">Primary</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-secondary uk-card-hover uk-card-body uk-light">
            <h3 class="uk-card-title">Secondary</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
</div>
```

***

## Size modifiers

You can apply different size modifiers to cards that will decrease or increase their padding.

| Class            | Description                                |
|:-----------------|:-------------------------------------------|
| `.uk-card-small` | Add this class to apply a smaller padding. |
| `.uk-card-large` | Add this class to apply a larger padding.  |

```html
<div class="uk-card uk-card-small uk-card-default"></div>

<div class="uk-card uk-card-large uk-card-default"></div>
```

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-small uk-card-body">
            <h3 class="uk-card-title">Small</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-large uk-card-body">
            <h3 class="uk-card-title">Large</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </div>
</div>
```

***

## Header & footer

You can also divide a card into header and footer — around the default body. Just add the `.uk-card-header` or `.uk-card-footer` class to a `<div>` element inside the card.

```html
<div class="uk-card">
    <div class="uk-card-header">
        <h3 class="uk-card-title"></h3>
    </div>
    <div class="uk-card-body"></div>
    <div class="uk-card-footer"></div>
</div>
```

```example
<div class="uk-card uk-card-default uk-width-1-2@m">
    <div class="uk-card-header">
        <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
                <img class="uk-border-circle" width="40" height="40" src="../docs/images/avatar.jpg">
            </div>
            <div class="uk-width-expand">
                <h3 class="uk-card-title uk-margin-remove-bottom">Title</h3>
                <p class="uk-text-meta uk-margin-remove-top"><time datetime="2016-04-01T19:00">April 01, 2016</time></p>
            </div>
        </div>
    </div>
    <div class="uk-card-body">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
    </div>
    <div class="uk-card-footer">
        <a href="#" class="uk-button uk-button-text">Read more</a>
    </div>
</div>
```

***

## Media

To display an image inside a card without any spacing, add one of the following classes to a `<div>` around the `<img>` element. Mind that you need to modify the source order accordingly.

| Class                   | Description                                                           |
|:------------------------|:----------------------------------------------------------------------|
| `.uk-card-media-top`    | This class indicates that the media element is aligned to the top.    |
| `.uk-card-media-bottom` | This class indicates that the media element is aligned to the bottom. |
| `.uk-card-media-left`   | This class indicates that the media element is aligned to the left.   |
| `.uk-card-media-right`  | This class indicates that the media element is aligned to the right.  |

```html
<div class="uk-card uk-card-default">
    <div class="uk-card-media-top">
        <img src="" alt="">
    </div>
    <div class="uk-card-body"></div>
</div>
```

```example
<div class="uk-child-width-1-2@m" uk-grid>
    <div>
        <div class="uk-card uk-card-default">
            <div class="uk-card-media-top">
                <img src="../docs/images/light.jpg" alt="">
            </div>
            <div class="uk-card-body">
                <h3 class="uk-card-title">Media Top</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default">
            <div class="uk-card-body">
                <h3 class="uk-card-title">Media Bottom</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
            </div>
            <div class="uk-card-media-bottom">
                <img src="../docs/images/light.jpg" alt="">
            </div>
        </div>
    </div>
</div>
```

***

### Horizontal alignment

The `.uk-card-media-left` or the `.uk-card-media-right` classes are used to reset border radius or similar where necessary. They don't create the actual layout.

To do that, you could for example add the `.uk-cover-container` class from the [Cover component](cover.md). Add the `uk-cover` attribute to the image element and use the [Grid](grid.md) and [Width](width.md) components to achieve the alignment. Create a `<canvas>` element with your image's width and height, so that it will retain its dimensions, if the grid stacks on smaller viewports. This is just one way of creating a side by side layout.

```html
<div class="uk-card uk-card-default uk-child-width-1-2" uk-grid>
    <div class="uk-card-media-left uk-cover-container">
        <img src="" alt="" uk-cover>
        <canvas width="" height=""></canvas>
    </div>
    <div>
        <div class="uk-card-body"></div>
    </div>
</div>
```

```example
<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
    <div class="uk-card-media-left uk-cover-container">
        <img src="../docs/images/light.jpg" alt="" uk-cover>
        <canvas width="600" height="400"></canvas>
    </div>
    <div>
        <div class="uk-card-body">
            <h3 class="uk-card-title">Media Left</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </div>
    </div>
</div>

<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
    <div class="uk-flex-last@s uk-card-media-right uk-cover-container">
        <img src="../docs/images/light.jpg" alt="" uk-cover>
        <canvas width="600" height="400"></canvas>
    </div>
    <div>
        <div class="uk-card-body">
            <h3 class="uk-card-title">Media Right</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </div>
    </div>
</div>
```

***

## Badge

To position a badge inside a card, add the `.uk-card-badge` class to a container element. To style the badge, you can use one of the other components, for example the [Label](label.md).

```html
<div class="uk-card uk-card-body">
    <div class="uk-card-badge uk-label"></div>
</div>
```

```example
<div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <div class="uk-card-badge uk-label">Badge</div>
    <h3 class="uk-card-title">Title</h3>
    <p>Lorem ipsum color sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</div>
```
