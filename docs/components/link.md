# Link

<p class="uk-text-lead">Define different styles to integrate links into specific content.</p>

## Link muted

The [Base component](base.md) determines the default link color. If you want the link to a apply a muted style instead, just add the `.uk-link-muted` class to the anchor element. You can also add the class to a parent element and it will be applied to all `<a>` elements inside it.

```html
<a class="uk-link-muted" href=""></a>
```

```example
<a class="uk-link-muted" href="#">Link</a>

<p class="uk-link-muted">Lorem ipsum <a href="#">dolor sit</a> amet, consectetur adipiscing elit, sed do <a href="#">eiusmod</a> tempor incididunt ut <a href="#">labore et</a> dolore magna aliqua.</p>
```

***

## Link text

To make a link appear like body text and apply a hover effect, add the `.uk-link-text` class to the anchor element. You can also add the class to a parent element and it will be applied to all `<a>` elements inside it. This is useful for link lists in the page footer.

```html
<a class="uk-link-text" href=""></a>
```

```example
<ul class="uk-list uk-link-text">
    <li><a href="#">Link</a></li>
    <li><a href="#">Link</a></li>
    <li><a href="#">Link</a></li>
</ul>
```

***

## Link heading

To style a link inside a heading element, add the `.uk-link-heading` class to the anchor element.

```html
<h3><a class="uk-link-heading" href=""></a></h3>
```

```example
<h3><a class="uk-link-heading" href="">Heading</a></h3>
```

***

## Link reset

To reset a link's color, so that it inherits the color from its parent, add the `.uk-link-reset` class. There won't be any hover effect at all. This is useful for links inside heading elements. You can also add the class to a parent element and it will be applied to all `<a>` elements inside it.

```example
<a class="uk-link-reset" href="#">Link</a>

<h3><a class="uk-link-reset" href="">Heading</a></h3>
```