# Custom icons

<p class="uk-text-lead">UIkit's icon library can be extended and customized with your own icon files.</p>

UIkit's icon library contains a number of SVG icons bundled in a single JavaScript file `uikit-icons.min.js`. This file includes all icons, no additional SVG files are needed. In this document, we will describe how you can add your own icons to this library or overwrite existing ones. Look at the [Icon component](icon.md) for an overview of the default icons.

***

## Add and overwrite icons

Your can overwrite any of the default icons from UIkit and create additional ones. To prepare, please [setup UIkit from Github source](installation.md#compile-from-github-source). You can now add your own SVG icons and include them in UIkit's build process.

The build process will check two places for additional icon files:

1. The custom folder: `/custom/icons/*.svg`
2. Any custom theme: `/custom/mytheme/icons/*.svg`

Compile UIkit to include the additional icons:

```sh
yarn compile
```

Your additional icon will now be added to the icon library, in one of these two places:

1. `dist/js/uikit-icons.js` if you have added the icon to UIkit globally
2. `dist/js/uikit-icons-mytheme.js` if the icon is only inside a UIkit theme

***

## Avoid naming conflicts

If you create an icon with an existing name, you will overwrite the default icon of the same name. For example, `/custom/icons/close.svg` would overwrite the default close icon.

If your icon uses a name that has not been used before, it will be added as a new icon. For example, `/custom/icons/example.svg` will create a new icon that can be used via `<span uk-icon="example"></span>`.

To check which names are already in use, look in the two directories `/src/images/components` and `/src/images/icons`. When you create a new icon, make sure the same name is not used in either of these two folder. Otherwise, it will overwrite the included icon.
