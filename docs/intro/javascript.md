# JavaScript

Once you have [installed UIkit](installation.md), include the JavaScript files on your page by adding them to the `<head>` section. You can also choose to use the `defer` attribute to delay script execution.

```html
<script src="js/uikit.min.js"></script>
<script src="js/uikit-icons.min.js"></script>
```

***

## UIkit and reactive JavaScript frameworks

UIkit is listening for DOM manipulations and will automatically initialize, connect and disconnect components as they are inserted or removed from the DOM. That way it can easily be used with JavaScript frameworks like [Vue.js](http://vuejs.org/) and React.

**Note** The UIkit website and its documentation that you are currently looking at is built that way. It is a perfect example of how <em>UIkit and Vue.js</em> can be integrated. Head over to its [Github repo](https://github.com/uikit/uikit-site) to see what a good setup can look like.

***

## Component usage

You can use UIkit components by adding `uk-*` or `data-uk-*` attributes to your HTML elements without writing a single line of JavaScript. This is UIkit's best practice of using its components and should always be considered first.

```html
<div uk-sticky="offset: 50;"></div>

<div data-uk-sticky="offset: 50;"></div>
```

**Note** [React](https://facebook.github.io/react/) will work with `data-uk-*` prefixes only.

You can also initialize components via JavaScript and apply them to elements in your document.

```js
var stickys = UIkit.sticky('#sticky', {
    offset: 50
});
```

***

## Component configuration

Each component comes with a set of configuration options that let you customize their behavior. You can set the options on a per instance level or globally.

### Instance

Options can be set:

with the `key: value;` format,

```html
<div uk-sticky="offset: 50; top: 100;"></div>
```

in valid JSON format,

```html
<div uk-sticky='{"offset": 50, "top": 100}'></div>
```

or with single attributes.

```html
<div uk-sticky offset="50" top="100"></div>
```

For _Primary_ options, its key may be omitted, if it's the only option in the attribute value. Please take a look at the specific component documentation to find which option is the _Primary_ option.

```html
<span uk-icon="home"></span>
```

You can also pass options to the component constructor programmatically.

```js
// Passing an options object.
UIkit.sticky('.sticky', {
    offset: 50,
    top: 100
});

// If the component supports Primary options.
UIkit.drop('#drop', 'top-left');
```

### Precedence

Options passed via the component attribute will have the highest precedence, followed by single attributes and then JavaScript.

```html
<div uk-sticky="offset: 50;" offset="100"></div>

<!-- The offset will be 50 -->
```

### Globally

Component options can be changed globally by setting the component's `data` property.

```js
UIkit.component('sticky').options.data.offset = 50;
UIkit.component('sticky').options.data.top = 100;
```

***

## Programmatic use

Programmatically, components may be initialized with the `element, options` arguments format in JavaScript. The `element` argument may be any `Node`, `selector` or `jQuery object`. You'll receive the initialized component as return value. `Functional Components` (e.g. `Notification`) should omit the `element` parameter.

```js
// Passing a selector and an options object.
var sticky = UIkit.sticky('.sticky', {
    offset: 50,
    top: 100
});

// Functional components should omit the 'element' argument.
var notifications = UIkit.notification('MyMessage', 'danger');
```

**Note**
The options names must be in their camel cased representation, e.g. `show-on-up` becomes `showOnUp`.

After initialisation you can get your component by calling the same initialisation function, omitting the options parameter.

```javascript
// Sticky is now the prior initialised components
var sticky = UIkit.sticky('.sticky');
```

**Note**
Using `UIkit[componentName](selector)` with css selectors will always return the first occurrence only!
If you need to access all instances do [query](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) the elements first. Then apply the getter to each element separately - `UIkit[componentName](element)`.


Initializing your components programmatically gives you the possibility to invoke their functions directly.

```js
UIkit.offcanvas('#offcanvas').toggle();
```

Any component functions and variables prefixed with an underscore are considered as part of the internal API, which may change at any given time.

Each component triggers DOM events that you can react to. For example when an Modal is shown or a Scrollspy element becomes visible.

```js
UIkit.util.on('#offcanvas', 'show', function () {
    // do something
});
```

The component's documentation page lists its events.

Sometimes, components like Grid or Tab are hidden in the markup. This may happen when used in combination with the Switcher, Modal or Dropdown. Once they become visible, they need to adjust or fix their height and other dimensions.

UIkit offers several ways of updating a component. Omitting the `event` parameter will trigger an `update` event.

```js
// Calls the update hook on components registered on the element itself, it's parents and children.
UIkit.update(element = document.body, event = 'update');

// Updates the component itself.
component.$emit(event = 'update');

```

If you need to make sure a component is properly destroyed, for example upon removal from the DOM, you can call its `$destroy` function.

```js
// Destroys the component. For example unbind its event listeners.
component.$destroy();

// Also destroys the component, but also removes the element from the DOM.
component.$destroy(true);
```
