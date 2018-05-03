# Align

<p class="uk-text-lead">Control the alignment of inline elements depending on the viewport size.</p>

## Usage

To align images or other elements with spacing between the text and the element, add one of these classes.

| Class              | Description                                                         |
|:-------------------|:--------------------------------------------------------------------|
| `.uk-align-left`   | Floats the element to the left and creates right and bottom margin. |
| `.uk-align-right`  | Floats the element to the right and creates left and bottom margin. |
| `.uk-align-center` | Centers the element and creates bottom margin.                      |

```html
<img class="uk-align-left" src="" alt="">
```

```example
<div class="uk-panel">
    <img class="uk-align-left uk-margin-remove-adjacent" src="../docs/images/light.jpg" width="225" height"150" alt="Example image">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</div>
```

***

## Responsive

UIkit provides a number of responsive alignment classes. Basically, they work just like the usual alignment classes, except that they have suffixes that represent the breakpoint from which they come to effect.

| Class                                        | Description                                        |
|:---------------------------------------------|:---------------------------------------------------|
| `.uk-align-left@s`<br> `.uk-align-right@s`   | Only affects device widths of _640px_ and higher.  |
| `.uk-align-left@m`<br> `.uk-align-right@m`   | Only affects device widths of _960px_ and higher.  |
| `.uk-align-left@l`<br> `.uk-align-right@l`   | Only affects device widths of _1200px_ and higher. |
| `.uk-align-left@xl`<br> `.uk-align-right@xl` | Only affects device widths of _1600px_ and higher. |

```html
<img class="uk-align-center uk-align-right@m" src="" alt="">
```

```example
<div class="uk-panel">
    <img class="uk-align-center uk-align-right@m uk-margin-remove-adjacent"  src="../docs/images/light.jpg" width="225" height"150" alt="Example image">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</div>
```
