# Table

<p class="uk-text-lead">Easily create nice looking tables, which come in different styles.</p>

## Usage

To apply this component, add the `.uk-table` class to a `<table>` element.

```html
<table class="uk-table">
    <caption></caption>
    <thead>
        <tr>
            <th></th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <td></td>
        </tr>
    </tfoot>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>
```

```example
<table class="uk-table">
    <caption>Table Caption</caption>
    <thead>
        <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <td>Table Footer</td>
            <td>Table Footer</td>
            <td>Table Footer</td>
        </tr>
    </tfoot>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

***

## Divider modifier

Add the `.uk-table-divider` class to display a divider between table rows.

```html
<table class="uk-table uk-table-divider">...</table>
```

```example
<table class="uk-table uk-table-divider">
    <thead>
        <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

***

## Striped modifier

Add zebra-striping to a table by adding the `.uk-table-striped` class.

```html
<table class="uk-table uk-table-striped">...</table>
```

```example
<table class="uk-table uk-table-striped">
    <thead>
        <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

***

## Hover modifier

Add the `.uk-table-hover` class to display a hover state on table rows.

```html
<table class="uk-table uk-table-hover">...</table>
```

```example
<table class="uk-table uk-table-hover uk-table-divider">
    <thead>
        <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

***

## Size modifiers

Add the `.uk-table-small` or `.uk-table-large` class to a table to make it smaller or larger.

```html
<table class="uk-table uk-table-small">...</table>
```

```example
<table class="uk-table uk-table-small uk-table-divider">
    <thead>
        <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

***

## Justify modifier

To remove the outer padding of the first and last column so that they are flush with the table, add the `.uk-table-justify` class.

```html
<table class="uk-table uk-table-justify">...</table>
```

```example
<table class="uk-table uk-table-justify uk-table-divider">
    <thead>
        <tr>
            <th class="uk-width-small">Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
            <td><button class="uk-button uk-button-default" type="button">Button</button></td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
            <td><button class="uk-button uk-button-default" type="button">Button</button></td>
        </tr>
    </tbody>
</table>
```

***


## Alignment modifier

To vertically center table content, just add the `.uk-table-middle` class. You can also apply the class to `<tr>` or `<td>` elements for a more specific selection.

```html
<table class="uk-table uk-table-middle">...</table>
```

```example
<table class="uk-table uk-table-middle uk-table-divider">
    <thead>
        <tr>
            <th class="uk-width-small">Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
            <td><button class="uk-button uk-button-default" type="button">Button</button></td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
            <td><button class="uk-button uk-button-default" type="button">Button</button></td>
        </tr>
    </tbody>
</table>
```

***

## Responsive table

If your table happens to be wider than its container element or would eventually get too big on a specific viewport width, just  wrap it inside a `<div>` element and add the `.uk-overflow-auto` class from the [Utility component](utility.md#overflow). This creates a container that provides a horizontal scrollbar whenever the elements inside it are wider than the container itself.

```html
<div class="uk-overflow-auto">
    <table class="uk-table">...</table>
</div>
```

```example
<div class="uk-overflow-auto">
    <table class="uk-table uk-table-small uk-table-divider">
        <thead>
            <tr>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
                <th>Table Heading</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
            </tr>
            <tr>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
            </tr>
            <tr>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
                <td>Table Data</td>
            </tr>
        </tbody>
    </table>
</div>
```

***

### Stack on small viewports

If you want table columns to stack on small screens, add the `.uk-table-responsive` class.

```html
<table class="uk-table uk-table-responsive">...</table>
```

```example
<table class="uk-table uk-table-responsive uk-table-divider">
    <thead>
        <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
            <th>Table Heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

**Note** Resize the browser window to see the columns stack.

***

## Column width modifier

To modify the column width or content, you can use one of the following classes. You just need to add this class to one of the column cells. It's recommended on the header cell.

| Class               | Description                                                                                                                |
|:--------------------|:---------------------------------------------------------------------------------------------------------------------------|
| `.uk-table-shrink ` | Add this class to a `<th>` or `<td>` element to reduce the column width to fit its content.                                |
| `.uk-table-expand`  | Add this class to a `<th>` or `<td>` element to expand the column width to fill the remaining space and apply a min-width. |
| `.uk-width-*`       | Add one of these classes from the [Width component](width.md) to a `<th>` or `<td>` element to modify the column width.    |

```html
<th class="uk-table-shrink"></th>
```

```example
<table class="uk-table uk-table-divider">
    <thead>
        <tr>
            <th class="uk-table-shrink">Shrink</th>
            <th class="uk-table-expand">Expand</th>
            <th class="uk-width-small">Width Small</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
        <tr>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
        </tr>
    </tbody>
</table>
```

***

## Utilities

To optimize the display of table cells and their specific content, you can add one of the following classes.

| Class                 | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| `.uk-table-link`      | To link an entire cell, add this class to a `<th>`or `<td>` element and insert an `<a>`element. Add the `.uk-link-reset`class from the [Link component](link.md) to reset the default link styling. |
| `.uk-preserve-width ` | Since images are responsive by default in UIkit, using an image inside a table cell with the `.uk-table-shrink` class would reduce the image width to 0. To prevent this behavior, add the `.uk-preserve-width` class from the [Base component](base.md) to the `<img>` element. |
| `.uk-text-truncate`   | When applying a fixed width to a table cell, you might want to add this class from the [Text component](text.md) to the `<td>` element to truncate the text. |
| `.uk-text-nowrap`     | Add this class from the [Text component](text.md) to keep text from wrapping, for example when using the `.uk-table-shrink` class. |

```html
<!-- Table link -->
<td class="uk-table-link">
    <a class="uk-link-reset" href=""></a>
</td>

<!-- Preserve width -->
<td>
    <img class="uk-preserve-width">
</td>

<!-- Text truncate -->
<td class="uk-text-truncate"></td>

<!-- Text nowrap -->
<td class="uk-text-nowrap"></td>
```

```example
<div class="uk-overflow-auto">
    <table class="uk-table uk-table-hover uk-table-middle uk-table-divider">
        <thead>
            <tr>
                <th class="uk-table-shrink"></th>
                <th class="uk-table-shrink">Preserve</th>
                <th class="uk-table-expand">Expand + Link</th>
                <th class="uk-width-small">Truncate</th>
                <th class="uk-table-shrink uk-text-nowrap">Shrink + Nowrap</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input class="uk-checkbox" type="checkbox"></td>
                <td><img class="uk-preserve-width uk-border-circle" src="images/avatar.jpg" width="40" alt=""></td>
                <td class="uk-table-link">
                    <a class="uk-link-reset" href="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</a>
                </td>
                <td class="uk-text-truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</td>
                <td class="uk-text-nowrap">Lorem ipsum dolor</td>
            </tr>
            <tr>
                <td><input class="uk-checkbox" type="checkbox"></td>
                <td><img class="uk-preserve-width uk-border-circle" src="images/avatar.jpg" width="40" alt=""></td>
                <td class="uk-table-link">
                    <a class="uk-link-reset" href="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</a>
                </td>
                <td class="uk-text-truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</td>
                <td class="uk-text-nowrap">Lorem ipsum dolor</td>
            </tr>
            <tr>
                <td><input class="uk-checkbox" type="checkbox"></td>
                <td><img class="uk-preserve-width uk-border-circle" src="images/avatar.jpg" width="40" alt=""></td>
                <td class="uk-table-link">
                    <a class="uk-link-reset" href="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</a>
                </td>
                <td class="uk-text-truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</td>
                <td class="uk-text-nowrap">Lorem ipsum dolor</td>
            </tr>
            <tr>
                <td><input class="uk-checkbox" type="checkbox"></td>
                <td><img class="uk-preserve-width uk-border-circle" src="images/avatar.jpg" width="40" alt=""></td>
                <td class="uk-table-link">
                    <a class="uk-link-reset" href="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</a>
                </td>
                <td class="uk-text-truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</td>
                <td class="uk-text-nowrap">Lorem ipsum dolor</td>
            </tr>
        </tbody>
    </table>
</div>
```