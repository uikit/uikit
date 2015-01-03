# UIkit

UIkit is a lightweight and modular front-end framework for developing fast and powerful web interfaces.

* [Homepage](http://getuikit.com) - Learn more about UIkit
* [@getuikit](https://twitter.com/getuikit) - Get the latest buzz on Twitter
* [Google+ Community](https://plus.google.com/communities/114238665434626719878) - Share news and latest work

Join our developer chat. We are online every work day between 8:00 and 18:00 UTC

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/uikit/uikit)

## Getting started

You have following options to get UIkit:

- Download the [latest release](https://github.com/uikit/uikit/releases/latest)
- Clone the repo, `git clone git://github.com/uikit/uikit.git`.
- Install with [Bower](http://bower.io): ```bower install uikit```

You find the compiled UIkit distribution in its own [repo](https://github.com/uikit/bower-uikit).

## Developers

First of all, install [Node](http://nodejs.org/). We use [Gulp](http://gulpjs.com) to build UIkit. If you haven't used Gulp before, you need to install the `gulp` package as a global install.

```
npm install --global gulp
```

If you haven't done so already, clone the UIkit git repo.

```
git clone git://github.com/uikit/uikit.git
```
Install the Node dependencies.

```
cd uikit
npm install
```

Run `gulp` to lint, build and minify the release.

```
gulp [-t themename]
```

The built version of UIkit will be put in the `/dist` subdirectory. Pass a theme name parameter to only build the specified theme.

### Browsersync

```
gulp watch
```

After running `gulp watch` a new browser instance will open, pointing to the uikit folder - `http://localhost:3000/`. The browser window will reload anytime you modify a source file.

### Custom prefix

Run gulp with your own prefix parameter ```-p``` to have all classes custom prefixed.

```
gulp -p myprefix
```

To use JavaScript with your custom build just call the ```noConflict``` method with your prefix as a parameter after including UIkit.

```
var myUIkit = UIkit.noConflict('myprefix');
```

## Contributing

UIkit follows the [GitFlow branching model](http://nvie.com/posts/a-successful-git-branching-model). The ```master``` branch always reflects a production-ready state while the latest development is taking place in the ```develop``` branch.

Each time you want to work on a fix or a new feature, create a new branch based on the ```develop``` branch: ```git checkout -b BRANCH_NAME develop```. Only pull requests to the ```develop``` branch will be merged.

## Versioning

UIkit is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org).

## Copyright and License

Copyright [YOOtheme](http://www.yootheme.com) GmbH under the [MIT license](LICENSE.md).
