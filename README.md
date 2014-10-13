# UIkit

UIkit is a lightweight and modular front-end framework for developing fast and powerful web interfaces.

* [Homepage](http://getuikit.com) - Learn more about UIkit
* [@getuikit](https://twitter.com/getuikit) - Get the latest buzz on Twitter
* [Google+](https://plus.google.com/communities/114238665434626719878) - Share news and latest work
* [Issues](http://github.com/uikit/uikit/issues) - Report bugs
* [Developer Chat](https://www.hipchat.com/gaWuqCDrW) - Every work day between 8:00 and 18:00 UTC

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
gulp watch [-t themename]
```

After running `gulp watch` a new browser instance will open, pointing to the uikit folder - `http://localhost:3000/`. The browser window will reload anytime you modify a source file. To speed up the build and reload process you can pass a theme name parameter to only watch the specified theme.

## Contributing

UIkit follows the [GitFlow branching model](http://nvie.com/posts/a-successful-git-branching-model). The ```master``` branch always reflects a production-ready state while the latest development is taking place in the ```develop``` branch.

Each time you want to work on a fix or a new feature, create a new branch based on the ```develop``` branch: ```git checkout -b BRANCH_NAME develop```. Only pull requests to the ```develop``` branch will be merged.

## Versioning

UIkit is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org).

## Credits

We built UIkit using popular open source projects.

* jQuery ([MIT License](http://opensource.org/licenses/MIT))
* normalize.css ([MIT License](http://opensource.org/licenses/MIT))
* FontAwesome ([CC BY 3.0 License](http://creativecommons.org/licenses/by/3.0/))

## Copyright and license

Copyright 2014 [YOOtheme](http://www.yootheme.com) GmbH under the [MIT license](LICENSE.md).
