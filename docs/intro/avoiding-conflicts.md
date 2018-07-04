# Avoiding conflicts

<p class="uk-text-lead">Use a custom prefix and the scope mode to make UIkit work in any environment.</p>

By default, all classes and attributes in UIkit start with the `uk-` prefix. This avoids name collisions when introducing UIkit to existing projects or when combining it with other frameworks. UIkit allows to change that prefix. This even allows to use multiple versions of UIkit alongside each other. In addition, the scope mode allows to limit the UIkit styles to only affect certain parts on your pages.

***

## Custom prefix

Using a custom prefix allows using multiple versions of UIkit on the same page. This might be needed when you are building something like a CMS plugin. In such cases, you do not know what other versions of UIkit might be loaded, so it is a good idea to use a custom prefix.

When you have [setup UIkit from Github source](installation.md#compile-from-github-source), you can compile it with a custom prefix. If you choose a custom prefix, for example `xyz`, all attributes and classes will now start with that prefix, for example `xyz-grid` instead of `uk-grid`. The global JavaScript object `UIkit` will also be renamed to `xyzUIkit`.


```sh
yarn prefix -- -p xyz # replace xyz with your custom prefix.
```
**Note** `yarn prefix` will prompt for a prefix.

The script will go through all CSS files in the `/dist` folder and replace them with your custom prefix version.

**Note** The Base component will still include styles that affect some base HTML elements. To avoid this, either create a [custom build](less.md) without including the Base component, or use the scoped mode.

***

## Scope mode

Using a scoped version of UIkit allows you to limit styles to only apply to a certain part of your document. This might be needed in environments of admin interfaces, such as the backend of WordPress or Joomla. When you have [setup UIkit from Github source](installation.md#compile-from-github-source), you can recompile UIkit as a scoped version.

```sh
yarn scope
```

**Note** Type ```yarn scope -- -h``` to get more options.

You will find the generated CSS and JS files in the `/dist` folder. To use the scoped version, wrap the document section with your UIkit markup in an element with the `.uk-scope` class.

```html
<!DOCTYPE html>
<html>
    <head>
        ...
    </head>
    <body>

        <!-- non UIkit markup -->
        ...

        <div class="uk-scope">
            <!-- your UIkit markup -->
            ...
        </div>
    </body>
</html>
```

Now you need to tell ```uk-modal```, ```uk-tooltip``` and ```uk-lightbox``` where to append themselves into the DOM when they do not have the ```container``` option set, e.g. the default container for said components.
To do so, set the following parameter:

```javascript
//simply pass the selector
UIkit.container = '.uk-scope';
...
//or you can set an element directly, for example:
UIkit.container = document.getElementById('#id-of-scope-element');
```
