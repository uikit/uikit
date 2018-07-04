# Webpack

You can use Webpack to include and bundle UIkit's JavaScript in your project.

***

## File structure

For the basic project setup, we will create the following files:

```html
app/
    index.js
index.html
package.json
```

The following commands will create and fill the file `package.json`. It contains the dependencies for Yarn. We include UIkit and Webpack.

```sh
mkdir uikit-webpack && cd uikit-webpack
yarn init -y
yarn add uikit
yarn add --dev webpack
```

As an entry file for the projects JavaScript, create a file `app/index.js` with the following content.

```js
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// loads the Icon plugin
UIkit.use(Icons);

// components can be called from the imported UIkit reference
UIkit.notification('Hello world.');
```

This way you have the reference to UIkit available without having to include its JavaScript files in your HTML. Instead, we can include the full bundle that will be created by Webpack. Create the main HTML file `index.html` with the following content.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Demo</title>
        <link rel="stylesheet" href="node_modules/uikit/dist/css/uikit.min.css">
    </head>
    <body>

        <div class="uk-container">
            <div class="uk-card uk-card-body uk-card-primary">
                <h3 class="uk-card-title">Example headline</h3>

                <button class="uk-button uk-button-default" uk-tooltip="title: Hello World">Hover</button>
            </div>
        </div>

        <script src="dist/bundle.js"></script>
    </body>
</html>
```

**Note** For simplicity reasons, we have included the pre-built CSS. In a real project, you probably want to build the [Less](less.md) files and included the compiled CSS instead.

## Webpack config

To configure Webpack to compile `app/index.js` into `dist/bundle.js`, create the file `webpack.config.js` with the following content.

```js
var path = require('path');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

Now, run Webpack in your project's main directory.

```sh
./node_modules/.bin/webpack # Run webpack from local project installation
.\node_modules\.bin\webpack # Run webpack on Windows
webpack # If you installed webpack globally
```

This completes the basic setup of your project. Navigate to `index.html` in your browser and confirm that the basic UIkit styling is applied to your page. If the bundling was successful, a notification should pop up at the top of your page and the button should display a message on hover.
