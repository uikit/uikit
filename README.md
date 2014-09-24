# UIkit

UIkit is a lightweight and modular front-end framework for developing fast and powerful web interfaces.

* [Homepage](http://getuikit.com) - Learn more about UIkit
* [@getuikit](https://twitter.com/getuikit) - Get the latest buzz on Twitter
* [Issues](http://github.com/uikit/uikit/issues) - Report bugs
* [Google+](https://plus.google.com/communities/114238665434626719878) - Share news and latest work

## Getting started

Download the [latest release](https://github.com/uikit/uikit/zipball/master) or clone the repo, `git clone git://github.com/uikit/uikit.git`.

## Bug tracker

Report bugs on [UIkit Issues](https://github.com/uikit/uikit/issues?state=open).

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
gulp
```

The built version of UIkit will be put in the `/dist` subdirectory.

Enter the following, so Gulp will watch your working directory and compile LESS files automatically everytime you hit save. After running <code>gulp watch</code> you can also visit http://localhost:3000/tests/ to see the impact of your changes in realtime.

```
gulp watch
```

## Versioning

UIkit is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org).

## Credits

We built UIkit using popular open source projects.

* jQuery ([MIT License](http://opensource.org/licenses/MIT))
* normalize.css ([MIT License](http://opensource.org/licenses/MIT))
* FontAwesome ([CC BY 3.0 License](http://creativecommons.org/licenses/by/3.0/))

## Copyright and license

Copyright 2014 [YOOtheme](http://www.yootheme.com) GmbH under the [MIT license](LICENSE.md).
