# Text

<p class="uk-text-lead">A collection of useful text utility classes to style your content.</p>

## Style modifiers

UIkit offers various text utilities to style your text.

| Class           | Description                                                                                                           |
|:----------------|:----------------------------------------------------------------------------------------------------------------------|
| `.uk-text-lead` | <span class="uk-text-lead">Add this class to highlight text, for example in article subtitles.</span>                 |
| `.uk-text-meta` | <span class="uk-text-meta">Add this class to a paragraph which contains meta data about an article or similar.</span> |

***

## Font size

The following classes will modify the font size of your text.

| Class            | Description                                                                  |
|:-----------------|:-----------------------------------------------------------------------------|
| `.uk-text-small` | <span class="uk-text-small">Add this class to decrease the font size.</span> |
| `.uk-text-large` | <span class="uk-text-large">Add this class to increase the font size.</span> |

***

## Font weight

Add the `.uk-text-bold` class to create <span class="uk-text-bold">bold text</span>.

***

## Text transform

The following classes will transform text into uppercased, capitalized or lowercased characters.

| Class                 | Description                                                                                  |
|:----------------------|:---------------------------------------------------------------------------------------------|
| `.uk-text-uppercase`  | <span class="uk-text-uppercase">Add this class to transform your text to uppercase.</span>   |
| `.uk-text-capitalize` | <span class="uk-text-capitalize">Add this class to transform your text to capitalize.</span> |
| `.uk-text-lowercase`  | <span class="uk-text-lowercase">Add this class to transform your text to lowercase.</span>   |

***

## Text color

Use one of these classes to apply a different color to text elements.

| Class              | Description                                                                                   |
|:-------------------|:----------------------------------------------------------------------------------------------|
| `.uk-text-muted`   | <span class="uk-text-muted">Add this class to mute your text.</span>                          |
| `.uk-text-primary` | <span class="uk-text-primary">Add this class to emphasize additional text information.</span> |
| `.uk-text-success` | <span class="uk-text-success">Add this class to indicate success.</span>                      |
| `.uk-text-warning` | <span class="uk-text-warning">Add this class to indicate a warning.</span>                    |
| `.uk-text-danger`  | <span class="uk-text-danger">Add this class to indicate danger.</span>                        |

***

## Text background

To apply a gradient or background image to text, add the `.uk-text-background` class to a `<span>` element inside the text element. Styles that don't define a `background-image`, will apply the primary color.

```html
<h1><span class="uk-text-background"></span></h1>
```

***

## Text alignment

Add one of these useful classes to align your text.

| Class              | Description                |
|:-------------------|:---------------------------|
| `.uk-text-left`    | Aligns text to the left.   |
| `.uk-text-right`   | Aligns text to the right.  |
| `.uk-text-center`  | Centers text horizontally. |
| `.uk-text-justify` | Justifies text.            |

```example
<div class="uk-child-width-1-3@s uk-grid-small" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-small">
            <div class="uk-text-left uk-card-body">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr. <code>.uk-text-left</code>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-small">
            <div class="uk-text-right uk-card-body">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr. <code>.uk-text-right</code>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-small">
            <div class="uk-text-center uk-card-body">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr. <code>.uk-text-center</code>
            </div>
        </div>
    </div>
</div>
```

***

### Responsive

UIkit provides a number of responsive alignment classes. Basically, they work just like the usual alignment classes, except that they have suffixes that represent the breakpoint from which they come to effect.

| Class                                                               | Description                                   |
|:--------------------------------------------------------------------|:----------------------------------------------|
| `.uk-text-left@s`<br> `.uk-text-center@s`<br> `.uk-text-right@s`    | Affects device widths of _640px_ and larger.  |
| `.uk-text-left@m`<br> `.uk-text-center@m`<br>   `.uk-text-right@m`  | Affects device widths of _960px_ and larger.  |
| `.uk-text-left@l`<br> `.uk-text-center@l`<br> `.uk-text-right@l`    | Affects device widths of _1200px_ and larger. |
| `.uk-text-left@xl`<br> `.uk-text-center@xl`<br> `.uk-text-right@xl` | Affects device widths of _1600px_ and larger. |

```example
<div class="uk-child-width-1-3@s uk-grid-small" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-small">
            <div class="uk-text-center@s uk-card-body">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr. <code>.uk-text-center@s</code>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-small">
            <div class="uk-text-right@l uk-card-body">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr. <code>.uk-text-right@l</code>
            </div>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-small">
            <div class="uk-text-center@m uk-card-body">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr. <code>.uk-text-center@m</code>
            </div>
        </div>
    </div>
</div>
```

***

### Vertical alignment

Add one of these classes to vertically align text to an object.

| Class               | Description                  |
|:--------------------|:-----------------------------|
| `.uk-text-top`      | Aligns text to the top.      |
| `.uk-text-middle`   | Centers text vertically.     |
| `.uk-text-bottom`   | Aligns text to the bottom.   |
| `.uk-text-baseline` | Aligns text to the baseline. |

```example
<div class="uk-child-width-1-3@m uk-child-width-1-2@s" uk-grid>
    <div>
        <img src="../docs/images/avatar.jpg" width="50" height="50">
        <span class="uk-text-top">Lorem ipsum.</span>
    </div>
    <div>
        <img src="../docs/images/avatar.jpg" width="50" height="50">
        <span class="uk-text-middle">Lorem ipsum.</span>
    </div>
    <div>
        <img src="../docs/images/avatar.jpg" width="50" height="50">
        <span class="uk-text-bottom">Lorem ipsum.</span>
    </div>
</div>
```

***

## Text wrapping

Add one of these useful classes to wrap your text.

| Class               | Description                                                                                        |
|:--------------------|:---------------------------------------------------------------------------------------------------|
| `.uk-text-truncate` | Prevents text from wrapping into multiple lines, truncating it and displaying an ellipsis instead. |
| `.uk-text-break`    | Breaks strings, if their length exceeds the width of their container.                              |
| `.uk-text-nowrap`   | Prevents text from wrapping into multiple lines.                                                   |

```example
<div class="uk-child-width-1-2@s" uk-grid>
    <div>
        <div class="uk-panel uk-panel-box uk-text-truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
    </div>
    <div>
        <div class="uk-panel uk-panel-box uk-text-break">Loremipsumdolorsitamet,consecteturadipiscingelit,seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua.</div>
    </div>
</div>
```
