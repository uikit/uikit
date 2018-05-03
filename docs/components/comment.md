# Comment

<p class="uk-text-lead">Includes styles for comments, for example for a blog section on your site.</p>

## Usage

The Comment component consists of the comment itself, a comment header, including an avatar, a title and meta data, and a comment body.

| Class                | Description                                                                        |
|:---------------------|:-----------------------------------------------------------------------------------|
| `.uk-comment`        | Add this class to define the Comment component.                                    |
| `.uk-comment-body`   | Add this class to create a comment body.                                           |
| `.uk-comment-header` | Add this class to create a comment header.                                         |
| `.uk-comment-title`  | Add this class to a heading to create a comment title.                             |
| `.uk-comment-meta`   | Add this class to create meta data about your comment, e.g. a [subnav](subnav.md). |
| `.uk-comment-avatar` | Add this class to an `<img>` element to create an avatar for the comment author.   |


```html
<article class="uk-comment">
    <header class="uk-comment-header">
        <img class="uk-comment-avatar" src="" alt="">
        <h4 class="uk-comment-title"></h4>
        <ul class="uk-comment-meta uk-subnav"></ul>
    </header>
    <div class="uk-comment-body"></div>
</article>
```

```example
<article class="uk-comment">
    <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
        <div class="uk-width-auto">
            <img class="uk-comment-avatar" src="../docs/images/avatar.jpg" width="80" height="80" alt="">
        </div>
        <div class="uk-width-expand">
            <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Author</a></h4>
            <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                <li><a href="#">12 days ago</a></li>
                <li><a href="#">Reply</a></li>
            </ul>
        </div>
    </header>
    <div class="uk-comment-body">
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    </div>
</article>
```

***

## Primary modifier

To style a comment differently, for example to highlight it as the admin's comment, just add the `.uk-comment-primary` class.

```html
<article class="uk-comment uk-comment-primary">...</article>
```

```example
<article class="uk-comment uk-comment-primary">
    <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
        <div class="uk-width-auto">
            <img class="uk-comment-avatar" src="../docs/images/avatar.jpg" width="80" height="80" alt="">
        </div>
        <div class="uk-width-expand">
            <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Author</a></h4>
            <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                <li><a href="#">12 days ago</a></li>
                <li><a href="#">Reply</a></li>
            </ul>
        </div>
    </header>
    <div class="uk-comment-body">
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    </div>
</article>
```

***

## Lists

Add the `.uk-comment-list` class to a `<ul>` element to create a list of comments. You can nest any number of `<ul>` elements inside a comment list.

```html
<ul class="uk-comment-list">
    <li>
        <article class="uk-comment">...</article>
        <ul>
            <li>
                <article class="uk-comment">...</article>
            </li>
        </ul>
    </li>
</ul>
```

```example
<ul class="uk-comment-list">
    <li>
        <article class="uk-comment uk-visible-toggle">
            <header class="uk-comment-header uk-position-relative">
                <div class="uk-grid-medium uk-flex-middle" uk-grid>
                    <div class="uk-width-auto">
                        <img class="uk-comment-avatar" src="../docs/images/avatar.jpg" width="80" height="80" alt="">
                    </div>
                    <div class="uk-width-expand">
                        <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Author</a></h4>
                        <p class="uk-comment-meta uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p>
                    </div>
                </div>
                <div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Reply</a></div>
            </header>
            <div class="uk-comment-body">
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
            </div>
        </article>
        <ul>
            <li>
                <article class="uk-comment uk-comment-primary uk-visible-toggle">
                    <header class="uk-comment-header uk-position-relative">
                        <div class="uk-grid-medium uk-flex-middle" uk-grid>
                            <div class="uk-width-auto">
                                <img class="uk-comment-avatar" src="../docs/images/avatar.jpg" width="80" height="80" alt="">
                            </div>
                            <div class="uk-width-expand">
                                <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Author</a></h4>
                                <p class="uk-comment-meta uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p>
                            </div>
                        </div>
                        <div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Reply</a></div>
                    </header>
                    <div class="uk-comment-body">
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    </div>
                </article>
            </li>
            <li>
                <article class="uk-comment uk-visible-toggle">
                    <header class="uk-comment-header uk-position-relative">
                        <div class="uk-grid-medium uk-flex-middle" uk-grid>
                            <div class="uk-width-auto">
                                <img class="uk-comment-avatar" src="../docs/images/avatar.jpg" width="80" height="80" alt="">
                            </div>
                            <div class="uk-width-expand">
                                <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Author</a></h4>
                                <p class="uk-comment-meta uk-margin-remove-top"><a class="uk-link-reset" href="#">12 days ago</a></p>
                            </div>
                        </div>
                        <div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Reply</a></div>
                    </header>
                    <div class="uk-comment-body">
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    </div>
                </article>
            </li>
        </ul>
    </li>
</ul>
```
