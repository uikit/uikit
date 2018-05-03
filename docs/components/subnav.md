# Subnav

<p class="uk-text-lead">Defines different styles for a sub navigation.</p>

## Usage

To apply this component, use the following classes. To align a subnav, for example to horizontally center it, you can use the [Flex component](flex.md).

| Class         | Description                                                                                                         |
|:--------------|:--------------------------------------------------------------------------------------------------------------------|
| `.uk-subnav`  | Add this class to a `<ul>` element to define the Subnav component. Use `<a>` elements as nav items within the list. |
| `.uk-active ` | Add this class to a list item to apply an active state.                                                             |

To add list items without a link, use a `<span>` element instead of an `<a>`. Alternatively, disable an `<a>` element by adding the `.uk-disabled` class to the `<li>` element and remove the `href` attribute from the anchor to make it inaccessible through keyboard navigation.

```html
<ul class="uk-subnav">
    <li class="uk-active"><a href=""></a></li>
    <li><a href=""></a></li>
    <li><span></span></li>
</ul>
```

```example
<ul class="uk-subnav" uk-margin>
    <li class="uk-active"><a href="#">Active</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
    <li><span>Disabled</span></li>
</ul>
```

**Note** For a better layout, if items should wrap into the next row, add the `uk-margin` attribute from the [Margin component](margin.md).

***

## Divider modifier

Add the `.uk-subnav-divider` class to separate menu items with lines.

```html
<ul class="uk-subnav uk-subnav-divider">...</ul>
```

```example
<ul class="uk-subnav uk-subnav-divider" uk-margin>
    <li class="uk-active"><a href="#">Active</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>
```

***

## Pill modifier

Add the `.uk-subnav-pill` class to highlight the active menu item with a background.

```html
<ul class="uk-subnav uk-subnav-pill">...</ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-margin>
    <li class="uk-active"><a href="#">Active</a></li>
    <li><a href="#">Item</a></li>
    <li><a href="#">Item</a></li>
</ul>
```

***

## Subnav with Dropdown

You can also use a dropdown from the [Dropdown component](dropdown.md) with a subnav.

```html
<ul class="uk-subnav">
    <li>
        <a href=""></a>
        <div uk-dropdown="mode: click;"></div>
    </li>
</ul>
```

```example
<ul class="uk-subnav uk-subnav-pill" uk-margin>
    <li class="uk-active"><a href="#">Active</a></li>
    <li><a href="#">Item</a></li>
    <li>
        <a href="#">More <span uk-icon="icon:  triangle-down"></span></a>
        <div uk-dropdown="mode: click;">
            <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-active"><a href="#">Active</a></li>
                <li><a href="#">Item</a></li>
                <li class="uk-nav-header">Header</li>
                <li><a href="#">Item</a></li>
                <li><a href="#">Item</a></li>
                <li class="uk-nav-divider"></li>
                <li><a href="#">Item</a></li>
            </ul>
        </div>
    </li>
</ul>
```