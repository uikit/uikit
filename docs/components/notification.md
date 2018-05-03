# Notification

<p class="uk-text-lead">Create toggleable notifications that fade out automatically.</p>

## Usage

The notification will not fade out but remain visible when you hover the message until you stop hovering. You can also close the notification by clicking it. To show notifications, the component provides a simple JavaScript API. The following code snippet gets you started.

### JavaScript

```js
UIkit.notification({
    message: 'my-message!',
    status: 'primary',
    pos: 'top-right',
    timeout: 5000
});

// Shortcuts
UIkit.notification('My message');
UIkit.notification('My message', status);
UIkit.notification('My message', { /* options */ });
```

```example
<button class="demo uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Notification message'})">Click me</button>

```

***

## HTML message

You can use HTML inside your notification message, like an icon from the Icon component.

```js
UIkit.notification("<span uk-icon='icon: check'></span> Message");
```

```example
<button class="uk-button uk-button-default demo" type="button" onclick="UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Message with an icon'})">With icon</button>

```

***

## Position

Add one of the following parameters to adjust the notification's position to different corners.


```js
UIkit.notification("...", {pos: 'top-right'})
```

| Position        | Code                                                |
|:----------------|:----------------------------------------------------|
| `top-left`      | `UIkit.notification("...", {pos: 'top-left'})`      |
| `top-center`    | `UIkit.notification("...", {pos: 'top-center'})`    |
| `top-right`     | `UIkit.notification("...", {pos: 'top-right'})`     |
| `bottom-left`   | `UIkit.notification("...", {pos: 'bottom-left'})`   |
| `bottom-center` | `UIkit.notification("...", {pos: 'bottom-center'})` |
| `bottom-right`  | `UIkit.notification("...", {pos: 'bottom-right'})`  |


```example
<p uk-margin>
    <button class="uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Top Left...', pos: 'top-left'})">Top Left</button>
    <button class="uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Top Center...', pos: 'top-center'})">Top Center</button>
    <button class="uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Top Right...', pos: 'top-right'})">Top Right</button>
    <button class="uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Bottom Left...', pos: 'bottom-left'})">Bottom Left</button>
    <button class="uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Bottom Center...', pos: 'bottom-center'})">Bottom Center</button>
    <button class="uk-button uk-button-default" type="button" onclick="UIkit.notification({message: 'Bottom Right...', pos: 'bottom-right'})">Bottom Right</button>
</p>
```


***

## Style

A notification can be styled by adding a status to the message to indicate a primary, success, warning or a danger status.

```js
UIkit.notification("...", {status: 'primary'})
```

| Style     | Code                                            |
|:----------|:------------------------------------------------|
| `primary` | `UIkit.notification("...", {status:'primary'})` |
| `success` | `UIkit.notification("...", {status:'success'})` |
| `warning` | `UIkit.notification("...", {status:'warning'})` |
| `danger`  | `UIkit.notification("...", {status:'danger'})`  |

```example
<p uk-margin>
    <button class="uk-button uk-button-default demo" type="button" onclick="UIkit.notification({message: 'Primary message...', status: 'primary'})">Primary</button>
    <button class="uk-button uk-button-default demo" type="button" onclick="UIkit.notification({message: 'Success message...', status: 'success'})">Success</button>
    <button class="uk-button uk-button-default demo" type="button" onclick="UIkit.notification({message: 'Warning message...', status: 'warning'})">Warning</button>
    <button class="uk-button uk-button-default demo" type="button" onclick="UIkit.notification({message: 'Danger message...', status: 'danger'})">Danger</button>
</p>
```

***

## Close all

You can close all open notifications by calling `UIkit.notification.closeAll()`.

```example
<button class="uk-button uk-button-default close" onclick="UIkit.notification.closeAll()">Close All</button>

```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option     | Value   | Default      | Description                                                         |
|:-----------|:--------|:-------------|:--------------------------------------------------------------------|
| `message ` | String  | `false`      | Notification message to show.                                       |
| `status`   | String  | `null`       | Notification status color.                                          |
| `timeout`  | Integer | `5000`       | Visibility duration until a notification disappears.                |
| `group`    | String  | `null`       | Useful, if you want to close all notifications in a specific group. |
| `pos`      | String  | `top-center` | Display corner.                                                     |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

This is a `Functional Component` and may omit the element argument.

```js
UIkit.notification(options);
UIkit.notification(message, status);
```

### Events

The following events will be triggered on elements with this component attached:

| Name | Description |
| --- | --- |
| `close` | Fires after the notification has been closed. |

### Methods

The following methods are available for the component:

#### Close

```js
UIkit.notification(element).close(immediate);
```

Closes the notification.

| Name        | Type    | Default | Description                      |
|:------------|:--------|:--------|:---------------------------------|
| `immediate` | Boolean | true    | Transition the notification out. |
