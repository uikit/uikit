# Modal

<p class="uk-text-lead">Create modal dialogs with different styles and transitions.</p>

## Usage

The Modal component consists of an overlay, a dialog and an optional close button. You can use any element to toggle a modal dialog. To enable the necessary JavaScript, add the `uk-toggle` attribute. An `<a>` element needs to be linked to the modal's id. If you are using another element, like a button, just add the `uk-toggle="target: #ID"` attribute to target the id of the modal container.

Add the `uk-modal` attribute to a `<div>` element to create the modal container and an overlay that blanks out the page. It is important to add an `id` to indicate the element for toggling. Use the following classes to define the modal's sections.

| Class              | Description                                                                                             |
|:-------------------|:--------------------------------------------------------------------------------------------------------|
| `.uk-modal-dialog` | Add this class to a child `<div>` element to create the dialog                                          |
| `.uk-modal-body`   | Add this class to create padding between the modal and its content.                                     |
| `.uk-modal-title`  | Add this class to a heading element to create the modal title.                                          |
| `.uk-modal-close`  | Add this class to an `<a>` or `<button>` element to create a close button and enable its functionality. |

```html
<!-- This is a button toggling the modal -->
<button uk-toggle="target: #my-id" type="button"></button>

<!-- This is the modal -->
<div id="my-id" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title"></h2>
        <button class="uk-modal-close" type="button"></button>
    </div>
</div>
```

```example
<!-- This is a button toggling the modal -->
<button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #modal-example">Open</button>

<!-- This is an anchor toggling the modal -->
<a href="#modal-example" uk-toggle>Open</a>

<!-- This is the modal -->
<div id="modal-example" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Headline</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" type="button">Save</button>
        </p>
    </div>
</div>
```

***

## Close button

To create a close button, enable its functionality and add proper styling and positioning, add the `.uk-modal-close-default` class to an `<a>` or `<button>` element. To place the close button outside the modal, add the `.uk-modal-close-outside` class.

Add the `uk-close` attribute from the [Close component](close.md), to apply a close icon.

```html
<div id="my-id">
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
    </div>
</div>

<div id="my-id">
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
    </div>
</div>
```

```example
<!-- This is a button toggling the modal with the default close button -->
<button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #modal-close-default">Default</button>

<!-- This is the modal with the default close button -->
<div id="modal-close-default" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">Default</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</div>

<!-- This is a button toggling the modal with the outside close button -->
<button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #modal-close-outside">Outside</button>

<!-- This is the modal with the outside close button -->
<div id="modal-close-outside" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
        <h2 class="uk-modal-title">Outside</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</div>
```

***

## Center modal

To vertically center the modal dialog, you can use the `.uk-margin-auto-vertical` class from the [Margin component](margin.md).

```html
<div id="my-id" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-margin-auto-vertical"></div>
</div>
```

```example
<a class="uk-button uk-button-default" href="#modal-center" uk-toggle>Open</a>

<div id="modal-center" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

        <button class="uk-modal-close-default" type="button" uk-close></button>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    </div>
</div>
```

**Note** `.uk-flex-top` on the modal container is needed to support IE 11.

***

## Header and footer

To divide the modal into different content sections, use the following classes.

| Class              | Description                                                     |
|:-------------------|:----------------------------------------------------------------|
| `.uk-modal-header` | Add this class to a `<div>` element to create the modal header. |
| `.uk-modal-footer` | Add this class to a `<div>` element to create the modal footer. |

```html
<div id="my-id" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title"></h2>
        </div>
        <div class="uk-modal-body"></div>
        <div class="uk-modal-footer"></div>
    </div>
</div>
```

```example
<a class="uk-button uk-button-default" href="#modal-sections" uk-toggle>Open</a>

<div id="modal-sections" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Modal Title</h2>
        </div>
        <div class="uk-modal-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" type="button">Save</button>
        </div>
    </div>
</div>
```


***

## Container modifier

Add the `.uk-modal-container` class to expand the modal dialog to the default [Container](container.md) width.

```html
<div id="my-id" class="uk-modal-container" uk-modal>...</div>
```

```example
<a class="uk-button uk-button-default" href="#modal-container" uk-toggle>Open</a>

<div id="modal-container" class="uk-modal-container" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">Headline</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</div>
```

***

## Full modifier

To create a modal, that fills the entire page, add the `.uk-modal-full` class. It is also recommended to add the `.uk-modal-close-full` class to the close button, so that it adapts its styling.

```html
<div id="my-id" class="uk-modal-full" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>
    </div>
</div>
```

Using the [grid](grid.md) and [width](width.md) classes, you can create a nice, split fullscreen modal.

```example
<a class="uk-button uk-button-default" href="#modal-full" uk-toggle>Open</a>

<div id="modal-full" class="uk-modal-full" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>
        <div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>
            <div class="uk-background-cover" style="background-image: url('../docs/images/photo.jpg');" uk-height-viewport></div>
            <div class="uk-padding-large">
                <h1>Headline</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </div>
    </div>
</div>
```

***

## Overflow

By default, the page will scroll with the modal, if its content exceeds the window height. To apply a scrollbar inside the modal, add the `uk-overflow-auto` attribute from the [Utility component](utility.md#overflow) to the modal body.

```html
<div id="my-id" uk-modal>
    <div class="uk-modal-dialog" uk-overflow-auto></div>
</div>
```

```example
<a class="uk-button uk-button-default" href="#modal-overflow" uk-toggle>Open</a>

<div id="modal-overflow" uk-modal>
    <div class="uk-modal-dialog">

        <button class="uk-modal-close-default" type="button" uk-close></button>

        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Headline</h2>
        </div>

        <div class="uk-modal-body" uk-overflow-auto>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        </div>

        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" type="button">Save</button>
        </div>

    </div>
</div>
```

***

## Media

If you want to display media, you should first check, if the [Lightbox component](lightbox.md) doesn't already offer everything you need. However, you can also use the modal to have more control over the markup to wrap your media in.

**Note** Use the `uk-video` attribute from the [Utility component](utility.md) to make sure videos are stopped when the modal is closed.

```html
<div uk-modal>
    <div class="uk-modal-dialog uk-width-auto">
        <iframe src="" uk-video></iframe>
    </div>
</div>
```

```example
 <p uk-margin>
    <a class="uk-button uk-button-default" href="#modal-media-image" uk-toggle>Image</a>
    <a class="uk-button uk-button-default" href="#modal-media-video" uk-toggle>Video</a>
    <a class="uk-button uk-button-default" href="#modal-media-youtube" uk-toggle>Youtube</a>
    <a class="uk-button uk-button-default" href="#modal-media-vimeo" uk-toggle>Vimeo</a>
</p>

<div id="modal-media-image" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
        <img src="images/photo.jpg" alt="">
    </div>
</div>

<div id="modal-media-video" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
        <video controls playsinline uk-video>
            <source src="//www.quirksmode.org/html5/videos/big_buck_bunny.mp4" type="video/mp4">
            <source src="//www.quirksmode.org/html5/videos/big_buck_bunny.ogv" type="video/ogg">
        </video>
    </div>
</div>

<div id="modal-media-youtube" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
        <iframe src="//www.youtube.com/embed/YE7VzlLtp-4" width="560" height="315" frameborder="0" uk-video></iframe>
    </div>
</div>

<div id="modal-media-vimeo" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
        <iframe src="//player.vimeo.com/video/1084537" width="500" height="281" frameborder="0" uk-video></iframe>
    </div>
</div>
```

***

## Groups

You can group multiple modals by linking from one to the other and back. Use this to create multistep wizards inside your modals.

```html
<div id="modal-group-1" uk-modal>
    <div class="uk-modal-dialog">
        <a href="#modal-group-2" uk-toggle>Next</a>
    </div>
</div>

<div id="modal-group-2" uk-modal>
    <div class="uk-modal-dialog">
        <a href="#modal-group-1" uk-toggle>Previous</a>
    </div>
</div>
```

```example
<p uk-margin>
    <a class="uk-button uk-button-default" href="#modal-group-1" uk-toggle>Modal 1</a>
    <a class="uk-button uk-button-default" href="#modal-group-2" uk-toggle>Modal 2</a>
</p>

<div id="modal-group-1" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Headline 1</h2>
        </div>
        <div class="uk-modal-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <a href="#modal-group-2" class="uk-button uk-button-primary" uk-toggle>Next</a>
        </div>
    </div>
</div>

<div id="modal-group-2" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Headline 2</h2>
        </div>
        <div class="uk-modal-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <a href="#modal-group-1" class="uk-button uk-button-primary" uk-toggle>Previous</a>
        </div>
    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option      | Value   | Default | Description                                                                                        |
|:------------|:--------|:--------|:---------------------------------------------------------------------------------------------------|
| `esc-close` | Boolean | `true`  | Close the modal when the _Esc_ key is pressed.                                                     |
| `bg-close`  | Boolean | `true`  | Close the modal when the background is clicked.                                                    |
| `stack`     | Boolean | `false` | Stack modals, when more than one is open. By default, the previous modal will be hidden.           |
| `container` | String  | `true`  | Define a target container via a selector to specify where the modal should be appended in the DOM. Setting it to `false` will prevent this behavior. |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.modal(element, options);
```

### JavaScript options

| Name        | Default             | Description                                                  |
|:------------|:--------------------|:-------------------------------------------------------------|
| `cls-page`  | `'uk-modal-page'`   | Class to add to `<body>` when modal is active                |
| `cls-panel` | `'uk-modal-dialog'` | Class of the element to be considered the panel of the modal |
| `sel-close` | `'.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full'` | CSS selector for all elements that should trigger the closing of the modal |

***

### Modal dialogs

The component comes with a number of prepared modal dialogs that you can use for user interaction. You can call the dialog directly from JavaScript and use callback functions to process the user input.

| Code                                          | Description                                              |
|:----------------------------------------------|:---------------------------------------------------------|
| `UIkit.modal.alert('UIkit alert!')`           | Show an alert box with one button.                       |
| `UIkit.modal.confirm('UIkit confirm!')`       | Show a confirm dialog with your message and two buttons. |
| `UIkit.modal.prompt('Name:', 'Your name')`    | Show a dialog asking for a text input.                   |
| `UIkit.modal.dialog('<p>UIkit dialog!</p>');` | Show dialog with any HTML content.                       |

To process the user input, the modal uses a promise based interface which provides a `then()` function to register your callback functions.

```js
UIkit.modal.confirm('UIkit confirm!').then(function() {
    console.log('Confirmed.')
}, function () {
    console.log('Rejected.')
});
```

```example
<p uk-margin>

    <a id="js-modal-dialog" class="uk-button uk-button-default" href="#">Dialog</a>

    <a id="js-modal-alert" class="uk-button uk-button-default" href="#">Alert</a>

    <a id="js-modal-confirm" class="uk-button uk-button-default" href="#">Confirm</a>

    <a id="js-modal-prompt" class="uk-button uk-button-default" href="#">Prompt</a>

    <script>

       UIkit.util.on('#js-modal-dialog', 'click', function (e) {
           e.preventDefault();
           e.target.blur();
           UIkit.modal.dialog('<p class="uk-modal-body">UIkit dialog!</p>');
       });

       UIkit.util.on('#js-modal-alert', 'click', function (e) {
           e.preventDefault();
           e.target.blur();
           UIkit.modal.alert('UIkit alert!').then(function () {
               console.log('Alert closed.')
           });
       });

       UIkit.util.on('#js-modal-confirm', 'click', function (e) {
           e.preventDefault();
           e.target.blur();
           UIkit.modal.confirm('UIkit confirm!').then(function () {
               console.log('Confirmed.')
           }, function () {
               console.log('Rejected.')
           });
       });

       UIkit.util.on('#js-modal-prompt', 'click', function (e) {
           e.preventDefault();
           e.target.blur();
           UIkit.modal.prompt('Name:', 'Your name').then(function (name) {
               console.log('Prompted:', name)
           });
       });

    </script>

</p>
```

***

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
UIkit.modal(element).show();
```

Shows the Modal.

#### Hide

```js
UIkit.modal(element).hide();
```

Hides the Modal.
