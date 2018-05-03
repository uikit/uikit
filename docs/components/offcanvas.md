# Off-canvas

<p class="uk-text-lead">Create an off-canvas sidebar that slides in and out of the page, which is perfect for creating mobile navigations.</p>

## Usage

To apply this component, add the `uk-offcanvas` attribute to a parent `<div>` element and use the following classes.

| Class                   | Description                                                           |
|:------------------------|:----------------------------------------------------------------------|
| `.uk-offcanvas-bar`     | Add this class to a child `<div>` element.                            |
| `.uk-offcanvas-content` | Wrap your page's content inside a `<div>` element and add this class. |
| `.uk-offcanvas-close`   | Add this class and the `uk-close` attribute to an `<a>` or `<button>` element to create a close button and enable its functionality. |

You can use any element to toggle an off-canvas sidebar. To enable the necessary JavaScript, add the `uk-toggle` attribute. An `<a>` element needs to be linked to the id of the off-canvas container. If you are using another element, like a button, just add the `uk-toggle="target: #ID"` attribute to target the id of the off-canvas container.

```html
<body>
    <div class="uk-offcanvas-content">

        <!-- The whole page content goes here -->

        <!-- This is a button toggling the off-canvas -->
        <button uk-toggle="target: #my-id" type="button"></button>

        <!-- This is an anchor toggling the off-canvas -->
        <a href="#my-id" uk-toggle></a>

        <!-- This is the off-canvas -->
        <div id="my-id" uk-offcanvas>
            <div class="uk-offcanvas-bar">

                <button class="uk-offcanvas-close" type="button" uk-close></button>

            </div>
        </div>

    </div>
</body>
```

```example
<div class="uk-offcanvas-content">

    <!-- The whole page content goes here -->

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #offcanvas-usage">Open</button>

    <a href="#offcanvas-usage" uk-toggle>Open</a>

    <div id="offcanvas-usage" uk-offcanvas>
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

</div>
```

***

### Overlay

To add an overlay, blanking out the page, add the `overlay: true` parameter to the `uk-offcanvas` attribute.

```html
<div id="my-id" uk-offcanvas="overlay: true">...</div>
```

```example
<div class="uk-offcanvas-content">

    <button class="uk-button uk-button-default" type="button" uk-toggle="target: #offcanvas-overlay">Open</button>

    <div id="offcanvas-overlay" uk-offcanvas="overlay: true">
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>


            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

</div>
```

***

## Flip modifier

Add the `flip: true` parameter to the `uk-offcanvas` attribute to adjust its alignment, so that it slides in from the right.

```html
<div id="my-id" uk-offcanvas="flip: true">...</div>
```

```example
<div class="uk-offcanvas-content">

    <button class="uk-button uk-button-default" type="button" uk-toggle="target: #offcanvas-flip">Open</button>

    <div id="offcanvas-flip" uk-offcanvas="flip: true; overlay: true">
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

</div>
```


***

## Animation modes

By default, the off-canvas slides in. But you can actually choose between different animation modes for the off-canvas' entrance. Just add one of the following attributes.

| Parameter      | Description                                                                   |
|:---------------|:------------------------------------------------------------------------------|
| `mode: slide`  | The off-canvas slides out and overlays the content. This is the default mode. |
| `mode: push`   | The off-canvas slides out and pushes the site.                                |
| `mode: reveal` | The off-canvas slides out and reveals its content while pushing the site.     |
| `mode: none`   | The off-canvas appears and overlays the content without an animation.         |

```html
<div id="my-id" uk-offcanvas="mode: push">...</div>
```

```example
<div class="uk-offcanvas-content">

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #offcanvas-slide">Slide</button>

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #offcanvas-push">Push</button>

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #offcanvas-reveal">Reveal</button>

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #offcanvas-none">None</button>

    <div id="offcanvas-slide" uk-offcanvas="overlay: true">
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

    <div id="offcanvas-push" uk-offcanvas="mode: push; overlay: true">
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

    <div id="offcanvas-reveal" uk-offcanvas="mode: reveal; overlay: true">
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

    <div id="offcanvas-none" uk-offcanvas="mode: none; overlay: true">
        <div class="uk-offcanvas-bar">

            <button class="uk-offcanvas-close" type="button" uk-close></button>

            <h3>Title</h3>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        </div>
    </div>

</div>
```

***

## Nav in Off-canvas

You can use the [Nav component](nav.md) inside an off-canvas to create a mobile navigation.

```html
<div id="my-id" uk-offcanvas>
    <div class="uk-offcanvas-bar">
        <ul class="uk-nav uk-nav-default">...</ul>
    </div>
</div>
```

```example
<div class="uk-offcanvas-content">

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #offcanvas-nav-primary">Primary Nav</button>

    <button class="uk-button uk-button-default" type="button" uk-toggle="target: #offcanvas-nav">Default Nav</button>

    <div id="offcanvas-nav-primary" uk-offcanvas="overlay: true">
        <div class="uk-offcanvas-bar uk-flex uk-flex-column">

            <ul class="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical">
                <li class="uk-active"><a href="#">Active</a></li>
                <li class="uk-parent">
                    <a href="#">Parent</a>
                    <ul class="uk-nav-sub">
                        <li><a href="#">Sub item</a></li>
                        <li><a href="#">Sub item</a></li>
                    </ul>
                </li>
                <li class="uk-nav-header">Header</li>
                <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: table"></span> Item</a></li>
                <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: thumbnails"></span> Item</a></li>
                <li class="uk-nav-divider"></li>
                <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: trash"></span> Item</a></li>
            </ul>

        </div>
    </div>

    <div id="offcanvas-nav" uk-offcanvas="overlay: true">
        <div class="uk-offcanvas-bar">

            <ul class="uk-nav uk-nav-default">
                <li class="uk-active"><a href="#">Active</a></li>
                <li class="uk-parent">
                    <a href="#">Parent</a>
                    <ul class="uk-nav-sub">
                        <li><a href="#">Sub item</a></li>
                        <li><a href="#">Sub item</a></li>
                    </ul>
                </li>
                <li class="uk-nav-header">Header</li>
                <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: table"></span> Item</a></li>
                <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: thumbnails"></span> Item</a></li>
                <li class="uk-nav-divider"></li>
                <li><a href="#"><span class="uk-margin-small-right" uk-icon="icon: trash"></span> Item</a></li>
            </ul>

        </div>
    </div>

</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option    | Value   | Default | Description                                                     |
|:----------|:--------|:--------|:----------------------------------------------------------------|
| `mode`    | String  | `slide` | Off-canvas animation mode: `slide`, `reveal`, `push` or `none`. |
| `flip`    | Boolean | `false` | Flip off-canvas to the right side.                              |
| `overlay` | Boolean | `false` | Display the off-canvas together with an overlay.                |
| `esc-close` | Boolean | `true`| Close the off-canvas when the _Esc_ key is pressed.             |
| `bg-close`  | Boolean | `true`| Close the off-canvas when the background is clicked.            |
| `container` | String | `true` | Define a target container via a selector to specify where the off-canvas should be appended in the DOM. Setting it to `false` will prevent this behavior. |

`mode` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

```html
<span uk-offcanvas="push"></span>
```

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.offcanvas(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name         | Description                                          |
|:-------------|:-----------------------------------------------------|
| `beforeshow` | Fires before an item is shown.                       |
| `show`       | Fires after an item is shown.                        |
| `shown`      | Fires after the item's show animation has completed. |
| `beforehide` | Fires before an item is hidden.                      |
| `hide`       | Fires after an item's hide animation has started.    |
| `hidden`     | Fires after an item is hidden.                       |

### Methods

The following methods are available for the component:

#### Show

```js
UIkit.offcanvas(element).show();
```

Shows the Offcanvas.

#### Hide

```js
UIkit.offcanvas(element).hide();
```

Hides the Offcanvas.
