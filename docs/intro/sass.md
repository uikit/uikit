# Sass

<p class="uk-text-lead">Learn how to modify the UIkit styling and create your own theme with Sass.</p>

When you have [installed UIkit](installation.md) with sources you will find the UIkit Sass version within the _/src/scss_ folder. The Sass version allows you to include customizations in the build process, rather than manually overwriting a lot of CSS rules by hand.

**Note** Sass allows two different syntax version: Sass and SCSS. UIkit makes use of the SCSS syntax.

***

## How to build

To include UIkit in your project's build workflow, you need to import three SCSS files from UIkit in the correct order into in your own SCSS code. Then, compile your file, e.g. running `sass site.scss > site.css` or any other [Sass compiler](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#using_sass). Be careful to keep the correct order as described in the following example.

```scss
// 1. Your custom variables and variable overwrites.
$global-link-color: #DA7D02;

// 2. Import default variables and available mixins.
@import "uikit/src/scss/variables-theme.scss";
@import "uikit/src/scss/mixins-theme.scss";

// 3. Your custom mixin overwrites.
@mixin hook-card() { color: #000; }

// 4. Import UIkit.
@import "uikit/src/scss/uikit-theme.scss";
```

**Note** The example uses the styling of the included default theme. Alternatively, you can import `variables.scss`, `mixins.scss` and `uikit.scss` to only include the core styling.

***

## Create a UIkit theme

When you have setup a file to put in your own SCSS code, you can get started to theme UIkit the way you want. If you have never used SCSS before, check out the [language features](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#features). When working with the UIkit SCSS sources, we have a few recommendations.

### Use variables

A lot of customization is possible by simply overwriting the values of already declared variables. You can find all variables for each component inside their SCSS files of the framework or the `variables.scss` file and override them in your theme.

First, find a SCSS variable you want to change inside the UIkit source. For example, the global link color is defined in `/src/scss/components/variables.scss`:

```scss
// default value
$global-link-color: #4091D2;
```

Then, overwrite the default by setting a custom value inside your own file, i.e. to `site.scss` as described above:

```scss
// new value
$global-link-color: #DA7D02;
```

The compiled CSS will then have your custom value. But not only has the global link color changed. Many components make use of the `@global-*` variables to infer their own colors, and just adapt them slightly. That way you can rapidly create a theme by just changing some global variables.

### Use hooks

To prevent overhead selectors, we use Mixins from [Sass](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins), which hook into predefined selectors from the UIkit source and inject additional properties. Selectors don't have to be repeated throughout all documents and global changes can be made much more easily.

First, find a rule that you want to extend by looking through the component's SCSS file, for example `/src/scss/components/card.scss` for the Card component:

```scss
// SCSS rule
.uk-card {
    position: relative;
    box-sizing: border-box;

    // mixin to allow adding new declaration
    @include hook-card();
}
```

Then, inject additional CSS by using the hook inside your own SCSS file, i.e. to `site.scss` as described above:

```scss
// mixin to add new declaration
@mixin hook-card() { color: #000; }
```

### Inverse hooks

Inverse hooks allow you to customize how a component is styled when used in combination with the `.uk-light` or `.uk-dark` modifiers (check out the [Inverse component](inverse.md) for details). These hooks are handled a little differently in the Sass version compared to the Less version. In the Sass version, every component has its own inverse hooks. You can see all available ones when going through the file `src/scss/mixins.scss`.

For example, you can make a default button appear with a custom background whenever it is used as an inverse version.

```scss
@mixin hook-inverse-button-default(){
    background: lime;
}
```

### Miscellaneous hooks

Should there be neither a variable nor a hook available, you can also create your own selector. To do so, e.g. use the _hook-card-misc()_ mixin of the Card component and write a selector inside. This will sort your new selector to the right place of the compiled CSS file. Just add the following lines to your own SCSS file, i.e. to `site.scss` as described above:

```scss
// misc mixin
@mixin hook-card-misc() {

    // new rule
    .uk-card a { color: #f00; }
}
```


### Disable inverse component

The Inverse component includes additional styles to implement the flexible inverse behaviour. If your project does not make use of these styles, you can leave them out when compiling Sass. This allows smaller file sizes of the compiled CSS. To do so, search for Sass variables containing `color-mode` (e.g. `$inverse-global-color-mode`), and set them to `none`.

To disable the inverse styles completely, set:

```scss
$inverse-global-color-mode: none;
```

You can also disable the inverse mode for specific components:

```scss
// Card
$card-primary-color-mode: none;
$card-secondary-color-mode: none;

// Navbar
$navbar-color-mode: none;

// Off-canvas
$offcanvas-bar-color-mode: none;

// Overlay
$overlay-primary-color-mode: none;

// Section
$section-primary-color-mode: none;
$section-secondary-color-mode: none;

// Tile
$tile-primary-color-mode: none;
$tile-secondary-color-mode: none;
```

***

## How to structure your theme

In the examples above, we have added all custom rules directly to `site.scss`. When you change a few variables but are happy with the rest, this is perfectly fine. However, for larger customizations, we recommend to only use this file as an entry point for the Sass compiler. You should better sort all rules into single files per component inside of a subfolder. This is the same structure that you can find in the default theme `/src/scss/theme`.


```html
<!-- uikit sources, might be in a subfolder when using npm -->
uikit/src/scss/

    components/
        _import.scss
        accordion.scss
        alert.scss
        ...

    theme/
        _import.scss
        accordion.scss
        alert.scss
        ...

    <!-- other uikit files, some of which we will import below -->
    ...

<!-- in here, we now put all your customizations, divided by component -->
theme/

    <!-- create 2 files for each component you customize -->
    accordion.scss <!-- overwrite variables in here -->
    accordion-mixins.scss <!-- use hooks in here -->

    alert.scss
    alert-mixins.scss

    align.scss
    align-mixins.scss

    <!-- etc for all components you customize -->
    ...

<!-- this is your entry point to compile scss -->
site.scss

```

The entry point for the Sass compiler is `site.scss`. Here you compile all source files in the following order:

```scss
// site.scss

// 1. Your custom variables and variable overwrites.
@import "theme/accordion.scss";
@import "theme/alert.scss";
@import "theme/align.scss";
// ... import all

// 2. Import default variables and available mixins.
@import "uikit/src/scss/variables.scss";
@import "uikit/src/scss/mixins.scss";

// 3. Your custom mixin overwrites.
@import "theme/accordion-mixins.scss";
@import "theme/alert-mixins.scss";
@import "theme/align-mixins.scss";
// ... import all

// 4. Import UIkit
@import "uikit/src/scss/uikit.scss";
```

Now you can compile `site.scss` and the resulting CSS will include all your customizations.

**Note** You can further extend this setup by replacing part "4." with single import statements from the UIkit source. You can then omit some components you do not use to produce smaller CSS. Just copy from [src/scss/components/\_import.scss](https://github.com/uikit/uikit/blob/develop/src/scss/components/_import.scss) and make sure to preserve the correct import order.