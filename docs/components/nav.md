# Nav

<p class="uk-text-lead">Defines different styles for list navigations.</p>

## Usage

To apply this component, use the following classes.

| Class         | Description                                                                                                      |
|:--------------|:-----------------------------------------------------------------------------------------------------------------|
| `.uk-nav`     | Add this class to a `<ul>` element to define the Nav component. Use `<a>` elements as nav items within the list. |
| `.uk-active ` | Add this class to a list item to apply an active state to a menu item.                                           |

```html
<ul class="uk-nav">
    <li class="uk-active"><a href=""></a></li>
    <li><a href=""></a></li>
</ul>
```

```example
<div class="uk-width-1-2@s uk-width-2-5@m">
    <ul class="uk-nav uk-nav-default">
        <li class="uk-active"><a href="#">Active</a></li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>
```

**Note** By default, the nav has no styling. That's why it is important to add a modifier class. In our example we are using the `.uk-nav-default` class.

***

## Nested navs

Add the `.uk-parent` class to an item to turn it into a parent. Add the `.uk-nav-sub` class to a `<ul>` element inside the item to create the subnav.

```html
<ul class="uk-nav">
    <li class="uk-parent">
        <a href=""></a>
        <ul class="uk-nav-sub">
            <li><a href=""></a></li>
            <li>
                <a href=""></a>
                <ul>...</ul>
            </li>
        </ul>
    </li>
</ul>
```

```example
<div class="uk-width-1-2@s uk-width-2-5@m">
    <ul class="uk-nav uk-nav-default">
        <li class="uk-active"><a href="#">Active</a></li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li>
                    <a href="#">Sub item</a>
                    <ul>
                        <li><a href="#">Sub item</a></li>
                        <li><a href="#">Sub item</a></li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</div>
```


***

## Accordion

By default, child menu items are always visible. To apply an accordion effect, just add the `uk-nav` attribute to the main `<ul>`. Add the `.uk-nav-parent-icon` class to apply icons, indicating parent items.

**Note** The attribute automatically sets the `.uk-nav` class, so you don't have to apply it manually.

```html
<ul class="uk-nav-parent-icon" uk-nav>...</ul>
```

```example
<div class="uk-width-1-2@s uk-width-2-5@m">
    <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
        <li class="uk-active"><a href="#">Active</a></li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li>
                    <a href="#">Sub item</a>
                    <ul>
                        <li><a href="#">Sub item</a></li>
                        <li><a href="#">Sub item</a></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li><a href="#">Sub item</a></li>
            </ul>
        </li>
    </ul>
</div>
```

***

### Multiple open subnavs

When clicking on a parent item, an open one will close, allowing only one open nested list at a time. To allow multiple open subnavs, just add the `multiple: true` option to the attribute.

```html
<ul class="uk-nav-parent-icon" uk-nav="multiple: true">...</ul>
```

```example
<div class="uk-width-1-2@s uk-width-2-5@m">
    <ul class="uk-nav-default uk-nav-parent-icon" uk-nav="multiple: true">
        <li class="uk-active"><a href="#">Active</a></li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li>
                    <a href="#">Sub item</a>
                    <ul>
                        <li><a href="#">Sub item</a></li>
                        <li><a href="#">Sub item</a></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li><a href="#">Sub item</a></li>
            </ul>
        </li>
    </ul>
</div>
```

***

## Header & divider

Add one of the following classes to a list item to create a header or a divider between items.

| Element           | Description                                                                  |
|:------------------|:-----------------------------------------------------------------------------|
| `.uk-nav-header`  | Add this class to a `<li>` element to create a header.                       |
| `.uk-nav-divider` | Add this class to a `<li>` element to create a divider separating nav items. |

```html
<li class="uk-nav-header"></li>

<li class="uk-nav-divider"></li>
```

```example
<div class="uk-width-1-2@s uk-width-2-5@m">
    <ul class="uk-nav uk-nav-default">
        <li class="uk-nav-header">Header</li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
        <li class="uk-nav-divider"></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>
```

***

## Default modifier

Add the `.uk-nav-default` class to give the nav its default style. You can place the nav inside cards or anywhere else in your content.

```html
<ul class="uk-nav uk-nav-default">...</ul>
```

```example
<div class="uk-card uk-card-default uk-card-body uk-width-1-2@s">
    <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
        <li class="uk-active"><a href="#">Active</a></li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li><a href="#">Sub item</a></li>
            </ul>
        </li>
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
```

***

## Primary modifier

Add the `.uk-nav-primary` class to give the nav a more distinct styling, for example when placing it inside a modal.

```html
<ul class="uk-nav uk-nav-primary">...</ul>
```

```example
<div class="uk-width-1-2@s">
    <ul class="uk-nav-primary uk-nav-parent-icon" uk-nav>
        <li class="uk-active"><a href="#">Active</a></li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li><a href="#">Sub item</a></li>
            </ul>
        </li>
        <li class="uk-parent">
            <a href="#">Parent</a>
            <ul class="uk-nav-sub">
                <li><a href="#">Sub item</a></li>
                <li><a href="#">Sub item</a></li>
            </ul>
        </li>
        <li><a href="#">Item</a></li>
    </ul>
</div>
```

***

## Center modifier

Add the `.uk-nav-center` class to center nav items. This can be combined with the default and primary style modifiers.

```html
<ul class="uk-nav uk-nav-default uk-nav-center">...</ul>
```

```example
<div class="uk-card uk-card-default uk-card-body uk-width-1-2@s">
    <ul class="uk-nav-default uk-nav-center uk-nav-parent-icon" uk-nav>
        <li class="uk-active"><a href="#">Active</a></li>
        <li><a href="#">Item</a></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>
```

***

## Nav in Dropdown

Add the `.uk-dropdown-nav` class to place a nav inside a default dropdown from the [Dropdown component](dropdown.md).

```html
<div uk-dropdown>
    <ul class="uk-nav uk-dropdown-nav">...</ul>
</div>
```

```example
<button class="uk-button uk-button-default" type="button">Hover</button>
<div uk-dropdown>
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
```

***

## Nav in Navbar

Add the `.uk-navbar-dropdown-nav` class to place the nav inside a navbar dropdown from the [Navbar component](navbar.md).

```html
<div class="uk-navbar-dropdown">
    <ul class="uk-nav uk-navbar-dropdown-nav">...</ul>
</div>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li>
                <a href="#">Parent</a>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
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

    </div>
</nav>
```

***

## Nav in Off-canvas

A nav can be used inside an off-canvas from the [Off-canvas component](offcanvas.md). No modifier class needs to be added.

```example
<a href="#offcanvas-slide" class="uk-button uk-button-default" uk-toggle>Open</a>

<div id="offcanvas-slide" uk-offcanvas>
    <div class="uk-offcanvas-bar">

        <ul class="uk-nav uk-nav-default">
            <li class="uk-active"><a href="#">Active</a></li>
            <li><a href="#">Item</a></li>
            <li class="uk-nav-header">Header</li>
            <li><a href="#">Item</a></li>
            <li><a href="#">Item</a></li>
            <li class="uk-nav-divider"></li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option        | Value        | Default        | Description                                                                       |
|:--------------|:-------------|:---------------|:----------------------------------------------------------------------------------|
| `targets`     | CSS selector | `> .uk-parent` | The element(s) to toggle.                                                         |
| `toggle `     | CSS selector | `> a`          | The toggle element(s).                                                            |
| `content`     | CSS selector | `> ul`         | The content element(s).                                                           |
| `collapsible` | Boolean      | `true`         | Allow all items to be closed.                                                     |
| `multiple`    | Boolean      | `false`        | Allow multiple open items.                                                        |
| `transition`  | String       | `ease`         | The transition to use.                                                            |
| `animation`   | String       | `true`         | The space separated names of animations to use. Comma separate for animation out. |
| `duration`    | Number       | `200`          | The animation duration in milliseconds.                                           |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.nav(element, options);
```

### Methods

The following methods are available for the component:

#### Toggle

```js
UIkit.nav(element).toggle(index, animate);
```

Toggles the content pane.

| Name      | Type                  | Default | Description                                  |
|:----------|:----------------------|:--------|:---------------------------------------------|
| `index`   | String, Integer, Node | 0       | Nav pane to toggle. 0 based index.           |
| `animate` | Boolean               | true    | Suppress opening animation by passing false. |
