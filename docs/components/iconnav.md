# Iconnav

<p class="uk-text-lead">Create a navigation consisting of icons.</p>

## Usage

To apply this component, add the `.uk-iconnav` class to a `<ul>`  element.  Use `<a>` elements as menu items within the list and add icons from the [Icon component](icon.md). To apply an active state to a menu item, just add the `.uk-active` class.

```html
<ul class="uk-iconnav">
    <li><a href="" uk-icon="icon: check"></a></li>
</ul>
```

```example
<ul class="uk-iconnav">
    <li><a href="#" uk-icon="icon: plus"></a></li>
    <li><a href="#" uk-icon="icon: file-edit"></a></li>
    <li><a href="#" uk-icon="icon: copy"></a></li>
    <li><a href="#" uk-icon="icon: trash"></a></li>
</ul>
```

***

## Vertical alignment

By default the items of an iconnav are aligned horizontally. To apply a vertical alignment, add the `.uk-iconnav-vertical` class.

```html
<ul class="uk-iconnav uk-iconnav-vertical">...</ul>
```

```example
<ul class="uk-iconnav uk-iconnav-vertical">
    <li><a href="#" uk-icon="icon: plus"></a></li>
    <li><a href="#" uk-icon="icon: file-edit"></a></li>
    <li><a href="#" uk-icon="icon: copy"></a></li>
    <li><a href="#" uk-icon="icon: trash"></a></li>
</ul>
```