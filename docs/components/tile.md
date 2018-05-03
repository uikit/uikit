# Tile

<p class="uk-text-lead">Create layout boxes with different backgrounds that can be arranged seamlessly next to each other.</p>

## Usage

To apply this component, add the `.uk-tile` class to a `<div>` element. By default, a tile is blank. That is why it is important to add one of the following modifier classes for styling.

| Class                | Description                          |
|:---------------------|:-------------------------------------|
| `.uk-tile-default`   | Applies the default tile background. |
| `.uk-tile-muted`     | Applies a muted tile background.     |
| `.uk-tile-primary`   | Applies the primary tile background. |
| `.uk-tile-secondary` | Applies a secondary tile background. |

```html
<div class="uk-tile uk-tile-default"></div>
```

```example
<div class="uk-child-width-1-2@s uk-grid-collapse uk-text-center" uk-grid>
    <div>
        <div class="uk-tile uk-tile-default">
            <p class="uk-h4">Default</p>
        </div>
    </div>
    <div>
        <div class="uk-tile uk-tile-muted">
            <p class="uk-h4">Muted</p>
        </div>
    </div>
    <div>
        <div class="uk-tile uk-tile-primary">
            <p class="uk-h4">Primary</p>
        </div>
    </div>
    <div>
        <div class="uk-tile uk-tile-secondary">
            <p class="uk-h4">Secondary</p>
        </div>
    </div>
</div>
```

***

## Tile and padding

The tile component has some padding by default. To remove this or to apply different spacing, add one of the classes from the [Padding component](padding.md).

```html
<div class="uk-tile uk-tile-default uk-padding-large"></div>
```

```example
<div class="uk-child-width-1-3@s uk-grid-small uk-text-center" uk-grid>
    <div>
        <div class="uk-tile uk-tile-muted uk-padding-remove">
            <p class="uk-h4">Remove</p>
        </div>
    </div>
    <div>
        <div class="uk-tile uk-tile-primary uk-padding-small">
            <p class="uk-h4">Small</p>
        </div>
    </div>
    <div>
        <div class="uk-tile uk-tile-secondary uk-padding-large">
            <p class="uk-h4">Large</p>
        </div>
    </div>
</div>
```
