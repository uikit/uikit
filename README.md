[![uikit banner](https://cloud.githubusercontent.com/assets/321047/21769911/474d7d9e-d681-11e6-9fe0-d95f8ccfd3a9.jpg)](http://getuikit.com/)

# UIkit

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/uikit/uikit)

UIkit is a lightweight and modular front-end framework for developing fast and powerful web interfaces.

* [Homepage](http://getuikit.com) - Learn more about UIkit
* [@getuikit](https://twitter.com/getuikit) - Get the latest buzz on Twitter
* [Gitter Chat](https://gitter.im/uikit/uikit) - Join our developer chat on Gitter.

---

<p align="center">
  <b>UIkit is an Open Source project developed by YOOtheme.</b>
  <br><br>
  <a href="https://yootheme.com" align="center">
      <img width="134" height="30" src="http://yootheme.com/pro/images/logo.svg">
  </a>
</p>

---

## Getting started

You have the following options to get UIkit:

- Download the [latest release](https://github.com/uikit/uikit/releases/latest) with pre-built CSS and JS.
- Install with [Bower](https://bower.io) to get the pre-built CSS and JS, plus Less files to compile yourself. This is recommended when using UIkit for a typical web project: ```bower install uikit```
- Clone the repo to get all source files including build scripts: `git clone git://github.com/uikit/uikit.git`
- Install with [Npm](https://npmjs.com) to get all source files as they are available on Github: ```npm install uikit```
- Directly load UIkit from [CDNJS](https://cdnjs.com): https://cdnjs.com/libraries/uikit

## Developers

To always have the newest version of UIkit, even before a release, you may want to build it from source. If you only want to integrate the Less sources in your own website, you should simply install the Bower package instead.

Clone the UIkit repository.

```
git clone git://github.com/uikit/uikit.git
cd uikit
```

Install the Node dependencies.

```
npm install
```

Build UIkit. The result will end up in the `dist/` folder.

```
npm run compile
```

You can also watch for file changes and re-compile automatically.

```
npm run watch
```

Compile dist in rtl mode (experimental).

```
npm run compile-rtl
```

## Contributing

Finding bugs, sending pull requests or improving our docs - any contribution is welcome and highly appreciated. To get started, head over to our [contribution guidelines](CONTRIBUTING.md). Thanks!

## Versioning

UIkit is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | 10+ ✔ | 7.1+ ✔ | Latest ✔ |

Tested with [BrowserStack](https://www.browserstack.com) (thanks for sponsoring!).

## Copyright and License

Copyright [YOOtheme](https://yootheme.com) GmbH under the [MIT license](LICENSE.md).
