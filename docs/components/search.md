# Search

<p class="uk-text-lead">Easily create a nice looking search.</p>

## Usage

The Search component consists of a search form and the search input itself.

| Class/Attribute    | Description                                                           |
|:-------------------|:----------------------------------------------------------------------|
| `.uk-search`       | Add this class to a container element to define the Search component. |
| `.uk-search-input` | Add this class to an `<input>` element to create the search field.    |

```html
<form class="uk-search">
    <input class="uk-search-input" type="search" placeholder="">
</form>
```

By default, the search has no additional styling. In this example we are using the `.uk-search-default` modifier.

```example
<form class="uk-search uk-search-default">
    <input class="uk-search-input" type="search" placeholder="Search...">
</form>
```

***

## Search icon

To create a search icon, add the `uk-search-icon` attribute to a `<span>` element. To change the alignment, add the `.uk-search-icon-flip` class.

```html
<form class="uk-search uk-search-default">
    <span uk-search-icon></span>
    <input class="uk-search-input" type="search" placeholder="">
</form>
```

```example
<div class="uk-margin">
    <form class="uk-search uk-search-default">
        <span uk-search-icon></span>
        <input class="uk-search-input" type="search" placeholder="Search...">
    </form>
</div>

<div class="uk-margin">
    <form class="uk-search uk-search-default">
        <span class="uk-search-icon-flip" uk-search-icon></span>
        <input class="uk-search-input" type="search" placeholder="Search...">
    </form>
</div>
```

***

### Clickable

To enable an action, use an `<a>` or `<button>` element to create the icon.

```html
<form class="uk-search uk-search-default">
    <a href="" uk-search-icon></a>
    <input class="uk-search-input" type="search" placeholder="">
</form>
```

```example
<div class="uk-margin">
    <form class="uk-search uk-search-default">
        <a href="" uk-search-icon></a>
        <input class="uk-search-input" type="search" placeholder="Search...">
    </form>
</div>

<div class="uk-margin">
    <form class="uk-search uk-search-default">
        <a href="" class="uk-search-icon-flip" uk-search-icon></a>
        <input class="uk-search-input" type="search" placeholder="Search...">
    </form>
</div>
```

***

## Default modifier

To apply the default search styling, add the `.uk-search-default` class.

```html
<form class="uk-search uk-search-default">...</form>
```

```example
<form class="uk-search uk-search-default">
    <span uk-search-icon></span>
    <input class="uk-search-input" type="search" placeholder="Search...">
</form>
```

***

## Large modifier

To increase the size of the search, for example when creating an overlay search, add the `.uk-search-large` class.

```html
<form class="uk-search uk-search-large">...</form>
```

```example
<form class="uk-search uk-search-large">
    <span uk-search-icon></span>
    <input class="uk-search-input" type="search" placeholder="Search...">
</form>
```

***

## Navbar modifier

A search can be used inside a navbar from the [Navbar component](navbar.md). Just add the `.uk-search-navbar` class.

```html
<form class="uk-search uk-search-navbar">...</form>
```

```example
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">

        <div class="uk-navbar-item">
            <form class="uk-search uk-search-navbar">
                <span uk-search-icon></span>
                <input class="uk-search-input" type="search" placeholder="Search...">
            </form>
        </div>

    </div>
</nav>
```

***

## Toggle

To apply a hover state to the search icon when using an `<a>` or `<button>` element, add the `.uk-search-toggle` class. To create the search icon itself, add the `uk-search-icon` attribute.

```html
<a class="uk-search-toggle" href="" uk-search-icon></a>
```

```example
<a class="uk-search-toggle" href="" uk-search-icon></a>
```

***

## Search in navbar

The search icon can be used as a toggle to open the search inside a navbar – as an overlay, drop or dropdown – or outside in a modal. Just add the `.uk-navbar-toggle` class to the icon.

```html
<div class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <a class="uk-navbar-toggle" uk-search-icon uk-toggle href=""></a>
    </div>
</div>
```

### Overlay

```example
<nav class="uk-navbar-container uk-margin" uk-navbar>

    <div class="nav-overlay uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">Logo</a>

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>

    <div class="nav-overlay uk-navbar-right">

        <a class="uk-navbar-toggle" uk-search-icon uk-toggle="target: .nav-overlay; animation: uk-animation-fade" href="#"></a>

    </div>

    <div class="nav-overlay uk-navbar-left uk-flex-1" hidden>

        <div class="uk-navbar-item uk-width-expand">
            <form class="uk-search uk-search-navbar uk-width-1-1">
                <input class="uk-search-input" type="search" placeholder="Search..." autofocus>
            </form>
        </div>

        <a class="uk-navbar-toggle" uk-close uk-toggle="target: .nav-overlay; animation: uk-animation-fade" href="#"></a>

    </div>

</nav>
```

### Drop

```example
<nav class="uk-navbar-container uk-margin" uk-navbar>
    <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">Logo</a>

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
    <div class="uk-navbar-right">

        <div>
            <a class="uk-navbar-toggle" uk-search-icon href="#"></a>
            <div class="uk-drop" uk-drop="mode: click; pos: left-center; offset: 0">
                <form class="uk-search uk-search-navbar uk-width-1-1">
                    <input class="uk-search-input" type="search" placeholder="Search..." autofocus>
                </form>
            </div>
        </div>

    </div>
</nav>
```

### Dropdown

```example
<nav class="uk-navbar-container uk-margin" uk-navbar>
    <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">Logo</a>

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
    <div class="uk-navbar-right">

        <div>
            <a class="uk-navbar-toggle" href="#" uk-search-icon></a>
            <div class="uk-navbar-dropdown" uk-drop="mode: click; cls-drop: uk-navbar-dropdown; boundary: !nav">

                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-expand">
                        <form class="uk-search uk-search-navbar uk-width-1-1">
                            <input class="uk-search-input" type="search" placeholder="Search..." autofocus>
                        </form>
                    </div>
                    <div class="uk-width-auto">
                        <a class="uk-navbar-dropdown-close" href="#" uk-close></a>
                    </div>
                </div>

            </div>
        </div>

    </div>
</nav>
```

### Modal

```example
<nav class="uk-navbar uk-navbar-container uk-margin">
    <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">Logo</a>

        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="#">Active</a></li>
            <li><a href="#">Item</a></li>
        </ul>

    </div>
    <div class="uk-navbar-right">

        <a class="uk-navbar-toggle" href="#modal-full" uk-search-icon uk-toggle></a>

    </div>
</nav>

<div id="modal-full" class="uk-modal-full uk-modal" uk-modal>
    <div class="uk-modal-dialog uk-flex uk-flex-center uk-flex-middle" uk-height-viewport>
        <button class="uk-modal-close-full" type="button" uk-close></button>
        <form class="uk-search uk-search-large">
            <input class="uk-search-input uk-text-center" type="search" placeholder="Search..." autofocus>
        </form>
    </div>
</div>
```
