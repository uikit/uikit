# Form

<p class="uk-text-lead">Easily create nice looking forms with different styles and layouts.</p>

## Usage

Add one of the following classes to form controls inside a `<form>` element to define them.

| Class          | Description                                                                |
|:---------------|:---------------------------------------------------------------------------|
| `.uk-input`    | Add this class to `<input>` elements.                                      |
| `.uk-select`   | Add this class to `<select>` elements.                                     |
| `.uk-textarea` | Add this class to `<textarea>` elements.                                   |
| `.uk-radio`    | Add this class to `<input type="radio">` elements to create radio buttons. |
| `.uk-checkbox` | Add this class to `<input type="checkbox">` elements to create checkboxes. |
| `.uk-range`    | Add this class to `<input type="range">` elements to create range forms.   |

```html
<form>
    <select class="uk-select">
        <option></option>
        <option></option>
    </select>
    <textarea class="uk-textarea"></textarea>
    <input class="uk-radio" type="radio">
    <input class="uk-checkbox" type="checkbox">
    <input class="uk-range" type="range">
</form>
```

Add the `.uk-fieldset` class to a `<fieldset>` element and the `.uk-legend` class to a `<legend>` element to define a fieldset and a form legend.

```example
<form>
    <fieldset class="uk-fieldset">

        <legend class="uk-legend">Legend</legend>

        <div class="uk-margin">
            <input class="uk-input" type="text" placeholder="Input">
        </div>

        <div class="uk-margin">
            <select class="uk-select">
                <option>Option 01</option>
                <option>Option 02</option>
            </select>
        </div>

        <div class="uk-margin">
            <textarea class="uk-textarea" rows="5" placeholder="Textarea"></textarea>
        </div>

        <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label><input class="uk-radio" type="radio" name="radio2" checked> A</label>
            <label><input class="uk-radio" type="radio" name="radio2"> B</label>
        </div>

        <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label><input class="uk-checkbox" type="checkbox" checked> A</label>
            <label><input class="uk-checkbox" type="checkbox"> B</label>
        </div>

        <div class="uk-margin">
            <input class="uk-range" type="range" value="2" min="0" max="10" step="0.1">
        </div>

    </fieldset>
</form>
```

***

## States modifiers

Provide the user with basic information through feedback states on form controls by using one of the following classes.

| Class              | Description                                                        |
|:-------------------|:-------------------------------------------------------------------|
| `.uk-form-danger`  | Add this class to notify the user that the value is not validated. |
| `.uk-form-success` | Add this class to notify the user that the value is validated.     |

Add the `disabled` attribute to a form control and it will be appear muted.

```example
<div class="uk-margin">
    <input class="uk-input uk-form-danger uk-form-width-medium" type="text" placeholder="form-danger" value="form-danger">
</div>

<div class="uk-margin">
    <input class="uk-input uk-form-success uk-form-width-medium" type="text" placeholder="form-success" value="form-success">
</div>

<div class="uk-margin">
    <input class="uk-input uk-form-width-medium" type="text" placeholder="disabled" value="disabled" disabled>
</div>
```

***

## Size modifiers

Add one of the classes to an `<input>`, `<select>` or `<textarea>` element to modify its size.

| Class            | Description                                 |
|:-----------------|:--------------------------------------------|
| `.uk-form-large` | Add this class to make the element larger.  |
| `.uk-form-small` | Add this class to make the element smaller. |

```example
<form>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-medium uk-form-large" type="text" placeholder="Large">
    </div>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-medium" type="text" placeholder="Default">
    </div>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-medium uk-form-small" type="text" placeholder="Small">
    </div>

</form>
```

***

## Width modifiers

Add one of the following classes to an `<input>`, `<select>` or `<textarea>` element to adjust its width.

| Class                   | Description                 |
|:------------------------|:----------------------------|
| `.uk-form-width-large`  | Applies a width of _500px_. |
| `.uk-form-width-medium` | Applies a width of _200px_. |
| `.uk-form-width-small`  | Applies a width of _130px_. |
| `.uk-form-width-xsmall` | Applies a width of _40px_.  |

```example
<form>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-large" type="text" placeholder="Large">
    </div>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-medium" type="text" placeholder="Medium">
    </div>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-small" type="text" placeholder="Small">
    </div>

    <div class="uk-margin">
        <input class="uk-input uk-form-width-xsmall" type="text" placeholder="XSmall">
    </div>

</form>
```

You can also apply the `.uk-width-*` classes from the [Width component](width.md) to form controls.

```example
<form>
    <input class="uk-input uk-width-1-2" type="text" placeholder="uk-width-1-2">
</form>
```

***

## Blank modifier

Add the `.uk-form-blank` class to minimize the styling of form controls.

```example
<form>
    <input class="uk-input uk-form-blank uk-form-width-medium" type="text" placeholder="Form blank">
</form>
```

***

## Layout

Define labels and controls and apply a stacked or horizontal layout to form elements. Layout modifiers can be added to any parent element like the `<fieldset>` element. This makes it possible to have different form layouts for each fieldset.

| Class                 | Description                                                 |
|:----------------------|:------------------------------------------------------------|
| `.uk-form-stacked`    | Add this class to display labels on top of controls.        |
| `.uk-form-horizontal` | Add this class to display labels and controls side by side. |
| `.uk-form-label`      | Add this class to define form labels.                       |
| `.uk-form-controls`   | Add this class to define form controls.                     |

```html
<form class="uk-form-stacked">
    <div>
        <label class="uk-form-label"></label>
        <div class="uk-form-controls">...</div>
    </div>
    <div>
        <div class="uk-form-label"></div>
        <div class="uk-form-controls">...</div>
    </div>
</form>
```

```example
<form class="uk-form-stacked">

    <div class="uk-margin">
        <label class="uk-form-label" for="form-stacked-text">Text</label>
        <div class="uk-form-controls">
            <input class="uk-input" id="form-stacked-text" type="text" placeholder="Some text...">
        </div>
    </div>

    <div class="uk-margin">
        <label class="uk-form-label" for="form-stacked-select">Select</label>
        <div class="uk-form-controls">
            <select class="uk-select" id="form-stacked-select">
                <option>Option 01</option>
                <option>Option 02</option>
            </select>
        </div>
    </div>

    <div class="uk-margin">
        <div class="uk-form-label">Radio</div>
        <div class="uk-form-controls">
            <label><input class="uk-radio" type="radio" name="radio1"> Option 01</label><br>
            <label><input class="uk-radio" type="radio" name="radio1"> Option 02</label>
        </div>
    </div>

</form>
```

***

### Horizontal form

Use the `.uk-form-controls-text` class to better align checkboxes and radio buttons when using them with text in a horizontal layout.

```html
<form class="uk-form-horizontal">
    <div>
        <label class="uk-form-label"></label>
        <div class="uk-form-controls">...</div>
    </div>
    <div>
        <div class="uk-form-label"></div>
        <div class="uk-form-controls uk-form-controls-text">...</div>
    </div>
</form>
```

```example
<form class="uk-form-horizontal uk-margin-large">

    <div class="uk-margin">
        <label class="uk-form-label" for="form-horizontal-text">Text</label>
        <div class="uk-form-controls">
            <input class="uk-input" id="form-horizontal-text" type="text" placeholder="Some text...">
        </div>
    </div>

    <div class="uk-margin">
        <label class="uk-form-label" for="form-horizontal-select">Select</label>
        <div class="uk-form-controls">
            <select class="uk-select" id="form-horizontal-select">
                <option>Option 01</option>
                <option>Option 02</option>
            </select>
        </div>
    </div>

    <div class="uk-margin">
        <div class="uk-form-label">Radio</div>
        <div class="uk-form-controls uk-form-controls-text">
            <label><input class="uk-radio" type="radio" name="radio1"> Option 01</label><br>
            <label><input class="uk-radio" type="radio" name="radio1"> Option 02</label>
        </div>
    </div>

</form>
```

***

## Form and icons

You use an icon from the [Icon component](icon.md) inside a form. Add the `.uk-form-icon` class to a `<span>` element. Group it with an `<input>` element by adding the `.uk-inline` class from the [Utility component](utility.md#inline) to a container element around both. The icon has to come first in the markup. By default, the icon will be placed on the left side of the form. To change the alignment, add the `.uk-form-icon-flip` class.

```html
<div class="uk-inline">
    <span class="uk-form-icon" uk-icon="icon: user"></span>
    <input class="uk-input">
</div>
```

```example
<form>

    <div class="uk-margin">
        <div class="uk-inline">
            <span class="uk-form-icon" uk-icon="icon: user"></span>
            <input class="uk-input" type="text">
        </div>
    </div>

    <div class="uk-margin">
        <div class="uk-inline">
            <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
            <input class="uk-input" type="text">
        </div>
    </div>

</form>
```

***

### Clickable icons

To enable an action, for example opening a modal to pick an image or link, use an `<a>` or `<button>` element to create the icon.

```html
<div class="uk-inline">
    <a class="uk-form-icon uk-form-icon-flip" href="" uk-icon="icon: user"></a>
    <input class="uk-input">
</div>
```

```example
<form>

    <div class="uk-margin">
        <div class="uk-inline">
            <a class="uk-form-icon" href="#" uk-icon="icon: pencil"></a>
            <input class="uk-input" type="text">
        </div>
    </div>

    <div class="uk-margin">
        <div class="uk-inline">
            <a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: link"></a>
            <input class="uk-input" type="text">
        </div>
    </div>

</form>
```

***

## Form and grid

You can also use the [Grid](grid.md) and [Width](width.md) components to define the layout of a form.

```example
<form class="uk-grid-small" uk-grid>
    <div class="uk-width-1-1">
        <input class="uk-input" type="text" placeholder="100">
    </div>
    <div class="uk-width-1-2@s">
        <input class="uk-input" type="text" placeholder="50">
    </div>
    <div class="uk-width-1-4@s">
        <input class="uk-input" type="text" placeholder="25">
    </div>
    <div class="uk-width-1-4@s">
        <input class="uk-input" type="text" placeholder="25">
    </div>
    <div class="uk-width-1-2@s">
        <input class="uk-input" type="text" placeholder="50">
    </div>
    <div class="uk-width-1-2@s">
        <input class="uk-input" type="text" placeholder="50">
    </div>
</form>
```

***

## Custom controls

To replace a file inputs or select forms with your own HTML content, like a button or text, add the `uk-form-custom` attribute to a container element.

### File

Use a button or text as a file input.

```html
<div uk-form-custom>
    <input type="file">
    <button type="button"></button>
</div>
```

```example
<form>

    <div class="uk-margin">
        <div uk-form-custom>
            <input type="file">
            <button class="uk-button uk-button-default" type="button" tabindex="-1">Select</button>
        </div>
    </div>

    <div class="uk-margin">
        <span class="uk-text-middle">Here is a text</span>
        <div uk-form-custom>
            <input type="file">
            <span class="uk-link">upload</span>
        </div>
    </div>

    <div class="uk-margin" uk-margin>
        <div uk-form-custom="target: true">
            <input type="file">
            <input class="uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled>
        </div>
        <button class="uk-button uk-button-default">Submit</button>
    </div>

</form>
```

***

### Select

Use a button, text or a link as a select form. Just add the `target: SELECTOR` option to the `uk-form-custom` attribute to select where the option value should be displayed. `target: true` will select the adjacent element in the markup.

```html
<div uk-form-custom="target: true">
    <select>
        <option></option>
        <option></option>
    </select>
    <button type="button"></button>
</div>
```

```example
<form>

    <div class="uk-margin">
        <div uk-form-custom="target: true">
            <select>
                <option value="1">Option 01</option>
                <option value="2">Option 02</option>
                <option value="3">Option 03</option>
                <option value="4">Option 04</option>
            </select>
            <span></span>
        </div>
    </div>

    <div class="uk-margin">
        <div uk-form-custom="target: > * > span:last-child">
            <select>
                <option value="1">Option 01</option>
                <option value="2">Option 02</option>
                <option value="3">Option 03</option>
                <option value="4">Option 04</option>
            </select>
            <span class="uk-link">
                <span uk-icon="icon: pencil"></span>
                <span></span>
            </span>
        </div>
    </div>

    <div class="uk-margin">
        <div uk-form-custom="target: > * > span:first-child">
            <select>
                <option value="">Please select...</option>
                <option value="1">Option 01</option>
                <option value="2">Option 02</option>
                <option value="3">Option 03</option>
                <option value="4">Option 04</option>
            </select>
            <button class="uk-button uk-button-default" type="button" tabindex="-1">
                <span></span>
                <span uk-icon="icon: chevron-down"></span>
            </button>
        </div>
    </div>

</form>
```

***

## Component option

You can add this option to the `uk-form-custom` attribute. [Learn more](javascript.md#component-configuration)

| Option   | Value                 | Default | Description           |
|:---------|:----------------------|:--------|:----------------------|
| `target` | CSS selector, Boolean | false   | Value display target. |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.formCustom(element, options);
```
