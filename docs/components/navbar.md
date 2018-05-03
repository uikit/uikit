# Navbar

<p class="uk-text-lead">Create a navigation bar that can be used for your main site navigation.</p>

## Usage

The Navbar component consists of a navbar container, the navbar itself and one or more navigations.

| Element                | Description                                                                                                    |
|:-----------------------|:---------------------------------------------------------------------------------------------------------------|
| `uk-navbar`            | Add this attribute to a `<nav>` element to define the Navbar component.                                        |
| `.uk-navbar-container` | Add this class to the same `<nav>` element or a parent element to add the navbar background style.             |
| `.uk-navbar-left`<br> `.uk-navbar-center`<br>  `.uk-navbar-right` | Add one of these classes to a `<div>` element to align the navigation. |
| `.uk-navbar-nav`       | Add this class to a `<ul>` element to create the navigation. Use `<a>` elements as menu items within the list. |
| `.uk-parent`           | Add this class to indicate a parent menu item.                                                                 |
| `.uk-active`           | Add this class to indicate an active menu item.                                                                |

```html
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href=""></a></li>
            <li class="uk-parent"><a href=""></a></li>
            <li><a href=""></a></li>
        </ul>
    </div>
</nav>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li>
                <a href="#">Parent</a>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-active"><a href="#">Active</a></li>
                        <li><a href="#">Item</a></li>
                        <li><a href="#">Item</a></li>
                    </ul>
                </div>
            </li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
</nav>
```

***

## Multiple navigations

You can place more than one navigation inside a navbar container. That way you can have a left aligned, a centered and a right aligned navigation inside the same navbar.

```html
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">...</div>
    <div class="uk-navbar-center">...</div>
    <div class="uk-navbar-right">...</div>
</nav>
```

```example
<nav class="uk-navbar-container" uk-navbar>

    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li>
                <a href="#">Parent</a>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-active"><a href="#">Active</a></li>
                        <li><a href="#">Item</a></li>
                        <li><a href="#">Item</a></li>
                    </ul>
                </div>
            </li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>

    <div class="uk-navbar-right">

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li>
                <a href="#">Parent</a>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-active"><a href="#">Active</a></li>
                        <li><a href="#">Item</a></li>
                        <li><a href="#">Item</a></li>
                    </ul>
                </div>
            </li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>

</nav>
```

***

## Click mode

A parent item inside the navbar can be enabled by either hovering or clicking the toggle. Just add the `mode: click` option to the `uk-navbar` attribute.

```html
<nav class="uk-navbar-container" uk-navbar="mode: click">...</nav>
```

```example
<nav class="uk-navbar-container uk-margin" uk-navbar="mode: click">
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li>
                <a href="#">Parent</a>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-active"><a href="#">Active</a></li>
                        <li><a href="#">Item</a></li>
                        <li><a href="#">Item</a></li>
                    </ul>
                </div>
            </li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
</nav>
```

***

## Transparent modifier

When using an image or colored background for the hero section of your website, you might want to turn the navbar transparent. Just add the `.uk-navbar-transparent` class to the `<nav>` element. If necessary, add the `.uk-light` or `.uk-dark` class from the [Inverse component](inverse.md) to adjust the navbar's color.

```html
<nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>...</nav>
```

```example
<div class="uk-position-relative">
    <img src="../docs/images/light.jpg" alt="">
    <div class="uk-position-top">
        <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
            <div class="uk-navbar-left">
                <ul class="uk-navbar-nav">
                    <li class="uk-active"><a href="#">Active</a></li>
                    <li><a href="#">Item</a></li>
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
    </div>
</div>
```

***

## Subtitle

To define a subtitle, create a `<div>` element inside an item's `<a>` element. Add the `.uk-navbar-subtitle` class to another `<div>` element.

```html
<li>
    <a href="">
        <div>
            ...
            <div class="uk-navbar-subtitle"></div>
        </div>
    </a>
</li>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li class="uk-active">
                <a href="#">
                    <div>
                        Active
                        <div class="uk-navbar-subtitle">Subtitle</div>
                    </div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div>
                        Parent
                        <div class="uk-navbar-subtitle">Subtitle</div>
                    </div>
                </a>
                <div class="uk-navbar-dropdown">
                    <ul class="uk-nav uk-navbar-dropdown-nav">
                        <li class="uk-active"><a href="#">Active</a></li>
                        <li><a href="#">Item</a></li>
                        <li><a href="#">Item</a></li>
                    </ul>
                </div>
            </li>
            <li>
                <a href="#">
                    <div>
                        Item
                        <div class="uk-navbar-subtitle">Subtitle</div>
                    </div>
                </a>
            </li>
        </ul>

    </div>
</nav>
```

***

## Content item

You can also add custom content to the navbar, like text, icons, buttons or forms. Add the `.uk-navbar-item` class to a `<div>` element that serves as a container for your content

```html
<div class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <a href="" class="uk-navbar-item uk-logo"></a>
        <ul class="uk-navbar-nav">...</ul>
        <div class="uk-navbar-item">...</div>
    </div>
</div>
```

Add the `.uk-logo` class from the [Utility component](utility.md) to an `<a>` or `<div>` element to indicate your brand.

```example
<nav class="uk-navbar-container uk-margin" uk-navbar>
    <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">Logo</a>

        <ul class="uk-navbar-nav">
            <li>
                <a href="#">
                    <span class="uk-icon uk-margin-small-right" uk-icon="icon: star"></span>
                    Features
                </a>
            </li>
        </ul>

        <div class="uk-navbar-item">
            <div>Some <a href="#">Link</a></div>
        </div>

        <div class="uk-navbar-item">
            <form action="javascript:void(0)">
                <input class="uk-input uk-form-width-small" type="text" placeholder="Input">
                <button class="uk-button uk-button-default">Button</button>
            </form>
        </div>

    </div>
</nav>
```

***

## Centered logo

You can create a split menu with a centered logo. Just add the `uk-navbar-center-left` class to one navbar and the `uk-navbar-center-right` class to another within the same navbar container. This will keep your logo centered and align the menus to the left and right.

**Note** An extra `div` element is required to support IE 11.

```html
<div class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-center">
        <div class="uk-navbar-center-left"><div>...</div></div>
        <a href="" class="uk-navbar-item uk-logo"></a>
        <div class="uk-navbar-center-right"><div>...</div></div>
    </div>
</div>
```

```example
<nav class="uk-navbar-container uk-margin" uk-navbar>
    <div class="uk-navbar-center">

        <div class="uk-navbar-center-left"><div>
            <ul class="uk-navbar-nav">
                <li class="uk-active"><a href="#">Active</a></li>
                <li>
                    <a href="#">Parent</a>
                    <div class="uk-navbar-dropdown">
                        <ul class="uk-nav uk-navbar-dropdown-nav">
                            <li class="uk-active"><a href="#">Active</a></li>
                            <li><a href="#">Item</a></li>
                            <li><a href="#">Item</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div></div>
        <a class="uk-navbar-item uk-logo" href="#">Logo</a>
        <div class="uk-navbar-center-right"><div>
            <ul class="uk-navbar-nav">
                <li><a href="#">Item</a></li>
            </ul>
        </div></div>

    </div>
</nav>
```


***

## Toggle item

Add the `.uk-navbar-toggle` class and the `uk-navbar-toggle-icon` attribute to an `<a>` or `<div>` element to create an icon as a toggle. By default, there is no JavaScript attached to the toggle. As an example, you can add an off-canvas navigation from the [Off-canvas component](offcanvas.md) or a modal from the [Modal component](modal.md).

```html
<div class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <a class="uk-navbar-toggle" uk-navbar-toggle-icon href=""></a>
    </div>
</div>
```

```example
<nav class="uk-navbar uk-navbar-container uk-margin">
    <div class="uk-navbar-left">
        <a class="uk-navbar-toggle" uk-navbar-toggle-icon href="#"></a>
    </div>
</nav>

<nav class="uk-navbar uk-navbar-container uk-margin">
    <div class="uk-navbar-left">
        <a class="uk-navbar-toggle" href="#">
            <span uk-navbar-toggle-icon></span> <span class="uk-margin-small-left">Menu</span>
        </a>
    </div>
</nav>
```

***

## Dropdowns

A navbar can contain a dropdown from the [Dropdown component](dropdown.md). Just add the `.uk-navbar-dropdown` modifier to the dropdown, so it fits perfectly into the navbar's styling. Add the `.uk-navbar-dropdown-nav` class to navs inside the dropdown.

```html
<ul class="uk-navbar-nav">
    <li>
        <a href=""></a>
        <div class="uk-navbar-dropdown">
            <ul class="uk-nav uk-navbar-dropdown-nav">...</ul>
        </div>
    </li>
</ul>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
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
            <li><a href="#">Item</a></li>
        </ul>

    </div>
    <div class="uk-navbar-right">

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

### Multiple columns

The [Dropdown component](dropdown.md) allows you arrange the dropdown content in columns. To accommodate up to five columns, you also need to add one of the following classes. Columns will stack, if they no longer fit into the container.

| Class                         | Description                                              |
|:------------------------------|:---------------------------------------------------------|
| `.uk-navbar-dropdown-width-2` | Add this class to double the dropdown's width.           |
| `.uk-navbar-dropdown-width-3` | Add this class to triple the dropdown's width.           |
| `.uk-navbar-dropdown-width-4` | Add this class to multiply the dropdown's width by four. |
| `.uk-navbar-dropdown-width-5` | Add this class to multiply the dropdown's width by five. |

```html
<div class="uk-navbar-dropdown uk-navbar-dropdown-width-2">
    <div class="uk-navbar-dropdown-grid uk-child-width-1-2" uk-grid>
        <div>
            <ul class="uk-nav uk-navbar-dropdown-nav">...</ul>
        </div>
        <div>...</div>
    </div>
</div>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li>
                <a href="#">Two Columns</a>
                <div class="uk-navbar-dropdown uk-navbar-dropdown-width-2">
                    <div class="uk-navbar-dropdown-grid uk-child-width-1-2" uk-grid>
                        <div>
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
                        <div>
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
                    </div>
                </div>
            </li>
        </ul>

    </div>

</nav>
```

***

### Boundary alignment

Dropdowns can be aligned to the navbar's boundary. Just append the `boundary-align: true` parameter to the `uk-navbar` attribute. Add the `align: left`, `align: center` or `align: right` option to change the alignment. By default, dropdowns are aligned to the left.

```html
<nav class="uk-navbar-container" uk-navbar="boundary-align: true; align: center;">...</nav>
```

```example
<nav class="uk-navbar-container" uk-navbar="boundary-align: true; align: center;">
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li>
                <a href="#">Item</a>
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
            <li>
                <a href="#">Item</a>
                <div class="uk-navbar-dropdown uk-navbar-dropdown-width-2">
                    <div class="uk-navbar-dropdown-grid uk-child-width-1-2" uk-grid>
                        <div>
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
                        <div>
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
                    </div>
                </div>
            </li>
            <li>
                <a href="#">Item</a>
                <div class="uk-navbar-dropdown uk-navbar-dropdown-width-3">
                    <div class="uk-navbar-dropdown-grid uk-child-width-1-3" uk-grid>
                        <div>
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
                        <div>
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
                        <div>
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
                    </div>
                </div>
            </li>
        </ul>

    </div>

    <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">
            <li>
                <a href="#">Item</a>
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

### Justify

To justify a dropdown, use the [Drop component](drop.md) and its position feature. In the following example it is aligned to the boundary of the parent navbar.

```html
<div class="uk-navbar-dropdown" uk-drop="boundary: .parent; boundary-align: true; pos: bottom-justify;">...</div>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
            <li>
                <a href="#">Item</a>
                <div class="uk-navbar-dropdown" uk-drop="boundary: !nav; boundary-align: true; pos: bottom-justify;">
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
           <li>
               <a href="#">Item</a>
               <div class="uk-navbar-dropdown" uk-drop="boundary: !nav; boundary-align: true; pos: bottom-justify;">
                   <div class="uk-navbar-dropdown-grid uk-child-width-1-2" uk-grid>
                       <div>
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
                       <div>
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
                   </div>
               </div>
           </li>
       </ul>

    </div>
</nav>
```

***

## Dropbar

A dropbar extends to the full width of the navbar and displays the dropdown without its default styling. To place dropdowns inside such a dropbar, add the `dropbar: true` option to the `uk-navbar`.

```html
<nav class="uk-navbar-container" uk-navbar="dropbar: true;">...</nav>
<div class="uk-navbar-dropbar"></div>
```

```example
<div class="uk-position-relative">

    <nav class="uk-navbar-container" uk-navbar="dropbar: true">

        <div class="uk-navbar-left">

            <ul class="uk-navbar-nav">
                <li>
                    <a href="#">Item</a>
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
                <li>
                    <a href="#">Item</a>
                    <div class="uk-navbar-dropdown uk-navbar-dropdown-width-2">
                        <div class="uk-navbar-dropdown-grid uk-child-width-1-2" uk-grid>
                            <div>
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
                            <div>
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
                        </div>
                    </div>
                </li>
            </ul>

        </div>

        <div class="uk-navbar-right">

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

    <div class="uk-navbar-dropbar"></div>

</div>
```

***

### Push

By default, the dropbar overlays the site content. Add the `dropbar-mode: push;` option, to push the content down instead.

```html
<nav class="uk-navbar-container" uk-navbar="dropbar: true; dropbar-mode: push">...</nav>
<div class="uk-navbar-dropbar"></div>
```

```example
<div class="uk-position-relative">

    <nav class="uk-navbar-container" uk-navbar="dropbar: true; dropbar-mode: push">

        <div class="uk-navbar-left">

            <ul class="uk-navbar-nav">
                <li>
                    <a href="#">Item</a>
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
                <li>
                    <a href="#">Item</a>
                    <div class="uk-navbar-dropdown uk-navbar-dropdown-width-2">
                        <div class="uk-navbar-dropdown-grid uk-child-width-1-2" uk-grid>
                            <div>
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
                            <div>
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
                        </div>
                    </div>
                </li>
            </ul>

        </div>

        <div class="uk-navbar-right">

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

    <div class="uk-navbar-dropbar"></div>

</div>
```

***

## Sticky Navbar


For a basic sticky navbar, wrap the navbar inside a container with the `uk-sticky` attribute from the [Sticky component](sticky.md).

The navbar itself has a modifier class `uk-navbar-sticky` that ensures an optimized styling for the sticky state (for example an additional box shadow). To let the sticky component dynamically add and remove that class, set `cls-active: uk-navbar-sticky`. To ensure that the class is added to the navbar container, set `sel-target: .uk-navbar-container`.

**Note** You can view more examples in the tests for the [Sticky Navbar](../assets/uikit/tests/sticky-navbar.html).

```html
<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
    <nav class="uk-navbar-container" uk-navbar>...</nav>
</div>
```

```example
<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
    <nav class="uk-navbar-container" uk-navbar style="position: relative; z-index: 980;">
        <div class="uk-navbar-left">

            <ul class="uk-navbar-nav">
                <li class="uk-active"><a href="#">Active</a></li>
                <li>
                    <a href="#">Parent</a>
                    <div class="uk-navbar-dropdown">
                        <ul class="uk-nav uk-navbar-dropdown-nav">
                            <li class="uk-active"><a href="#">Active</a></li>
                            <li><a href="#">Item</a></li>
                            <li><a href="#">Item</a></li>
                        </ul>
                    </div>
                </li>
                <li><a href="#">Item</a></li>
            </ul>

        </div>
    </nav>
</div>
```

Instead of using a Dropdown, you can show a Dropbar, which means that the subnavigation is displayed in full width below the navbar. Simply set `dropbar: true` inside the `uk-navbar` attribute.

```html
<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
    <nav class="uk-navbar-container" uk-navbar="dropbar: true;">...</nav>
</div>
```

```example
<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
    <nav class="uk-navbar-container" uk-navbar="dropbar: true;" style="position: relative; z-index: 980;">
        <div class="uk-navbar-left">

            <ul class="uk-navbar-nav">
                <li class="uk-active"><a href="#">Active</a></li>
                <li>
                    <a href="#">Parent</a>
                    <div class="uk-navbar-dropdown">
                        <ul class="uk-nav uk-navbar-dropdown-nav">
                            <li class="uk-active"><a href="#">Active</a></li>
                            <li><a href="#">Item</a></li>
                            <li><a href="#">Item</a></li>
                        </ul>
                    </div>
                </li>
                <li><a href="#">Item</a></li>
            </ul>

        </div>
    </nav>
</div>
```

***

### Transparent Sticky Navbar

When you use a [transparent navbar](navbar.md#transparent-modifier), your markup contains the `.uk-navbar-transparent` class together with `.uk-light` or `.uk-dark`. When the navbar is sticky, it is usually required to remove these classes and add them when the navbar returns to the non-sticky state. To do that, set `cls-inactive: uk-navbar-transparent uk-light`.

By default, the immediate toggling of classes does not look ideal. Instead, we can set `top: 200` to let the navbar disappear and then re-appear when the user has scrolled 200px past the navbar. In that case we can also define to have the navbar slide in with an animation, just set `animation: uk-animation-slide-top`.

```html
<div uk-sticky="animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-light; top: 200">
    <nav class="uk-navbar-container" uk-navbar>...</nav>
</div>
```

```example
<div class="uk-section-primary uk-preserve-color">

    <div uk-sticky="animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-light; top: 200">

        <nav class="uk-navbar-container">
            <div class="uk-container uk-container-expand">
                <div uk-navbar>

                    <ul class="uk-navbar-nav">
                        <li class="uk-active"><a href="#">Active</a></li>
                        <li>
                            <a href="#">Parent</a>
                            <div class="uk-navbar-dropdown">
                                <ul class="uk-nav uk-navbar-dropdown-nav">
                                    <li class="uk-active"><a href="#">Active</a></li>
                                    <li><a href="#">Item</a></li>
                                    <li><a href="#">Item</a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="#">Item</a></li>
                    </ul>

                </div>
            </div>
        </nav>
    </div>

    <div class="uk-section uk-light">
        <div class="uk-container">

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>

            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>

        </div>
    </div>

</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option           | Value        | Default        | Description                                                               |
|:-----------------|:-------------|:---------------|:--------------------------------------------------------------------------|
| `align`          | String       | `left`         | Dropdown alignment: `left`, `right`, `center`                             |
| `mode`           | String       | `click, hover` | Comma separated list of dropdown trigger behavior modes: `click`, `hover` |
| `delay-show`     | Number       | `0`            | Delay time in hover mode before a dropdown is shown in milliseconds.      |
| `delay-hide`     | Number       | `800`          | Delay time in hover mode before a dropdown is hidden in milliseconds.     |
| `boundary`       | CSS selector | `window`       | Referenced element to keep the dropdown's visibility.                     |
| `boundary-align` | Boolean      | `false`        | Align the dropdown to the boundary.                                       |
| `offset`         | Number       | `0`            | The offset of the dropdown container.                                     |
| `dropbar `       | Boolean      | `false`        | Enable or disable dropbar behavior.                                       |
| `dropbar-mode`   | String       | `slide`        | The mode in which the dropbar appears: `slide`, `push`                    |
| `duration`       | Number       | `200`          | The dropbar transition duration.                                          |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.navbar(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name         | Description                                                              |
|:-------------|:-------------------------------------------------------------------------|
| `beforeshow` | Fires before an item is shown. Can prevent showing by returning `false`. |
| `show`       | Fires after an item is shown.                                            |
| `shown`      | Fires after the item's show animation has completed.                     |
| `beforehide` | Fires before an item is hidden. Can prevent hiding by returning `false`. |
| `hide`       | Fires after an item's hide animation has started.                        |
| `hidden`     | Fires after an item is hidden.                                           |
