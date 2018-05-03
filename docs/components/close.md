# Close

<p class="uk-text-lead">Create a close icon that can be combined with different components.</p>

## Usage

To apply this component, add the `uk-close` attribute to an `<a>` or `<button>` element.


```html
<button type="button" uk-close></button>

<a href="" uk-close></a>
```

```example
<button type="button" uk-close></button>
```

***

## Large modifier

Add the `.uk-close-large` class for a larger close button.


```html
<button class="uk-close-large" type="button" uk-close></button>
```

```example
<button class="uk-close-large" type="button" uk-close></button>
```

***

## Close in alerts

This is an example of how this component is used with an alert box from the [Alert component](alert.md).

```html
<div uk-alert>
    <button class="uk-alert-close" type="button" uk-close></button>
</div>
```

```example
<div uk-alert>
    <button class="uk-alert-close" type="button" uk-close></button>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
</div>
```

***

## Close in modals

This is an example of how this component is used with the [Modal component](alert.md).

```html
<div id="modal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
    </div>
</div>
```

```example
<a class="uk-button uk-button-default" href="#modal" uk-toggle>Open modal</a>
<div id="modal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title">Headline</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" type="button">Save</button>
        </p>
    </div>
</div>
```