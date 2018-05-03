# Column

<p class="uk-text-lead">Display your content in multiple text columns without having to split it in several containers.</p>

## Usage

Add one of the `.uk-column-*` classes to an element to display its inline content in multiple columns.

| Class            | Description                           |
|:-----------------|:--------------------------------------|
| `.uk-column-1-2` | Display the content in two columns.   |
| `.uk-column-1-3` | Display the content in three columns. |
| `.uk-column-1-4` | Display the content in four columns.  |
| `.uk-column-1-5` | Display the content in five columns.  |
| `.uk-column-1-6` | Display the content in six columns.   |

```html
<div class="uk-column-1-2"></div>
```

```example
<div class="uk-column-1-2">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
</div>
```

***

## Responsive

UIkit provides a number of responsive column classes. Basically they work just like the usual column classes, except that they have suffixes that represent the breakpoint from which they come to effect.

| Class                                      | Description                                        |
|:-------------------------------------------|:---------------------------------------------------|
| `.uk-column-1-2@s` to `.uk-column-1-6@s`   | Only affects device widths of _640px_ and higher.  |
| `.uk-column-1-2@m` to `.uk-column-1-6@m`   | Only affects device widths of _960px_ and higher.  |
| `.uk-column-1-2@l` to `.uk-column-1-6@l`   | Only affects device widths of _1200px_ and higher. |
| `.uk-column-1-2@xl` to `.uk-column-1-6@xl` | Only affects device widths of _1600px_ and higher. |

```html
<div class="uk-column-1-2@s uk-column-1-3@m uk-column-1-4@l"></div>
```

```example
<div class="uk-column-1-2@s uk-column-1-3@m uk-column-1-4@l">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
</div>
```

***

## Divider modifier

To display a vertical line between columns, add the `.uk-column-divider` class.

```html
<div class="uk-column-1-2 uk-column-divider"></div>
```

```example
<div class="uk-column-1-2 uk-column-divider">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
</div>
```

***

## Span all columns

To have an inline element span the whole width of the columns, add the `.uk-column-span` class to the inner element.

```html
<div class="uk-column-1-2">
    ...
    <p class="uk-column-span"></p>
    ...
</div>
```

```example
<div class="uk-column-1-2 uk-column-divider">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

    <blockquote cite="#" class="uk-column-span">
        <p>All we have to decide is what to do with the time that is given us.</p>
        <footer>Gandalf in in <cite><a href="">The Fellowship of the Ring</a></cite></footer>
    </blockquote>

    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
</div>
```
