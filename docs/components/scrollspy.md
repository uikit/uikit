# Scrollspy

<p class="uk-text-lead">Trigger events and animations while scrolling your page.</p>

## Usage

The Scrollspy component listens to page scrolling and triggers events based on the scroll position. For example, if you scroll down a page and an element appears in the viewport for the first time, you can trigger a smooth animation to fade in the element. Just add the `uk-scrollspy` attribute which takes the following options.

Typically, classes from the [Animation component](animation.md) are used together with the Scrollspy component.

```html
<div uk-scrollspy="cls:uk-animation-fade"></div>
```

```example
<div class="uk-child-width-1-2@m uk-grid-match" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
            <h3 class="uk-card-title">Left</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body" uk-scrollspy="cls: uk-animation-slide-right; repeat: true">
            <h3 class="uk-card-title">Right</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
</div>
```

This example uses the `repeat: true` option. Scroll up and down to see the triggered animations. The layout is made with the [Card component](card.md).

***

## Groups

You can also group scrollspy elements, so you won't have to apply the attribute to each of them. Just add the `uk-scrollspy="target:MY-CLASS"` attribute to a container element, targeting the selector of the items you want to animate inside the container. When using a delay, it will be applied cumulatively to the items within the row that scrolls into view. The delay will be reseted for the next row within the group when it scrolls into view.

```html
<div uk-scrollspy="target: > div; cls:uk-animation-fade; delay: 500">
    <div></div>
    <div></div>
</div>
```

```example
<div class="uk-child-width-1-3@m" uk-grid uk-scrollspy="cls: uk-animation-fade; target: > div > .uk-card; delay: 500; repeat: true">
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Fade</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Fade</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Fade</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Fade</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Fade</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Fade</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option        | Value   | Default               | Description                                                                                                   |
|:--------------|:--------|:----------------------|:--------------------------------------------------------------------------------------------------------------|
| `cls`         | String  | `uk-scrollspy-inview` | Class to add when the element is in view. If two, comma separated classes are provided those will be toggled. |
| `hidden`      | Boolean | `true`                | Hides the element while out of view.                                                                          |
| `offset-top`  | Number  | `0`                   | Top offset before triggering in view.                                                                         |
| `offset-left` | Number  | `0`                   | Left offset before triggering in view.                                                                        |
| `repeat`      | Boolean | `false`               | Applies the `cls` class every time the element is in view.                                                    |
| `delay`       | Number  | `0`                   | Delay time in ms.                                                                                             |

`cls` is the _Primary_ option and its key may be omitted, if it's the only option in the attribute value.

```html
<span uk-scrollspy="my-class"></span>
```

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.scrollspy(element, options);
```

### Events

The following events will be triggered on elements with this component attached:

| Name      | Description                                     |
|:----------|:------------------------------------------------|
| `inview`  | Fires after an item moves into the viewport.    |
| `outview` | Fires after an item moves into out of viewport. |

***

## Scrollspy nav

To automatically update the active menu item depending on the scroll position of your site, add the `uk-scrollspy-nav` attribute to any navigation. Each menu item must link to the ID of its corresponding part of the site.

```html
<ul class="uk-nav uk-nav-default" uk-scrollspy-nav="closest: li; scroll: true">
    <li><a href=""></a></li>
    <li><a href=""></a></li>
</ul>
```

For an example of the scrollspy nav, just check out the fixed nav on the right side of this page or take a look at the test. Any of the following options can be applied to the `uk-scrollspy-nav` attribute. Separate multiple options with a semicolon.

***

### Scrollspy nav options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. [Learn more](javascript.md#component-configuration)

| Option     | Value   | Default                    | Description                                                                                           |
|:-----------|:--------|:---------------------------|:------------------------------------------------------------------------------------------------------|
| `cls`      | String  | `uk-active`                | Class to add to the active links.                                                                     |
| `closest`  | String  | `uk-scrollspy-init-inview` | Target to apply the class to.                                                                         |
| `scroll`   | Boolean | `false`                    | Adds the [Scroll component](scroll.md) to its links.                                                  |
| `overflow` | Boolean | `true`                     | If overflow is set to true, the first or last item will stay active if above or below the navigation. |
| `offset`   | Number  | `0`                        | Pixel offset added to scroll top.                                                                     |

***

### Scrollspy nav JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Scrollspy nav initialization

```js
UIkit.scrollspyNav(element, options);
```

### Scrollspy nav events

The following events will be triggered on elements with this component attached:

| Name     | Description                         |
|:---------|:------------------------------------|
| `active` | Fires after an item becomes active. |
