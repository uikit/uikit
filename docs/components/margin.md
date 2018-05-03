# Margin

<p class="uk-text-lead">A collection of utility classes to add spacing between elements.</p>

## Usage

Add one or more of the following classes to any element to create the same vertical and/or horizontal margin that a paragraph usually has.

| Class               | Description                                                                      |
|:--------------------|:---------------------------------------------------------------------------------|
| `.uk-margin`        | Adds top margin, if it is preceded by another element, and always bottom margin. |
| `.uk-margin-top`    | Adds top margin.                                                                 |
| `.uk-margin-bottom` | Adds bottom margin.                                                              |
| `.uk-margin-left`   | Adds left margin.                                                                |
| `.uk-margin-right`  | Adds right margin.                                                               |

```html
<div class="uk-margin"></div>
```

```example
<div class="uk-margin uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
<div class="uk-margin uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
```

***

## Small margin

Add one of the following classes to add small spacing to block elements.

| Class                     | Description                                                                            |
|:--------------------------|:---------------------------------------------------------------------------------------|
| `.uk-margin-small`        | Adds small top margin, if it is preceded by another element, and always bottom margin. |
| `.uk-margin-small-top`    | Adds small top margin.                                                                 |
| `.uk-margin-small-bottom` | Adds small bottom margin.                                                              |
| `.uk-margin-small-left`   | Adds small left margin.                                                                |
| `.uk-margin-small-right`  | Adds small right margin.                                                               |

```example
<div class="uk-margin-small uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
<div class="uk-margin-small uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
```

***

## Medium margin

Add one of the following classes to add medium spacing to block elements.

| Class                      | Description                                                                             |
|:---------------------------|:----------------------------------------------------------------------------------------|
| `.uk-margin-medium`        | Adds medium top margin, if it is preceded by another element, and always bottom margin. |
| `.uk-margin-medium-top`    | Adds medium top margin.                                                                 |
| `.uk-margin-medium-bottom` | Adds medium bottom margin.                                                              |
| `.uk-margin-medium-left`   | Adds medium left margin.                                                                |
| `.uk-margin-medium-right`  | Adds medium right margin.                                                               |

```example
<div class="uk-margin-medium uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
<div class="uk-margin-medium uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
```

***

## Large margin

Add one of the following classes to add large spacing to block elements.

| Class                     | Description                                                                        |
|:--------------------------|:-----------------------------------------------------------------------------------|
| `.uk-margin-large`        | Adds large margin, if it is preceded by another element, and always bottom margin. |
| `.uk-margin-large-top`    | Adds large top margin.                                                             |
| `.uk-margin-large-bottom` | Adds large bottom margin.                                                          |
| `.uk-margin-large-left`   | Adds large left margin.                                                            |
| `.uk-margin-large-right`  | Adds large right margin.                                                           |

```example
<div class="uk-margin-large uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
<div class="uk-margin-large uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
```

***

## X-Large margin

Add one of the following classes to add very large spacing to block elements.

| Class                      | Description                                                                         |
|:---------------------------|:------------------------------------------------------------------------------------|
| `.uk-margin-xlarge`        | Adds larger margin, if it is preceded by another element, and always bottom margin. |
| `.uk-margin-xlarge-top`    | Adds larger top margin.                                                             |
| `.uk-margin-xlarge-bottom` | Adds larger bottom margin.                                                          |
| `.uk-margin-xlarge-left`   | Adds larger left margin.                                                            |
| `.uk-margin-xlarge-right`  | Adds larger right margin.                                                           |

```example
<div class="uk-margin-xlarge uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
<div class="uk-margin-xlarge uk-card uk-card-default uk-card-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
```

***

## Remove margin

Add one of the following classes to remove margin from block elements.

| Class                        | Description                                                |
|:-----------------------------|:-----------------------------------------------------------|
| `.uk-margin-remove`          | Removes all margins.                                       |
| `.uk-margin-remove-top`      | Removes top margin.                                        |
| `.uk-margin-remove-bottom`   | Removes bottom margin.                                     |
| `.uk-margin-remove-left`     | Removes left margin.                                       |
| `.uk-margin-remove-right`    | Removes right margin.                                      |
| `.uk-margin-remove-vertical` | Removes all vertical margins.                              |
| `.uk-margin-remove-adjacent` | Removes the top margin of the directly succeeding element. |

```html
<h1 class="uk-margin-remove"></h1>
```

***

## Auto margin

Add one of the following classes to set auto margin. This can be useful to center or otherwise align block elements with a fixed width as well as flex elements.

| Class                      | Description                                                                         |
|:---------------------------|:------------------------------------------------------------------------------------|
| `.uk-margin-auto`          | Sets left and right margin to auto, horizontally centering block and flex elements. |
| `.uk-margin-auto-top`      | Sets top margin to auto, pushing block and flex elements to the bottom.             |
| `.uk-margin-auto-bottom`   | Sets bottom margin to auto, pushing block and flex elements to the top.             |
| `.uk-margin-auto-left`     | Sets left margin to auto, pushing block and flex elements to the right.             |
| `.uk-margin-auto-right`    | Sets right margin to auto, pushing block and flex elements to the left              |
| `.uk-margin-auto-vertical` | Sets top and bottom margin to auto, vertically centering only flex elements.        |

```example
<div class="uk-margin uk-margin-auto-left uk-width-1-2@s uk-card uk-card-default uk-card-body uk-text-center">Block element</div>

<div class="uk-flex uk-height-medium uk-background-muted uk-margin uk-text-center">
    <div class="uk-margin-auto uk-margin-auto-vertical uk-width-1-2@s uk-card uk-card-default uk-card-body">Flex item</div>
</div>
```

***

## Dynamic wrapping

To add spacing to stacking elements, for example inline elements that wrap on smaller viewports, just add the `uk-margin` attribute to their parent container. It will automatically add the `.uk-margin-small-top` class to the lower element.

```html
<div uk-margin>
    <button></button>
    <button></button>
</div>
```

```example
<div uk-margin>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
    <button class="uk-button uk-button-default">Button</button>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option          | Value  | Default         | Description                                                                                                |
|----------------|--------|-----------------|------------------------------------------------------------------------------------------------------------|
| `margin `      | String | uk-margin-small-top  | This class is added to items that break into the next row, typically to create margin to the previous row. |
| `first-column` | String | uk-first-column | This class is added to the first element in each row.                                                      |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.margin(element, options);
```
