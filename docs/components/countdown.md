# Countdown

<p class="uk-text-lead">Create a simple countdown timer.</p>

## Usage

To apply this component, add the `uk-countdown` attribute to a container element and define a date when the countdown should expire. Just add `date: YYYY-MM-DDThh:mm:ssTZD` option to the attribute, using the [ISO 8601 format](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#ECMAScript_5_ISO-8601_format_support), e.g. `2017-12-04T22:00:00+00:00` (UTC time).

Add the following classes to child elements to apply the necessary functionality and styling.

| Class                   | Description                                                 |
|:------------------------|:------------------------------------------------------------|
| `.uk-countdown-days`    | Add this class to indicate the days to be counted down.     |
| `.uk-countdown-hours`   | Add this class to indicate the hours to be counted down.    |
| `.uk-countdown-minutes` | Add this class to indicate the minutes to be counted down.  |
| `.uk-countdown-seconds` | Add this class to indicate the seconds to be counted down.  |
| `.uk-countdown-number`  | This class adds the neccessary style to a countdown number. |

```html
<div uk-countdown="date: {%isodate%}">
    <span class="uk-countdown-number uk-countdown-days"></span>
    <span class="uk-countdown-number uk-countdown-hours"></span>
    <span class="uk-countdown-number uk-countdown-minutes"></span>
    <span class="uk-countdown-number uk-countdown-seconds"></span>
</div>
```

```example
<div class="uk-grid-small uk-child-width-auto uk-margin" uk-grid uk-countdown="date: {%isodate%}">
    <div>
        <div class="uk-countdown-number uk-countdown-days"></div>
    </div>
    <div>
        <div class="uk-countdown-number uk-countdown-hours"></div>
    </div>
    <div>
        <div class="uk-countdown-number uk-countdown-minutes"></div>
    </div>
    <div>
        <div class="uk-countdown-number uk-countdown-seconds"></div>
    </div>
</div>
```

***

## Separator

To insert a separator between each number, use the `.uk-countdown-separator` class.

```html
<div uk-countdown="date: {%isodate%}">
    <span class="uk-countdown-number uk-countdown-days"></span>
    <span class="uk-countdown-separator">:</span>
    <span class="uk-countdown-number uk-countdown-hours"></span>
    <span class="uk-countdown-separator">:</span>
    <span class="uk-countdown-number uk-countdown-minutes"></span>
    <span class="uk-countdown-separator">:</span>
    <span class="uk-countdown-number uk-countdown-seconds"></span>
</div>
```

```example
<div class="uk-grid-small uk-child-width-auto uk-margin" uk-grid uk-countdown="date: {%isodate%}">
    <div>
        <div class="uk-countdown-number uk-countdown-days"></div>
    </div>
    <div class="uk-countdown-separator">:</div>
    <div>
        <div class="uk-countdown-number uk-countdown-hours"></div>
    </div>
    <div class="uk-countdown-separator">:</div>
    <div>
        <div class="uk-countdown-number uk-countdown-minutes"></div>
    </div>
    <div class="uk-countdown-separator">:</div>
    <div>
        <div class="uk-countdown-number uk-countdown-seconds"></div>
    </div>
</div>
```

***

## Label

To add a label to each number, use the `.uk-countdown-label` class.

```html
<div class="uk-countdown-label">Days</div>
<div class="uk-countdown-label">Hours</div>
<div class="uk-countdown-label">Minutes</div>
<div class="uk-countdown-label">Seconds</div>
```

```example
<div class="uk-grid-small uk-child-width-auto" uk-grid uk-countdown="date: {%isodate%}">
    <div>
        <div class="uk-countdown-number uk-countdown-days"></div>
        <div class="uk-countdown-label uk-margin-small uk-text-center uk-visible@s">Days</div>
    </div>
    <div class="uk-countdown-separator">:</div>
    <div>
        <div class="uk-countdown-number uk-countdown-hours"></div>
        <div class="uk-countdown-label uk-margin-small uk-text-center uk-visible@s">Hours</div>
    </div>
    <div class="uk-countdown-separator">:</div>
    <div>
        <div class="uk-countdown-number uk-countdown-minutes"></div>
        <div class="uk-countdown-label uk-margin-small uk-text-center uk-visible@s">Minutes</div>
    </div>
    <div class="uk-countdown-separator">:</div>
    <div>
        <div class="uk-countdown-number uk-countdown-seconds"></div>
        <div class="uk-countdown-label uk-margin-small uk-text-center uk-visible@s">Seconds</div>
    </div>
</div>
```

***

## Component options

Any of these options can be applied to the component attribute. Separate multiple options with a semicolon. For more information, take a look at the chapter on [component configuration](javascript.md#component-configuration).

| Option | Value  | Default | Description |
|:-------|:-------|:--------|:------------|
| `date` | String | `false` | Any string parsable by ```Date.parse```. See [Reference](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/parse). |

***

## JavaScript

Learn more about [JavaScript components](javascript.md#programmatic-use).

### Initialization

```js
UIkit.countdown(element, options);
```

### Methods

The following methods are available for the component:

#### Start

```js
UIkit.countdown(element).start();
```

Starts the countdown.

#### Stop

```js
UIkit.countdown(element).stop();
```

Stops the countdown.
