# Less

<p class="uk-text-lead">Learn how to modify the UIkit styling and create your own theme with Less.</p>

When you have [installed UIkit](installation.md) with Less sources, you can compile it and add your own custom theme. [Less](http://lesscss.org/) is the language that the UIkit styles are written in. This allows you to include customizations in the build process, rather than manually overwriting a lot of CSS rules by hand.

***

## How to build

The Less source files allow you to customize UIkit. To use the customized version on your website, you need to compile the Less sources into CSS. There are basically two approaches available to you: Setup your own build process or use the build scripts included in UIkit.

### Use your own build process

To include UIkit in your project's build workflow, you need to import the core UIkit styles (`uikit.less`) or UIkit with its default theme (`uikit.theme.less`) into your project's own Less file. This main Less file then needs to be compiled in any way you like. Read the [official Less docs](http://lesscss.org/usage/) if you are unsure how to compile Less.

```less
// Import UIkit default theme (or uikit.less with only core styles)
@import "node_modules/uikit/src/less/uikit.theme.less";

// Your custom code goes here, e.g. mixins, variables.
// See "how to create a theme" below for more info.
```

### Use included build process

If you are want to change the styling of UIkit, you can use its build process to create a differently themed version of the CSS, that you can then include in your project. That way you do not need to set up your own build process.

To include your own Less theme in the build process, create a `/custom` directory, which will contain all of your custom themes.

**Note** The `/custom` folder is listed in `.gitignore`, which prevents your custom files from being pushed into the UIkit repository. You might also have the `/custom` directory as your own Git repository. That way your theme files are under version control without interfering with the UIkit files.

Create a file `/custom/my-theme.less` (or any other name) and import the core UIkit styles (`uikit.less`) or UIkit with its default theme (`uikit.theme.less`).

```less
// Import UIkit default theme (or uikit.less with only core styles)
@import "../src/less/uikit.theme.less";

// Your custom code goes here, e.g. mixins, variables.
// See "how to create a theme" below for more info.
```

To compile UIkit and your custom theme into CSS, run the yarn task `compile` .

```sh
# Run once to install all dependencies
yarn install

# Compile all source files including your theme
yarn compile

# Watch files and compile automatically everytime a file changes
yarn watch
```

The generated CSS files will be located in the `/dist/css` folder.

**Note** The custom theme is also available in the test files, just navigate your browser to the index of the `/test` directory and select your theme from the Dropdown menu.

***

## Create a UIkit theme

When you have setup a file to put in your own Less code, you can get started to theme UIkit the way you want. If you have never used Less before, check out the [language features](http://lesscss.org/features/). When working with the UIkit Less sources, we have a few recommendations.

### Use variables

A lot of customization is possible by simply overwriting the values of already declared variables. You can find all variables for each component inside their Less files of the framework and override them in your theme.

First, find a Less variable you want to change inside the UIkit source. For example, the global link color is defined in `/src/less/components/variables.less`:

```less
// default value
@global-link-color: #4091D2;
```

Then, overwrite the default by setting a custom value inside your own file, i.e. in `/custom/my-theme.less`:

```less
// new value
@global-link-color: #DA7D02;
```

The compiled CSS will then have your custom value. But not only has the global link color changed. Many components make use of the `@global-*` variables to infer their own colors, and just adapt them slightly. That way you can rapidly create a theme by just changing some global variables.

### Use hooks

To prevent overhead selectors, we use Mixins from [Less](http://lesscss.org), which hook into predefined selectors from the UIkit source and apply additional properties. Selectors don't have to be repeated throughout all documents and global changes can be made much more easily.

First, find a rule that you want to extend by looking through the component's Less file, for example `/src/less/components/card.less` for the Card component:

```less
// CSS rule
.uk-card {
    position: relative;
    box-sizing: border-box;

    // mixin to allow adding new declarations
    .hook-card;
}
```

Then, inject additional CSS by using the hook inside your own Less file, i.e. in `/custom/my-theme.less`:

```less
// mixin to add new declaration
.hook-card() { color: #000; }
```

### Miscellaneous hooks

Should there be neither a variable nor a hook available, you can also create your own selector. To do so, use the _.hook-card-misc_ hook and write your selector inside. This will sort your new selector to the right place of the compiled CSS file. Just add the following lines to your own Less file, i.e. to `/custom/my-theme.less`:

```less
// misc mixin
.hook-card-misc() {

    // new rule
    .uk-card a { color: #f00; }
}
```

### Disable inverse component

The Inverse component includes additional styles to implement the flexible inverse behaviour. If your project does not make use of these styles, you can leave them out when compiling Less. This allows smaller file sizes of the compiled CSS. To do so, search for Less variables containing `color-mode` (e.g. `@card-primary-color-mode`), and set them to `none`.

To disable the inverse styles completely, set:

```less
@inverse-global-color-mode: none;
```

You can also disable the inverse mode for specific components:

```less
// Card
@card-primary-color-mode: none;
@card-secondary-color-mode: none;

// Navbar
@navbar-color-mode: none;

// Off-canvas
@offcanvas-bar-color-mode: none;

// Overlay
@overlay-primary-color-mode: none;

// Section
@section-primary-color-mode: none;
@section-secondary-color-mode: none;

// Tile
@tile-primary-color-mode: none;
@tile-secondary-color-mode: none;
```

## How to structure your theme

In the examples above, we have added all custom rules directly to `/custom/my-theme.less`. When you change a few variables but are happy with the rest, this is perfectly fine. However, for larger customizations, we recommend to only use this file as an entry point for the Less compiler. You should better sort all rules into single files per component inside of a subfolder. This is the same structure that you can find in the default theme `/src/less/uikit.theme.less`.

**Note** The example assumes you are building a theme in the `/custom` directory of the full UIkit project. You can adapt these paths if you have set up your own build process.

```html
custom/

    <!-- entry file for Less compiler -->
    my-theme.less

    <!-- folder with single Less files -->
    my-theme/

        <!-- imports all components in this folder -->
        _import.less

        <!-- one file per customized component -->
        accordion.less
        alert.less
        ...
```

The entry point for the Less compiler, `/custom/my-theme.less`:

```less
// Core
@import "../../src/less/uikit.less";

// Theme
@import "my-theme/_import.less";
```

Your theme folder has one file which imports all single component customizations, `custom/my-theme/_import.less`:

```less
@import "accordion.less";
@import "alert.less";
// ...
```


**Note** With this setup you can remove the import statements of components you do not use. This will produce smaller CSS. Just make sure to preserve the correct import order as listet in [src/less/components/\_import.less](https://github.com/uikit/uikit/blob/develop/src/less/components/_import.less).
