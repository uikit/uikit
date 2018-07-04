# Introduction

<p class="uk-text-lead">Get familiar with the basic setup and overview of UIkit.</p>

First of all you need to download UIkit. For other packages and links to a CDN, head to the [installation guide](installation.md) to learn more.

<a class="uk-button uk-button-primary" href="https://getuikit.com/download">Download UIkit</a>

***

## Package contents

The Zip file contains the compiled CSS and JavaScript files, which is everything you need to get started. Later, you might want to [install and compile UIkit](installation.md) yourself and also [create your own UIkit theme](less.md).

| Folder | Description                                                    |
|:-------|:---------------------------------------------------------------|
| `/css` | Contains the UIkit CSS and a right-to-left version.            |
| `/js`  | Contains the UIkit JavaScript and the Icon Library JavaScript. |

***

## HTML markup

Add the compiled and minified CSS and JavaScript to the `<head>` element of your HTML5 document. Also include the UIkit icon library. For your basic setup, that's it.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Title</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/uikit.min.css" />
        <script src="js/uikit.min.js"></script>
        <script src="js/uikit-icons.min.js"></script>
    </head>
    <body>
    </body>
</html>
```

Once you have included UIkit into your document, take a look at the available components and create your own markup inside the `<body>` element of your page.

***

## UIkit autocomplete for your editor

Using UIkit works best if you have a solid code editor, for example [Sublime Text](https://www.sublimetext.com/) or [Atom](https://atom.io/). To be even more efficient, we recommend that you install one of the autocomplete plugins for your favorite IDE or code editor. This saves a lot of time, as you won't have to look up and type all UIkit classes and markup.

- [Autocomplete plugin for Sublime Text 3](https://github.com/uikit/uikit-sublime)
- [Autocomplete plugin for Atom](https://atom.io/packages/uikit-atom)

***

## Browser support

The following table lists the versions that UIkit is tested on. "Latest" means that it works just fine on all recent versions of that browser. With many browser moving towards a rolling release strategy, pinning down browser support to a specific version has become a little tricky in recent years. Long story short: UIkit will work on pretty much any modern browser.

<div class="uk-child-width-1-3 uk-child-width-expand@s uk-text-center" uk-grid uk-height-match="> * > div">
    <div>
        <div class="uk-flex uk-flex-center uk-flex-middle">
            <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome.svg?sanitize=true" width="50" alt="Chrome">
        </div>
        <p>Latest</p>
    </div>
    <div>
        <div class="uk-flex uk-flex-center uk-flex-middle">
            <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox.svg?sanitize=true" width="50" alt="Firefox">
        </div>
        <p>Latest</p>
    </div>
    <div>
        <div class="uk-flex uk-flex-center uk-flex-middle">
            <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge.svg?sanitize=true" width="50" alt="Edge">
        </div>
        <p>Latest</p>
    </div>
    <div>
        <div class="uk-flex uk-flex-center uk-flex-middle">
            <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11.svg?sanitize=true" width="50" alt="IE">
        </div>
        <p>11+</p>
    </div>
    <div>
        <div class="uk-flex uk-flex-center uk-flex-middle">
            <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios.svg?sanitize=true" width="50" alt="Safari">
        </div>
        <p>9.1+</p>
    </div>
    <div>
        <div class="uk-flex uk-flex-center uk-flex-middle">
            <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera.svg?sanitize=true" width="50" alt="Opera">
        </div>
        <p>Latest</p>
    </div>
</div>
