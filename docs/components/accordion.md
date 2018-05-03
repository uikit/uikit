# Accordion

<p class="uk-text-lead">Create a list of items that can be shown individually by clicking an item's header.</p>

## Usage

The Accordion component consists of a parent container with the `uk-accordion` attribute, and a title and content part for each accordion item.

| Class                   | Description                                                                |
|:------------------------|:---------------------------------------------------------------------------|
| `.uk-accordion-title`   | Defines and styles the toggle for each accordion item. Use `<a>` elements. |
| `.uk-accordion-content` | Defines the content part for each accordion item.                          |

```html
<ul uk-accordion>
    <li>
        <a class="uk-accordion-title" href="#"></a>
        <div class="uk-accordion-content"></div>
    </li>
</ul>
```

```example
<ul uk-accordion>
    <li class="uk-open">
        <a class="uk-accordion-title" href="#">Item 1</a>
        <div class="uk-accordion-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 2</a>
        <div class="uk-accordion-content">
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 3</a>
        <div class="uk-accordion-content">
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
        </div>
    </li>
</ul>
```

***

## No collapsing

By default, all accordion items can be collapsed. To prevent this behavior and always maintain one open item, add the `collapsible: false` option to the attribute.

```html
<ul uk-accordion="collapsible: false">...</ul>
```

```example
<ul uk-accordion="collapsible: false">
    <li>
        <a class="uk-accordion-title" href="#">Item 1</a>
        <div class="uk-accordion-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 2</a>
        <div class="uk-accordion-content">
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 3</a>
        <div class="uk-accordion-content">
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
        </div>
    </li>
</ul>
```

***

## Multiple open items

To display multiple content sections at the same time without one collapsing when the other one is opened, add the `multiple: true` option to the `uk-accordion` attribute.

```html
<ul uk-accordion="multiple: true">...</ul>
```

```example
<ul uk-accordion="multiple: true">
    <li class="uk-open">
        <a class="uk-accordion-title" href="#">Item 1</a>
        <div class="uk-accordion-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 2</a>
        <div class="uk-accordion-content">
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 3</a>
        <div class="uk-accordion-content">
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
        </div>
    </li>
</ul>
```

***

## Set open items

To specify which items should be opened initially, add the `.uk-open` class to the item. You can also use this to open multiple items. Just make sure to add the option `multiple: true` to the `uk-accordion` attribute.

**Note** Alternatively, you can open a single item by adding the `active: <index>` option to the `uk-accordion` attribute, e.g. `active: 1` to show the second element (the index is zero-based). Note that this will overwrite the `uk-open` class.

```html
<ul uk-accordion>
    <li></li>
    <li class="uk-open"></li>
    <li></li>
</ul>
```

```example
<ul uk-accordion>
    <li>
        <a class="uk-accordion-title" href="#">Item 1</a>
        <div class="uk-accordion-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </li>
    <li class="uk-open">
        <a class="uk-accordion-title" href="#">Item 2</a>
        <div class="uk-accordion-content">
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
        </div>
    </li>
    <li>
        <a class="uk-accordion-title" href="#">Item 3</a>
        <div class="uk-accordion-content">
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat proident.</p>
        </div>
    </li>
</ul>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option        | Value   | Default | Description                                |
|:--------------|:--------|:--------|:-------------------------------------------|
| `active`      | Number  | `false` | Index of the element to open initially.    |
| `animation`   | Boolean | `true`  | Reveal item directly or with a transition. |
| `collapsible` | Boolean | `true`  | Allow all items to be closed.              |
| `content`     | String  | `> .uk-accordion-content` | The content selector, which selects the accordion content elements. |
| `duration`    | Number  | `200`   | Animation duration in milliseconds.        |
| `multiple`    | Boolean | `false` | Allow multiple open items.                 |
| `targets`     | String  | `> *`   | CSS selector of the element(s) to toggle.  |
| `toggle`      | String  | `> .uk-accordion-title` | The toggle selector, which toggles accordion items. |
| `transition`  | String  | `ease`  | The transition to use when revealing items. Use keyword for [easing functions](https://developer.mozilla.org/en-US/docs/Web/CSS/single-transition-timing-function#Keywords_for_common_timing-functions). |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.accordion(element, options);
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

### Methods

The following methods are available for the component:

#### Toggle

```js
UIkit.accordion(element).toggle(index, animate);
```

Toggles the content pane.

| Name      | Type                  | Default | Description                                  |
|:----------|:----------------------|:--------|:---------------------------------------------|
| `index`   | String, Integer, Node | 0       | Accordion pane to toggle. 0 based index.     |
| `animate` | Boolean               | true    | Suppress opening animation by passing false. |
