/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(2);
	__webpack_require__(3);

	var base = '../' + document.querySelector('script[src*="test.js"]').getAttribute('src').replace('test.js', ''),
	    tests = {

	    Base: ['base'],
	    Elements: ['typography', 'list', 'description-list', 'table', 'form', 'button'],
	    Common: ['alert', 'badge', 'close', 'icon'],
	    Navigation: ['nav', 'navbar', 'subnav', 'breadcrumb', 'pagination'],
	    Layout: ['section', 'container', 'grid', 'card'],
	    JavaScript: ['drop', 'dropdown', 'toggle', 'scrollspy', 'smooth-scroll'],
	    Utilities: ['align', 'column', 'cover', 'flex', 'inverse', 'margin', 'padding', 'sticky', 'text', 'utility', 'visibility', 'width'],
	    Components: ['form-advanced']

	};

	document.addEventListener('DOMContentLoaded', function () {

	    var $select = (0, _jquery2.default)('<select><option value="">- Select Test -</option></select>').css('margin', '0 5px'),
	        $optgroup;

	    _jquery2.default.each(tests, function (group, tests) {

	        $optgroup = (0, _jquery2.default)('<optgroup label="' + group + '"></optgroup>').appendTo($select);

	        tests.forEach(function (name) {
	            $optgroup.append('<option value="' + name + '.html">' + name.charAt(0).toUpperCase() + name.slice(1) + '</option>');
	        });
	    });

	    $select.on('change', function () {
	        if ($select.val()) {
	            location.href = base + 'tests/' + $select.val();
	        }
	    }).val(location.pathname.split('/').pop());

	    (0, _jquery2.default)('body').prepend((0, _jquery2.default)('<div class="uk-form uk-margin-top uk-margin-bottom uk-container uk-container-center"></div>').prepend($select));
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*!

	Holder - client side image placeholders
	Version 2.9.0+igxoe
	© 2015 Ivan Malopinsky - http://imsky.co

	Site:     http://holderjs.com
	Issues:   https://github.com/imsky/holder/issues
	License:  MIT

	*/
	(function (window) {
	  if (!window.document) return;
	  var document = window.document;

	  //https://github.com/inexorabletash/polyfill/blob/master/web.js
	    if (!document.querySelectorAll) {
	      document.querySelectorAll = function (selectors) {
	        var style = document.createElement('style'), elements = [], element;
	        document.documentElement.firstChild.appendChild(style);
	        document._qsa = [];

	        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
	        window.scrollBy(0, 0);
	        style.parentNode.removeChild(style);

	        while (document._qsa.length) {
	          element = document._qsa.shift();
	          element.style.removeAttribute('x-qsa');
	          elements.push(element);
	        }
	        document._qsa = null;
	        return elements;
	      };
	    }

	    if (!document.querySelector) {
	      document.querySelector = function (selectors) {
	        var elements = document.querySelectorAll(selectors);
	        return (elements.length) ? elements[0] : null;
	      };
	    }

	    if (!document.getElementsByClassName) {
	      document.getElementsByClassName = function (classNames) {
	        classNames = String(classNames).replace(/^|\s+/g, '.');
	        return document.querySelectorAll(classNames);
	      };
	    }

	  //https://github.com/inexorabletash/polyfill
	  // ES5 15.2.3.14 Object.keys ( O )
	  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
	  if (!Object.keys) {
	    Object.keys = function (o) {
	      if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }
	      var ret = [], p;
	      for (p in o) {
	        if (Object.prototype.hasOwnProperty.call(o, p)) {
	          ret.push(p);
	        }
	      }
	      return ret;
	    };
	  }

	  // ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
	  // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	  if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function (fun /*, thisp */) {
	      if (this === void 0 || this === null) { throw TypeError(); }

	      var t = Object(this);
	      var len = t.length >>> 0;
	      if (typeof fun !== "function") { throw TypeError(); }

	      var thisp = arguments[1], i;
	      for (i = 0; i < len; i++) {
	        if (i in t) {
	          fun.call(thisp, t[i], i, t);
	        }
	      }
	    };
	  }

	  //https://github.com/inexorabletash/polyfill/blob/master/web.js
	  (function (global) {
	    var B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	    global.atob = global.atob || function (input) {
	      input = String(input);
	      var position = 0,
	          output = [],
	          buffer = 0, bits = 0, n;

	      input = input.replace(/\s/g, '');
	      if ((input.length % 4) === 0) { input = input.replace(/=+$/, ''); }
	      if ((input.length % 4) === 1) { throw Error('InvalidCharacterError'); }
	      if (/[^+/0-9A-Za-z]/.test(input)) { throw Error('InvalidCharacterError'); }

	      while (position < input.length) {
	        n = B64_ALPHABET.indexOf(input.charAt(position));
	        buffer = (buffer << 6) | n;
	        bits += 6;

	        if (bits === 24) {
	          output.push(String.fromCharCode((buffer >> 16) & 0xFF));
	          output.push(String.fromCharCode((buffer >>  8) & 0xFF));
	          output.push(String.fromCharCode(buffer & 0xFF));
	          bits = 0;
	          buffer = 0;
	        }
	        position += 1;
	      }

	      if (bits === 12) {
	        buffer = buffer >> 4;
	        output.push(String.fromCharCode(buffer & 0xFF));
	      } else if (bits === 18) {
	        buffer = buffer >> 2;
	        output.push(String.fromCharCode((buffer >> 8) & 0xFF));
	        output.push(String.fromCharCode(buffer & 0xFF));
	      }

	      return output.join('');
	    };

	    global.btoa = global.btoa || function (input) {
	      input = String(input);
	      var position = 0,
	          out = [],
	          o1, o2, o3,
	          e1, e2, e3, e4;

	      if (/[^\x00-\xFF]/.test(input)) { throw Error('InvalidCharacterError'); }

	      while (position < input.length) {
	        o1 = input.charCodeAt(position++);
	        o2 = input.charCodeAt(position++);
	        o3 = input.charCodeAt(position++);

	        // 111111 112222 222233 333333
	        e1 = o1 >> 2;
	        e2 = ((o1 & 0x3) << 4) | (o2 >> 4);
	        e3 = ((o2 & 0xf) << 2) | (o3 >> 6);
	        e4 = o3 & 0x3f;

	        if (position === input.length + 2) {
	          e3 = 64; e4 = 64;
	        }
	        else if (position === input.length + 1) {
	          e4 = 64;
	        }

	        out.push(B64_ALPHABET.charAt(e1),
	                 B64_ALPHABET.charAt(e2),
	                 B64_ALPHABET.charAt(e3),
	                 B64_ALPHABET.charAt(e4));
	      }

	      return out.join('');
	    };
	  }(window));

	  //https://gist.github.com/jimeh/332357
	  if (!Object.prototype.hasOwnProperty){
	      /*jshint -W001, -W103 */
	      Object.prototype.hasOwnProperty = function(prop) {
	      var proto = this.__proto__ || this.constructor.prototype;
	      return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
	    };
	      /*jshint +W001, +W103 */
	  }

	  // @license http://opensource.org/licenses/MIT
	  // copyright Paul Irish 2015


	  // Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
	  //   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
	  // as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

	  // if you want values similar to what you'd get with real perf.now, place this towards the head of the page
	  // but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


	  (function(){

	    if ('performance' in window === false) {
	        window.performance = {};
	    }

	    Date.now = (Date.now || function () {  // thanks IE8
	      return new Date().getTime();
	    });

	    if ('now' in window.performance === false){

	      var nowOffset = Date.now();

	      if (performance.timing && performance.timing.navigationStart){
	        nowOffset = performance.timing.navigationStart;
	      }

	      window.performance.now = function now(){
	        return Date.now() - nowOffset;
	      };
	    }

	  })();

	  //requestAnimationFrame polyfill for older Firefox/Chrome versions
	  if (!window.requestAnimationFrame) {
	    if (window.webkitRequestAnimationFrame) {
	    //https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/requestAnimationFrame/polyfill-webkit.js
	    (function (global) {
	      // window.requestAnimationFrame
	      global.requestAnimationFrame = function (callback) {
	        return webkitRequestAnimationFrame(function () {
	          callback(global.performance.now());
	        });
	      };

	      // window.cancelAnimationFrame
	      global.cancelAnimationFrame = webkitCancelAnimationFrame;
	    }(window));
	    } else if (window.mozRequestAnimationFrame) {
	      //https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/requestAnimationFrame/polyfill-moz.js
	    (function (global) {
	      // window.requestAnimationFrame
	      global.requestAnimationFrame = function (callback) {
	        return mozRequestAnimationFrame(function () {
	          callback(global.performance.now());
	        });
	      };

	      // window.cancelAnimationFrame
	      global.cancelAnimationFrame = mozCancelAnimationFrame;
	    }(window));
	    } else {
	    (function (global) {
	      global.requestAnimationFrame = function (callback) {
	      return global.setTimeout(callback, 1000 / 60);
	      };

	      global.cancelAnimationFrame = global.clearTimeout;
	    })(window);
	    }
	  }
	})(this);

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["Holder"] = factory();
		else
			root["Holder"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		/*
		Holder.js - client side image placeholders
		(c) 2012-2015 Ivan Malopinsky - http://imsky.co
		*/

		module.exports = __webpack_require__(1);


	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(global) {/*
		Holder.js - client side image placeholders
		(c) 2012-2015 Ivan Malopinsky - http://imsky.co
		*/

		//Libraries and functions
		var onDomReady = __webpack_require__(2);
		var querystring = __webpack_require__(3);

		var SceneGraph = __webpack_require__(10);
		var utils = __webpack_require__(11);
		var SVG = __webpack_require__(12);
		var DOM = __webpack_require__(13);
		var Color = __webpack_require__(14);
		var constants = __webpack_require__(15);

		var svgRenderer = __webpack_require__(16);
		var sgCanvasRenderer = __webpack_require__(19);

		var extend = utils.extend;
		var dimensionCheck = utils.dimensionCheck;

		//Constants and definitions
		var SVG_NS = constants.svg_ns;

		var Holder = {
		    version: constants.version,

		    /**
		     * Adds a theme to default settings
		     *
		     * @param {string} name Theme name
		     * @param {Object} theme Theme object, with foreground, background, size, font, and fontweight properties.
		     */
		    addTheme: function(name, theme) {
		        name != null && theme != null && (App.settings.themes[name] = theme);
		        delete App.vars.cache.themeKeys;
		        return this;
		    },

		    /**
		     * Appends a placeholder to an element
		     *
		     * @param {string} src Placeholder URL string
		     * @param el A selector or a reference to a DOM node
		     */
		    addImage: function(src, el) {
		        //todo: use jquery fallback if available for all QSA references
		        var nodes = DOM.getNodeArray(el);
		        nodes.forEach(function (node) {
		            var img = DOM.newEl('img');
		            var domProps = {};
		            domProps[App.setup.dataAttr] = src;
		            DOM.setAttr(img, domProps);
		            node.appendChild(img);
		        });
		        return this;
		    },

		    /**
		     * Sets whether or not an image is updated on resize.
		     * If an image is set to be updated, it is immediately rendered.
		     *
		     * @param {Object} el Image DOM element
		     * @param {Boolean} value Resizable update flag value
		     */
		    setResizeUpdate: function(el, value) {
		        if (el.holderData) {
		            el.holderData.resizeUpdate = !!value;
		            if (el.holderData.resizeUpdate) {
		                updateResizableElements(el);
		            }
		        }
		    },

		    /**
		     * Runs Holder with options. By default runs Holder on all images with "holder.js" in their source attributes.
		     *
		     * @param {Object} userOptions Options object, can contain domain, themes, images, and bgnodes properties
		     */
		    run: function(userOptions) {
		        //todo: split processing into separate queues
		        userOptions = userOptions || {};
		        var engineSettings = {};
		        var options = extend(App.settings, userOptions);

		        App.vars.preempted = true;
		        App.vars.dataAttr = options.dataAttr || App.setup.dataAttr;

		        engineSettings.renderer = options.renderer ? options.renderer : App.setup.renderer;
		        if (App.setup.renderers.join(',').indexOf(engineSettings.renderer) === -1) {
		            engineSettings.renderer = App.setup.supportsSVG ? 'svg' : (App.setup.supportsCanvas ? 'canvas' : 'html');
		        }

		        var images = DOM.getNodeArray(options.images);
		        var bgnodes = DOM.getNodeArray(options.bgnodes);
		        var stylenodes = DOM.getNodeArray(options.stylenodes);
		        var objects = DOM.getNodeArray(options.objects);

		        engineSettings.stylesheets = [];
		        engineSettings.svgXMLStylesheet = true;
		        engineSettings.noFontFallback = options.noFontFallback ? options.noFontFallback : false;

		        stylenodes.forEach(function (styleNode) {
		            if (styleNode.attributes.rel && styleNode.attributes.href && styleNode.attributes.rel.value == 'stylesheet') {
		                var href = styleNode.attributes.href.value;
		                //todo: write isomorphic relative-to-absolute URL function
		                var proxyLink = DOM.newEl('a');
		                proxyLink.href = href;
		                var stylesheetURL = proxyLink.protocol + '//' + proxyLink.host + proxyLink.pathname + proxyLink.search;
		                engineSettings.stylesheets.push(stylesheetURL);
		            }
		        });

		        bgnodes.forEach(function (bgNode) {
		            //Skip processing background nodes if getComputedStyle is unavailable, since only modern browsers would be able to use canvas or SVG to render to background
		            if (!global.getComputedStyle) return;
		            var backgroundImage = global.getComputedStyle(bgNode, null).getPropertyValue('background-image');
		            var dataBackgroundImage = bgNode.getAttribute('data-background-src');
		            var rawURL = dataBackgroundImage || backgroundImage;

		            var holderURL = null;
		            var holderString = options.domain + '/';
		            var holderStringIndex = rawURL.indexOf(holderString);

		            if (holderStringIndex === 0) {
		                holderURL = rawURL;
		            } else if (holderStringIndex === 1 && rawURL[0] === '?') {
		                holderURL = rawURL.slice(1);
		            } else {
		                var fragment = rawURL.substr(holderStringIndex).match(/([^\"]*)"?\)/);
		                if (fragment !== null) {
		                    holderURL = fragment[1];
		                } else if (rawURL.indexOf('url(') === 0) {
		                    throw 'Holder: unable to parse background URL: ' + rawURL;
		                }
		            }

		            if (holderURL != null) {
		                var holderFlags = parseURL(holderURL, options);
		                if (holderFlags) {
		                    prepareDOMElement({
		                        mode: 'background',
		                        el: bgNode,
		                        flags: holderFlags,
		                        engineSettings: engineSettings
		                    });
		                }
		            }
		        });

		        objects.forEach(function (object) {
		            var objectAttr = {};

		            try {
		                objectAttr.data = object.getAttribute('data');
		                objectAttr.dataSrc = object.getAttribute(App.vars.dataAttr);
		            } catch (e) {}

		            var objectHasSrcURL = objectAttr.data != null && objectAttr.data.indexOf(options.domain) === 0;
		            var objectHasDataSrcURL = objectAttr.dataSrc != null && objectAttr.dataSrc.indexOf(options.domain) === 0;

		            if (objectHasSrcURL) {
		                prepareImageElement(options, engineSettings, objectAttr.data, object);
		            } else if (objectHasDataSrcURL) {
		                prepareImageElement(options, engineSettings, objectAttr.dataSrc, object);
		            }
		        });

		        images.forEach(function (image) {
		            var imageAttr = {};

		            try {
		                imageAttr.src = image.getAttribute('src');
		                imageAttr.dataSrc = image.getAttribute(App.vars.dataAttr);
		                imageAttr.rendered = image.getAttribute('data-holder-rendered');
		            } catch (e) {}

		            var imageHasSrc = imageAttr.src != null;
		            var imageHasDataSrcURL = imageAttr.dataSrc != null && imageAttr.dataSrc.indexOf(options.domain) === 0;
		            var imageRendered = imageAttr.rendered != null && imageAttr.rendered == 'true';

		            if (imageHasSrc) {
		                if (imageAttr.src.indexOf(options.domain) === 0) {
		                    prepareImageElement(options, engineSettings, imageAttr.src, image);
		                } else if (imageHasDataSrcURL) {
		                    //Image has a valid data-src and an invalid src
		                    if (imageRendered) {
		                        //If the placeholder has already been render, re-render it
		                        prepareImageElement(options, engineSettings, imageAttr.dataSrc, image);
		                    } else {
		                        //If the placeholder has not been rendered, check if the image exists and render a fallback if it doesn't
		                        (function(src, options, engineSettings, dataSrc, image) {
		                            utils.imageExists(src, function(exists) {
		                                if (!exists) {
		                                    prepareImageElement(options, engineSettings, dataSrc, image);
		                                }
		                            });
		                        })(imageAttr.src, options, engineSettings, imageAttr.dataSrc, image);
		                    }
		                }
		            } else if (imageHasDataSrcURL) {
		                prepareImageElement(options, engineSettings, imageAttr.dataSrc, image);
		            }
		        });

		        return this;
		    }
		};

		var App = {
		    settings: {
		        domain: 'holder.js',
		        images: 'img',
		        objects: 'object',
		        bgnodes: 'body .holderjs',
		        stylenodes: 'head link.holderjs',
		        themes: {
		            'gray': {
		                bg: '#EEEEEE',
		                fg: '#AAAAAA'
		            },
		            'social': {
		                bg: '#3a5a97',
		                fg: '#FFFFFF'
		            },
		            'industrial': {
		                bg: '#434A52',
		                fg: '#C2F200'
		            },
		            'sky': {
		                bg: '#0D8FDB',
		                fg: '#FFFFFF'
		            },
		            'vine': {
		                bg: '#39DBAC',
		                fg: '#1E292C'
		            },
		            'lava': {
		                bg: '#F8591A',
		                fg: '#1C2846'
		            }
		        }
		    },
		    defaults: {
		        size: 10,
		        units: 'pt',
		        scale: 1 / 16
		    }
		};

		/**
		 * Processes provided source attribute and sets up the appropriate rendering workflow
		 *
		 * @private
		 * @param options Instance options from Holder.run
		 * @param renderSettings Instance configuration
		 * @param src Image URL
		 * @param el Image DOM element
		 */
		function prepareImageElement(options, engineSettings, src, el) {
		    var holderFlags = parseURL(src.substr(src.lastIndexOf(options.domain)), options);
		    if (holderFlags) {
		        prepareDOMElement({
		            mode: null,
		            el: el,
		            flags: holderFlags,
		            engineSettings: engineSettings
		        });
		    }
		}

		/**
		 * Processes a Holder URL and extracts configuration from query string
		 *
		 * @private
		 * @param url URL
		 * @param instanceOptions Instance options from Holder.run
		 */
		function parseURL(url, instanceOptions) {
		    var holder = {
		        theme: extend(App.settings.themes.gray, null),
		        stylesheets: instanceOptions.stylesheets,
		        instanceOptions: instanceOptions
		    };

		    var firstQuestionMark = url.indexOf('?');
		    var parts = [url];

		    if (firstQuestionMark !== -1) {
		        parts = [url.slice(0, firstQuestionMark), url.slice(firstQuestionMark + 1)];
		    }

		    var basics = parts[0].split('/');

		    holder.holderURL = url;

		    var dimensions = basics[1];
		    var dimensionData = dimensions.match(/([\d]+p?)x([\d]+p?)/);

		    if (!dimensionData) return false;

		    holder.fluid = dimensions.indexOf('p') !== -1;

		    holder.dimensions = {
		        width: dimensionData[1].replace('p', '%'),
		        height: dimensionData[2].replace('p', '%')
		    };

		    if (parts.length === 2) {
		        var options = querystring.parse(parts[1]);

		        // Colors

		        if (options.bg) {
		            holder.theme.bg = utils.parseColor(options.bg);
		        }

		        if (options.fg) {
		            holder.theme.fg = utils.parseColor(options.fg);
		        }

		        //todo: add automatic foreground to themes without foreground
		        if (options.bg && !options.fg) {
		            holder.autoFg = true;
		        }

		        if (options.theme && holder.instanceOptions.themes.hasOwnProperty(options.theme)) {
		            holder.theme = extend(holder.instanceOptions.themes[options.theme], null);
		        }

		        // Text

		        if (options.text) {
		            holder.text = options.text;
		        }

		        if (options.textmode) {
		            holder.textmode = options.textmode;
		        }

		        if (options.size) {
		            holder.size = options.size;
		        }

		        if (options.font) {
		            holder.font = options.font;
		        }

		        if (options.align) {
		            holder.align = options.align;
		        }

		        if (options.lineWrap) {
		            holder.lineWrap = options.lineWrap;
		        }

		        holder.nowrap = utils.truthy(options.nowrap);

		        // Miscellaneous

		        holder.auto = utils.truthy(options.auto);

		        holder.outline = utils.truthy(options.outline);

		        if (utils.truthy(options.random)) {
		            App.vars.cache.themeKeys = App.vars.cache.themeKeys || Object.keys(holder.instanceOptions.themes);
		            var _theme = App.vars.cache.themeKeys[0 | Math.random() * App.vars.cache.themeKeys.length];
		            holder.theme = extend(holder.instanceOptions.themes[_theme], null);
		        }
		    }

		    return holder;
		}

		/**
		 * Modifies the DOM to fit placeholders and sets up resizable image callbacks (for fluid and automatically sized placeholders)
		 *
		 * @private
		 * @param settings DOM prep settings
		 */
		function prepareDOMElement(prepSettings) {
		    var mode = prepSettings.mode;
		    var el = prepSettings.el;
		    var flags = prepSettings.flags;
		    var _engineSettings = prepSettings.engineSettings;
		    var dimensions = flags.dimensions,
		        theme = flags.theme;
		    var dimensionsCaption = dimensions.width + 'x' + dimensions.height;
		    mode = mode == null ? (flags.fluid ? 'fluid' : 'image') : mode;
		    var holderTemplateRe = /holder_([a-z]+)/g;
		    var dimensionsInText = false;

		    if (flags.text != null) {
		        theme.text = flags.text;

		        //<object> SVG embedding doesn't parse Unicode properly
		        if (el.nodeName.toLowerCase() === 'object') {
		            var textLines = theme.text.split('\\n');
		            for (var k = 0; k < textLines.length; k++) {
		                textLines[k] = utils.encodeHtmlEntity(textLines[k]);
		            }
		            theme.text = textLines.join('\\n');
		        }
		    }

		    if (theme.text) {
		        var holderTemplateMatches = theme.text.match(holderTemplateRe);

		        if (holderTemplateMatches !== null) {
		            //todo: optimize template replacement
		            holderTemplateMatches.forEach(function (match) {
		                if (match === 'holder_dimensions') {
		                    theme.text = theme.text.replace(match, dimensionsCaption);
		                }
		            });
		        }
		    }

		    var holderURL = flags.holderURL;
		    var engineSettings = extend(_engineSettings, null);

		    if (flags.font) {
		        /*
		        If external fonts are used in a <img> placeholder rendered with SVG, Holder falls back to canvas.

		        This is done because Firefox and Chrome disallow embedded SVGs from referencing external assets.
		        The workaround is either to change the placeholder tag from <img> to <object> or to use the canvas renderer.
		        */
		        theme.font = flags.font;
		        if (!engineSettings.noFontFallback && el.nodeName.toLowerCase() === 'img' && App.setup.supportsCanvas && engineSettings.renderer === 'svg') {
		            engineSettings = extend(engineSettings, {
		                renderer: 'canvas'
		            });
		        }
		    }

		    //Chrome and Opera require a quick 10ms re-render if web fonts are used with canvas
		    if (flags.font && engineSettings.renderer == 'canvas') {
		        engineSettings.reRender = true;
		    }

		    if (mode == 'background') {
		        if (el.getAttribute('data-background-src') == null) {
		            DOM.setAttr(el, {
		                'data-background-src': holderURL
		            });
		        }
		    } else {
		        var domProps = {};
		        domProps[App.vars.dataAttr] = holderURL;
		        DOM.setAttr(el, domProps);
		    }

		    flags.theme = theme;

		    //todo consider using all renderSettings in holderData
		    el.holderData = {
		        flags: flags,
		        engineSettings: engineSettings
		    };

		    if (mode == 'image' || mode == 'fluid') {
		        DOM.setAttr(el, {
		            'alt': theme.text ? (dimensionsInText ? theme.text : theme.text + ' [' + dimensionsCaption + ']') : dimensionsCaption
		        });
		    }

		    var renderSettings = {
		        mode: mode,
		        el: el,
		        holderSettings: {
		            dimensions: dimensions,
		            theme: theme,
		            flags: flags
		        },
		        engineSettings: engineSettings
		    };

		    if (mode == 'image') {
		        if (!flags.auto) {
		            el.style.width = dimensions.width + 'px';
		            el.style.height = dimensions.height + 'px';
		        }

		        if (engineSettings.renderer == 'html') {
		            el.style.backgroundColor = theme.background;
		        } else {
		            render(renderSettings);

		            if (flags.textmode == 'exact') {
		                el.holderData.resizeUpdate = true;
		                App.vars.resizableImages.push(el);
		                updateResizableElements(el);
		            }
		        }
		    } else if (mode == 'background' && engineSettings.renderer != 'html') {
		        render(renderSettings);
		    } else if (mode == 'fluid') {
		        el.holderData.resizeUpdate = true;

		        if (dimensions.height.slice(-1) == '%') {
		            el.style.height = dimensions.height;
		        } else if (flags.auto == null || !flags.auto) {
		            el.style.height = dimensions.height + 'px';
		        }
		        if (dimensions.width.slice(-1) == '%') {
		            el.style.width = dimensions.width;
		        } else if (flags.auto == null || !flags.auto) {
		            el.style.width = dimensions.width + 'px';
		        }
		        if (el.style.display == 'inline' || el.style.display === '' || el.style.display == 'none') {
		            el.style.display = 'block';
		        }

		        setInitialDimensions(el);

		        if (engineSettings.renderer == 'html') {
		            el.style.backgroundColor = theme.background;
		        } else {
		            App.vars.resizableImages.push(el);
		            updateResizableElements(el);
		        }
		    }
		}

		/**
		 * Core function that takes output from renderers and sets it as the source or background-image of the target element
		 *
		 * @private
		 * @param renderSettings Renderer settings
		 */
		function render(renderSettings) {
		    var image = null;
		    var mode = renderSettings.mode;
		    var el = renderSettings.el;
		    var holderSettings = renderSettings.holderSettings;
		    var engineSettings = renderSettings.engineSettings;

		    switch (engineSettings.renderer) {
		        case 'svg':
		            if (!App.setup.supportsSVG) return;
		            break;
		        case 'canvas':
		            if (!App.setup.supportsCanvas) return;
		            break;
		        default:
		            return;
		    }

		    //todo: move generation of scene up to flag generation to reduce extra object creation
		    var scene = {
		        width: holderSettings.dimensions.width,
		        height: holderSettings.dimensions.height,
		        theme: holderSettings.theme,
		        flags: holderSettings.flags
		    };

		    var sceneGraph = buildSceneGraph(scene);

		    function getRenderedImage() {
		        var image = null;
		        switch (engineSettings.renderer) {
		            case 'canvas':
		                image = sgCanvasRenderer(sceneGraph, renderSettings);
		                break;
		            case 'svg':
		                image = svgRenderer(sceneGraph, renderSettings);
		                break;
		            default:
		                throw 'Holder: invalid renderer: ' + engineSettings.renderer;
		        }

		        return image;
		    }

		    image = getRenderedImage();

		    if (image == null) {
		        throw 'Holder: couldn\'t render placeholder';
		    }

		    //todo: add <object> canvas rendering
		    if (mode == 'background') {
		        el.style.backgroundImage = 'url(' + image + ')';
		        el.style.backgroundSize = scene.width + 'px ' + scene.height + 'px';
		    } else {
		        if (el.nodeName.toLowerCase() === 'img') {
		            DOM.setAttr(el, {
		                'src': image
		            });
		        } else if (el.nodeName.toLowerCase() === 'object') {
		            DOM.setAttr(el, {
		                'data': image,
		                'type': 'image/svg+xml'
		            });
		        }
		        if (engineSettings.reRender) {
		            global.setTimeout(function () {
		                var image = getRenderedImage();
		                if (image == null) {
		                    throw 'Holder: couldn\'t render placeholder';
		                }
		                //todo: refactor this code into a function
		                if (el.nodeName.toLowerCase() === 'img') {
		                    DOM.setAttr(el, {
		                        'src': image
		                    });
		                } else if (el.nodeName.toLowerCase() === 'object') {
		                    DOM.setAttr(el, {
		                        'data': image,
		                        'type': 'image/svg+xml'
		                    });
		                }
		            }, 150);
		        }
		    }
		    //todo: account for re-rendering
		    DOM.setAttr(el, {
		        'data-holder-rendered': true
		    });
		}

		/**
		 * Core function that takes a Holder scene description and builds a scene graph
		 *
		 * @private
		 * @param scene Holder scene object
		 */
		//todo: make this function reusable
		//todo: merge app defaults and setup properties into the scene argument
		function buildSceneGraph(scene) {
		    var fontSize = App.defaults.size;
		    if (parseFloat(scene.theme.size)) {
		        fontSize = scene.theme.size;
		    } else if (parseFloat(scene.flags.size)) {
		        fontSize = scene.flags.size;
		    }

		    scene.font = {
		        family: scene.theme.font ? scene.theme.font : 'Arial, Helvetica, Open Sans, sans-serif',
		        size: textSize(scene.width, scene.height, fontSize, App.defaults.scale),
		        units: scene.theme.units ? scene.theme.units : App.defaults.units,
		        weight: scene.theme.fontweight ? scene.theme.fontweight : 'bold'
		    };

		    scene.text = scene.theme.text || Math.floor(scene.width) + 'x' + Math.floor(scene.height);

		    scene.noWrap = scene.theme.nowrap || scene.flags.nowrap;

		    scene.align = scene.theme.align || scene.flags.align || 'center';

		    switch (scene.flags.textmode) {
		        case 'literal':
		            scene.text = scene.flags.dimensions.width + 'x' + scene.flags.dimensions.height;
		            break;
		        case 'exact':
		            if (!scene.flags.exactDimensions) break;
		            scene.text = Math.floor(scene.flags.exactDimensions.width) + 'x' + Math.floor(scene.flags.exactDimensions.height);
		            break;
		    }

		    var lineWrap = scene.flags.lineWrap || App.setup.lineWrapRatio;
		    var sceneMargin = scene.width * lineWrap;
		    var maxLineWidth = sceneMargin;

		    var sceneGraph = new SceneGraph({
		        width: scene.width,
		        height: scene.height
		    });

		    var Shape = sceneGraph.Shape;

		    var holderBg = new Shape.Rect('holderBg', {
		        fill: scene.theme.bg
		    });

		    holderBg.resize(scene.width, scene.height);
		    sceneGraph.root.add(holderBg);

		    if (scene.flags.outline) {
		        var outlineColor = new Color(holderBg.properties.fill);
		        outlineColor = outlineColor.lighten(outlineColor.lighterThan('7f7f7f') ? -0.1 : 0.1);
		        holderBg.properties.outline = {
		            fill: outlineColor.toHex(true),
		            width: 2
		        };
		    }

		    var holderTextColor = scene.theme.fg;

		    if (scene.flags.autoFg) {
		        var holderBgColor = new Color(holderBg.properties.fill);
		        var lightColor = new Color('fff');
		        var darkColor = new Color('000', {
		            'alpha': 0.285714
		        });

		        holderTextColor = holderBgColor.blendAlpha(holderBgColor.lighterThan('7f7f7f') ? darkColor : lightColor).toHex(true);
		    }

		    var holderTextGroup = new Shape.Group('holderTextGroup', {
		        text: scene.text,
		        align: scene.align,
		        font: scene.font,
		        fill: holderTextColor
		    });

		    holderTextGroup.moveTo(null, null, 1);
		    sceneGraph.root.add(holderTextGroup);

		    var tpdata = holderTextGroup.textPositionData = stagingRenderer(sceneGraph);
		    if (!tpdata) {
		        throw 'Holder: staging fallback not supported yet.';
		    }
		    holderTextGroup.properties.leading = tpdata.boundingBox.height;

		    var textNode = null;
		    var line = null;

		    function finalizeLine(parent, line, width, height) {
		        line.width = width;
		        line.height = height;
		        parent.width = Math.max(parent.width, line.width);
		        parent.height += line.height;
		    }

		    if (tpdata.lineCount > 1) {
		        var offsetX = 0;
		        var offsetY = 0;
		        var lineIndex = 0;
		        var lineKey;
		        line = new Shape.Group('line' + lineIndex);

		        //Double margin so that left/right-aligned next is not flush with edge of image
		        if (scene.align === 'left' || scene.align === 'right') {
		            maxLineWidth = scene.width * (1 - (1 - lineWrap) * 2);
		        }

		        for (var i = 0; i < tpdata.words.length; i++) {
		            var word = tpdata.words[i];
		            textNode = new Shape.Text(word.text);
		            var newline = word.text == '\\n';
		            if (!scene.noWrap && (offsetX + word.width >= maxLineWidth || newline === true)) {
		                finalizeLine(holderTextGroup, line, offsetX, holderTextGroup.properties.leading);
		                holderTextGroup.add(line);
		                offsetX = 0;
		                offsetY += holderTextGroup.properties.leading;
		                lineIndex += 1;
		                line = new Shape.Group('line' + lineIndex);
		                line.y = offsetY;
		            }
		            if (newline === true) {
		                continue;
		            }
		            textNode.moveTo(offsetX, 0);
		            offsetX += tpdata.spaceWidth + word.width;
		            line.add(textNode);
		        }

		        finalizeLine(holderTextGroup, line, offsetX, holderTextGroup.properties.leading);
		        holderTextGroup.add(line);

		        if (scene.align === 'left') {
		            holderTextGroup.moveTo(scene.width - sceneMargin, null, null);
		        } else if (scene.align === 'right') {
		            for (lineKey in holderTextGroup.children) {
		                line = holderTextGroup.children[lineKey];
		                line.moveTo(scene.width - line.width, null, null);
		            }

		            holderTextGroup.moveTo(0 - (scene.width - sceneMargin), null, null);
		        } else {
		            for (lineKey in holderTextGroup.children) {
		                line = holderTextGroup.children[lineKey];
		                line.moveTo((holderTextGroup.width - line.width) / 2, null, null);
		            }

		            holderTextGroup.moveTo((scene.width - holderTextGroup.width) / 2, null, null);
		        }

		        holderTextGroup.moveTo(null, (scene.height - holderTextGroup.height) / 2, null);

		        //If the text exceeds vertical space, move it down so the first line is visible
		        if ((scene.height - holderTextGroup.height) / 2 < 0) {
		            holderTextGroup.moveTo(null, 0, null);
		        }
		    } else {
		        textNode = new Shape.Text(scene.text);
		        line = new Shape.Group('line0');
		        line.add(textNode);
		        holderTextGroup.add(line);

		        if (scene.align === 'left') {
		            holderTextGroup.moveTo(scene.width - sceneMargin, null, null);
		        } else if (scene.align === 'right') {
		            holderTextGroup.moveTo(0 - (scene.width - sceneMargin), null, null);
		        } else {
		            holderTextGroup.moveTo((scene.width - tpdata.boundingBox.width) / 2, null, null);
		        }

		        holderTextGroup.moveTo(null, (scene.height - tpdata.boundingBox.height) / 2, null);
		    }

		    //todo: renderlist
		    return sceneGraph;
		}

		/**
		 * Adaptive text sizing function
		 *
		 * @private
		 * @param width Parent width
		 * @param height Parent height
		 * @param fontSize Requested text size
		 * @param scale Proportional scale of text
		 */
		function textSize(width, height, fontSize, scale) {
		    var stageWidth = parseInt(width, 10);
		    var stageHeight = parseInt(height, 10);

		    var bigSide = Math.max(stageWidth, stageHeight);
		    var smallSide = Math.min(stageWidth, stageHeight);

		    var newHeight = 0.8 * Math.min(smallSide, bigSide * scale);
		    return Math.round(Math.max(fontSize, newHeight));
		}

		/**
		 * Iterates over resizable (fluid or auto) placeholders and renders them
		 *
		 * @private
		 * @param element Optional element selector, specified only if a specific element needs to be re-rendered
		 */
		function updateResizableElements(element) {
		    var images;
		    if (element == null || element.nodeType == null) {
		        images = App.vars.resizableImages;
		    } else {
		        images = [element];
		    }
		    for (var i = 0, l = images.length; i < l; i++) {
		        var el = images[i];
		        if (el.holderData) {
		            var flags = el.holderData.flags;
		            var dimensions = dimensionCheck(el);
		            if (dimensions) {
		                if (!el.holderData.resizeUpdate) {
		                    continue;
		                }

		                if (flags.fluid && flags.auto) {
		                    var fluidConfig = el.holderData.fluidConfig;
		                    switch (fluidConfig.mode) {
		                        case 'width':
		                            dimensions.height = dimensions.width / fluidConfig.ratio;
		                            break;
		                        case 'height':
		                            dimensions.width = dimensions.height * fluidConfig.ratio;
		                            break;
		                    }
		                }

		                var settings = {
		                    mode: 'image',
		                    holderSettings: {
		                        dimensions: dimensions,
		                        theme: flags.theme,
		                        flags: flags
		                    },
		                    el: el,
		                    engineSettings: el.holderData.engineSettings
		                };

		                if (flags.textmode == 'exact') {
		                    flags.exactDimensions = dimensions;
		                    settings.holderSettings.dimensions = flags.dimensions;
		                }

		                render(settings);
		            } else {
		                setInvisible(el);
		            }
		        }
		    }
		}

		/**
		 * Sets up aspect ratio metadata for fluid placeholders, in order to preserve proportions when resizing
		 *
		 * @private
		 * @param el Image DOM element
		 */
		function setInitialDimensions(el) {
		    if (el.holderData) {
		        var dimensions = dimensionCheck(el);
		        if (dimensions) {
		            var flags = el.holderData.flags;

		            var fluidConfig = {
		                fluidHeight: flags.dimensions.height.slice(-1) == '%',
		                fluidWidth: flags.dimensions.width.slice(-1) == '%',
		                mode: null,
		                initialDimensions: dimensions
		            };

		            if (fluidConfig.fluidWidth && !fluidConfig.fluidHeight) {
		                fluidConfig.mode = 'width';
		                fluidConfig.ratio = fluidConfig.initialDimensions.width / parseFloat(flags.dimensions.height);
		            } else if (!fluidConfig.fluidWidth && fluidConfig.fluidHeight) {
		                fluidConfig.mode = 'height';
		                fluidConfig.ratio = parseFloat(flags.dimensions.width) / fluidConfig.initialDimensions.height;
		            }

		            el.holderData.fluidConfig = fluidConfig;
		        } else {
		            setInvisible(el);
		        }
		    }
		}

		/**
		 * Iterates through all current invisible images, and if they're visible, renders them and removes them from further checks. Runs every animation frame.
		 *
		 * @private
		 */
		function visibilityCheck() {
		    var renderableImages = [];
		    var keys = Object.keys(App.vars.invisibleImages);
		    var el;

		    keys.forEach(function (key) {
		        el = App.vars.invisibleImages[key];
		        if (dimensionCheck(el) && el.nodeName.toLowerCase() == 'img') {
		            renderableImages.push(el);
		            delete App.vars.invisibleImages[key];
		        }
		    });

		    if (renderableImages.length) {
		        Holder.run({
		            images: renderableImages
		        });
		    }

		    // Done to prevent 100% CPU usage via aggressive calling of requestAnimationFrame
		    setTimeout(function () {
		        global.requestAnimationFrame(visibilityCheck);
		    }, 10);
		}

		/**
		 * Starts checking for invisible placeholders if not doing so yet. Does nothing otherwise.
		 *
		 * @private
		 */
		function startVisibilityCheck() {
		    if (!App.vars.visibilityCheckStarted) {
		        global.requestAnimationFrame(visibilityCheck);
		        App.vars.visibilityCheckStarted = true;
		    }
		}

		/**
		 * Sets a unique ID for an image detected to be invisible and adds it to the map of invisible images checked by visibilityCheck
		 *
		 * @private
		 * @param el Invisible DOM element
		 */
		function setInvisible(el) {
		    if (!el.holderData.invisibleId) {
		        App.vars.invisibleId += 1;
		        App.vars.invisibleImages['i' + App.vars.invisibleId] = el;
		        el.holderData.invisibleId = App.vars.invisibleId;
		    }
		}

		//todo: see if possible to convert stagingRenderer to use HTML only
		var stagingRenderer = (function() {
		    var svg = null,
		        stagingText = null,
		        stagingTextNode = null;
		    return function(graph) {
		        var rootNode = graph.root;
		        if (App.setup.supportsSVG) {
		            var firstTimeSetup = false;
		            var tnode = function(text) {
		                return document.createTextNode(text);
		            };
		            if (svg == null || svg.parentNode !== document.body) {
		                firstTimeSetup = true;
		            }

		            svg = SVG.initSVG(svg, rootNode.properties.width, rootNode.properties.height);
		            //Show staging element before staging
		            svg.style.display = 'block';

		            if (firstTimeSetup) {
		                stagingText = DOM.newEl('text', SVG_NS);
		                stagingTextNode = tnode(null);
		                DOM.setAttr(stagingText, {
		                    x: 0
		                });
		                stagingText.appendChild(stagingTextNode);
		                svg.appendChild(stagingText);
		                document.body.appendChild(svg);
		                svg.style.visibility = 'hidden';
		                svg.style.position = 'absolute';
		                svg.style.top = '-100%';
		                svg.style.left = '-100%';
		                //todo: workaround for zero-dimension <svg> tag in Opera 12
		                //svg.setAttribute('width', 0);
		                //svg.setAttribute('height', 0);
		            }

		            var holderTextGroup = rootNode.children.holderTextGroup;
		            var htgProps = holderTextGroup.properties;
		            DOM.setAttr(stagingText, {
		                'y': htgProps.font.size,
		                'style': utils.cssProps({
		                    'font-weight': htgProps.font.weight,
		                    'font-size': htgProps.font.size + htgProps.font.units,
		                    'font-family': htgProps.font.family
		                })
		            });

		            //Get bounding box for the whole string (total width and height)
		            stagingTextNode.nodeValue = htgProps.text;
		            var stagingTextBBox = stagingText.getBBox();

		            //Get line count and split the string into words
		            var lineCount = Math.ceil(stagingTextBBox.width / rootNode.properties.width);
		            var words = htgProps.text.split(' ');
		            var newlines = htgProps.text.match(/\\n/g);
		            lineCount += newlines == null ? 0 : newlines.length;

		            //Get bounding box for the string with spaces removed
		            stagingTextNode.nodeValue = htgProps.text.replace(/[ ]+/g, '');
		            var computedNoSpaceLength = stagingText.getComputedTextLength();

		            //Compute average space width
		            var diffLength = stagingTextBBox.width - computedNoSpaceLength;
		            var spaceWidth = Math.round(diffLength / Math.max(1, words.length - 1));

		            //Get widths for every word with space only if there is more than one line
		            var wordWidths = [];
		            if (lineCount > 1) {
		                stagingTextNode.nodeValue = '';
		                for (var i = 0; i < words.length; i++) {
		                    if (words[i].length === 0) continue;
		                    stagingTextNode.nodeValue = utils.decodeHtmlEntity(words[i]);
		                    var bbox = stagingText.getBBox();
		                    wordWidths.push({
		                        text: words[i],
		                        width: bbox.width
		                    });
		                }
		            }

		            //Hide staging element after staging
		            svg.style.display = 'none';

		            return {
		                spaceWidth: spaceWidth,
		                lineCount: lineCount,
		                boundingBox: stagingTextBBox,
		                words: wordWidths
		            };
		        } else {
		            //todo: canvas fallback for measuring text on android 2.3
		            return false;
		        }
		    };
		})();

		//Helpers

		/**
		 * Prevents a function from being called too often, waits until a timer elapses to call it again
		 *
		 * @param fn Function to call
		 */
		function debounce(fn) {
		    if (!App.vars.debounceTimer) fn.call(this);
		    if (App.vars.debounceTimer) global.clearTimeout(App.vars.debounceTimer);
		    App.vars.debounceTimer = global.setTimeout(function() {
		        App.vars.debounceTimer = null;
		        fn.call(this);
		    }, App.setup.debounce);
		}

		/**
		 * Holder-specific resize/orientation change callback, debounced to prevent excessive execution
		 */
		function resizeEvent() {
		    debounce(function() {
		        updateResizableElements(null);
		    });
		}

		//Set up flags

		for (var flag in App.flags) {
		    if (!App.flags.hasOwnProperty(flag)) continue;
		    App.flags[flag].match = function(val) {
		        return val.match(this.regex);
		    };
		}

		//Properties set once on setup

		App.setup = {
		    renderer: 'html',
		    debounce: 100,
		    ratio: 1,
		    supportsCanvas: false,
		    supportsSVG: false,
		    lineWrapRatio: 0.9,
		    dataAttr: 'data-src',
		    renderers: ['html', 'canvas', 'svg']
		};

		//Properties modified during runtime

		App.vars = {
		    preempted: false,
		    resizableImages: [],
		    invisibleImages: {},
		    invisibleId: 0,
		    visibilityCheckStarted: false,
		    debounceTimer: null,
		    cache: {}
		};

		//Pre-flight

		(function() {
		    var canvas = DOM.newEl('canvas');

		    if (canvas.getContext) {
		        if (canvas.toDataURL('image/png').indexOf('data:image/png') != -1) {
		            App.setup.renderer = 'canvas';
		            App.setup.supportsCanvas = true;
		        }
		    }

		    if (!!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect) {
		        App.setup.renderer = 'svg';
		        App.setup.supportsSVG = true;
		    }
		})();

		//Starts checking for invisible placeholders
		startVisibilityCheck();

		if (onDomReady) {
		    onDomReady(function() {
		        if (!App.vars.preempted) {
		            Holder.run();
		        }
		        if (global.addEventListener) {
		            global.addEventListener('resize', resizeEvent, false);
		            global.addEventListener('orientationchange', resizeEvent, false);
		        } else {
		            global.attachEvent('onresize', resizeEvent);
		        }

		        if (typeof global.Turbolinks == 'object') {
		            global.document.addEventListener('page:change', function() {
		                Holder.run();
		            });
		        }
		    });
		}

		module.exports = Holder;

		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		/*!
		 * onDomReady.js 1.4.0 (c) 2013 Tubal Martin - MIT license
		 *
		 * Specially modified to work with Holder.js
		 */

		function _onDomReady(win) {
		    //Lazy loading fix for Firefox < 3.6
		    //http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
		    if (document.readyState == null && document.addEventListener) {
		        document.addEventListener("DOMContentLoaded", function DOMContentLoaded() {
		            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
		            document.readyState = "complete";
		        }, false);
		        document.readyState = "loading";
		    }

		    var doc = win.document,
		        docElem = doc.documentElement,

		        LOAD = "load",
		        FALSE = false,
		        ONLOAD = "on"+LOAD,
		        COMPLETE = "complete",
		        READYSTATE = "readyState",
		        ATTACHEVENT = "attachEvent",
		        DETACHEVENT = "detachEvent",
		        ADDEVENTLISTENER = "addEventListener",
		        DOMCONTENTLOADED = "DOMContentLoaded",
		        ONREADYSTATECHANGE = "onreadystatechange",
		        REMOVEEVENTLISTENER = "removeEventListener",

		        // W3C Event model
		        w3c = ADDEVENTLISTENER in doc,
		        _top = FALSE,

		        // isReady: Is the DOM ready to be used? Set to true once it occurs.
		        isReady = FALSE,

		        // Callbacks pending execution until DOM is ready
		        callbacks = [];

		    // Handle when the DOM is ready
		    function ready( fn ) {
		        if ( !isReady ) {

		            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		            if ( !doc.body ) {
		                return defer( ready );
		            }

		            // Remember that the DOM is ready
		            isReady = true;

		            // Execute all callbacks
		            while ( fn = callbacks.shift() ) {
		                defer( fn );
		            }
		        }
		    }

		    // The ready event handler
		    function completed( event ) {
		        // readyState === "complete" is good enough for us to call the dom ready in oldIE
		        if ( w3c || event.type === LOAD || doc[READYSTATE] === COMPLETE ) {
		            detach();
		            ready();
		        }
		    }

		    // Clean-up method for dom ready events
		    function detach() {
		        if ( w3c ) {
		            doc[REMOVEEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );
		            win[REMOVEEVENTLISTENER]( LOAD, completed, FALSE );
		        } else {
		            doc[DETACHEVENT]( ONREADYSTATECHANGE, completed );
		            win[DETACHEVENT]( ONLOAD, completed );
		        }
		    }

		    // Defers a function, scheduling it to run after the current call stack has cleared.
		    function defer( fn, wait ) {
		        // Allow 0 to be passed
		        setTimeout( fn, +wait >= 0 ? wait : 1 );
		    }

		    // Attach the listeners:

		    // Catch cases where onDomReady is called after the browser event has already occurred.
		    // we once tried to use readyState "interactive" here, but it caused issues like the one
		    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		    if ( doc[READYSTATE] === COMPLETE ) {
		        // Handle it asynchronously to allow scripts the opportunity to delay ready
		        defer( ready );

		    // Standards-based browsers support DOMContentLoaded
		    } else if ( w3c ) {
		        // Use the handy event callback
		        doc[ADDEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );

		        // A fallback to window.onload, that will always work
		        win[ADDEVENTLISTENER]( LOAD, completed, FALSE );

		    // If IE event model is used
		    } else {
		        // Ensure firing before onload, maybe late but safe also for iframes
		        doc[ATTACHEVENT]( ONREADYSTATECHANGE, completed );

		        // A fallback to window.onload, that will always work
		        win[ATTACHEVENT]( ONLOAD, completed );

		        // If IE and not a frame
		        // continually check to see if the document is ready
		        try {
		            _top = win.frameElement == null && docElem;
		        } catch(e) {}

		        if ( _top && _top.doScroll ) {
		            (function doScrollCheck() {
		                if ( !isReady ) {
		                    try {
		                        // Use the trick by Diego Perini
		                        // http://javascript.nwbox.com/IEContentLoaded/
		                        _top.doScroll("left");
		                    } catch(e) {
		                        return defer( doScrollCheck, 50 );
		                    }

		                    // detach all dom ready events
		                    detach();

		                    // and execute any waiting functions
		                    ready();
		                }
		            })();
		        }
		    }

		    function onDomReady( fn ) {
		        // If DOM is ready, execute the function (async), otherwise wait
		        isReady ? defer( fn ) : callbacks.push( fn );
		    }

		    // Add version
		    onDomReady.version = "1.4.0";
		    // Add method to check if DOM is ready
		    onDomReady.isReady = function(){
		        return isReady;
		    };

		    return onDomReady;
		}

		module.exports = typeof window !== "undefined" && _onDomReady(window);

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		//Modified version of component/querystring
		//Changes: updated dependencies, dot notation parsing, JSHint fixes
		//Fork at https://github.com/imsky/querystring

		/**
		 * Module dependencies.
		 */

		var encode = encodeURIComponent;
		var decode = decodeURIComponent;
		var trim = __webpack_require__(4);
		var type = __webpack_require__(5);

		var arrayRegex = /(\w+)\[(\d+)\]/;
		var objectRegex = /\w+\.\w+/;

		/**
		 * Parse the given query `str`.
		 *
		 * @param {String} str
		 * @return {Object}
		 * @api public
		 */

		exports.parse = function(str){
		  if ('string' !== typeof str) return {};

		  str = trim(str);
		  if ('' === str) return {};
		  if ('?' === str.charAt(0)) str = str.slice(1);

		  var obj = {};
		  var pairs = str.split('&');
		  for (var i = 0; i < pairs.length; i++) {
		    var parts = pairs[i].split('=');
		    var key = decode(parts[0]);
		    var m, ctx, prop;

		    if (m = arrayRegex.exec(key)) {
		      obj[m[1]] = obj[m[1]] || [];
		      obj[m[1]][m[2]] = decode(parts[1]);
		      continue;
		    }

		    if (m = objectRegex.test(key)) {
		      m = key.split('.');
		      ctx = obj;

		      while (m.length) {
		        prop = m.shift();

		        if (!prop.length) continue;

		        if (!ctx[prop]) {
		          ctx[prop] = {};
		        } else if (ctx[prop] && typeof ctx[prop] !== 'object') {
		          break;
		        }

		        if (!m.length) {
		          ctx[prop] = decode(parts[1]);
		        }

		        ctx = ctx[prop];
		      }

		      continue;
		    }

		    obj[parts[0]] = null == parts[1] ? '' : decode(parts[1]);
		  }

		  return obj;
		};

		/**
		 * Stringify the given `obj`.
		 *
		 * @param {Object} obj
		 * @return {String}
		 * @api public
		 */

		exports.stringify = function(obj){
		  if (!obj) return '';
		  var pairs = [];

		  for (var key in obj) {
		    var value = obj[key];

		    if ('array' == type(value)) {
		      for (var i = 0; i < value.length; ++i) {
		        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
		      }
		      continue;
		    }

		    pairs.push(encode(key) + '=' + encode(obj[key]));
		  }

		  return pairs.join('&');
		};


	/***/ },
	/* 4 */
	/***/ function(module, exports) {


		exports = module.exports = trim;

		function trim(str){
		  return str.replace(/^\s*|\s*$/g, '');
		}

		exports.left = function(str){
		  return str.replace(/^\s*/, '');
		};

		exports.right = function(str){
		  return str.replace(/\s*$/, '');
		};


	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(Buffer) {/**
		 * toString ref.
		 */

		var toString = Object.prototype.toString;

		/**
		 * Return the type of `val`.
		 *
		 * @param {Mixed} val
		 * @return {String}
		 * @api public
		 */

		module.exports = function(val){
		  switch (toString.call(val)) {
		    case '[object Date]': return 'date';
		    case '[object RegExp]': return 'regexp';
		    case '[object Arguments]': return 'arguments';
		    case '[object Array]': return 'array';
		    case '[object Error]': return 'error';
		  }

		  if (val === null) return 'null';
		  if (val === undefined) return 'undefined';
		  if (val !== val) return 'nan';
		  if (val && val.nodeType === 1) return 'element';

		  if (typeof Buffer != 'undefined' && Buffer.isBuffer(val)) return 'buffer';

		  val = val.valueOf
		    ? val.valueOf()
		    : Object.prototype.valueOf.apply(val)

		  return typeof val;
		};

		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer))

	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
		 * The buffer module from node.js, for the browser.
		 *
		 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
		 * @license  MIT
		 */
		/* eslint-disable no-proto */

		var base64 = __webpack_require__(7)
		var ieee754 = __webpack_require__(8)
		var isArray = __webpack_require__(9)

		exports.Buffer = Buffer
		exports.SlowBuffer = SlowBuffer
		exports.INSPECT_MAX_BYTES = 50
		Buffer.poolSize = 8192 // not used by this implementation

		var rootParent = {}

		/**
		 * If `Buffer.TYPED_ARRAY_SUPPORT`:
		 *   === true    Use Uint8Array implementation (fastest)
		 *   === false   Use Object implementation (most compatible, even IE6)
		 *
		 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
		 * Opera 11.6+, iOS 4.2+.
		 *
		 * Due to various browser bugs, sometimes the Object implementation will be used even
		 * when the browser supports typed arrays.
		 *
		 * Note:
		 *
		 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
		 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
		 *
		 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
		 *     on objects.
		 *
		 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
		 *
		 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
		 *     incorrect length in some situations.

		 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
		 * get the Object implementation, which is slower but behaves correctly.
		 */
		Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
		  ? global.TYPED_ARRAY_SUPPORT
		  : typedArraySupport()

		function typedArraySupport () {
		  function Bar () {}
		  try {
		    var arr = new Uint8Array(1)
		    arr.foo = function () { return 42 }
		    arr.constructor = Bar
		    return arr.foo() === 42 && // typed array instances can be augmented
		        arr.constructor === Bar && // constructor can be set
		        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
		        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
		  } catch (e) {
		    return false
		  }
		}

		function kMaxLength () {
		  return Buffer.TYPED_ARRAY_SUPPORT
		    ? 0x7fffffff
		    : 0x3fffffff
		}

		/**
		 * Class: Buffer
		 * =============
		 *
		 * The Buffer constructor returns instances of `Uint8Array` that are augmented
		 * with function properties for all the node `Buffer` API functions. We use
		 * `Uint8Array` so that square bracket notation works as expected -- it returns
		 * a single octet.
		 *
		 * By augmenting the instances, we can avoid modifying the `Uint8Array`
		 * prototype.
		 */
		function Buffer (arg) {
		  if (!(this instanceof Buffer)) {
		    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
		    if (arguments.length > 1) return new Buffer(arg, arguments[1])
		    return new Buffer(arg)
		  }

		  this.length = 0
		  this.parent = undefined

		  // Common case.
		  if (typeof arg === 'number') {
		    return fromNumber(this, arg)
		  }

		  // Slightly less common case.
		  if (typeof arg === 'string') {
		    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
		  }

		  // Unusual.
		  return fromObject(this, arg)
		}

		function fromNumber (that, length) {
		  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
		  if (!Buffer.TYPED_ARRAY_SUPPORT) {
		    for (var i = 0; i < length; i++) {
		      that[i] = 0
		    }
		  }
		  return that
		}

		function fromString (that, string, encoding) {
		  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

		  // Assumption: byteLength() return value is always < kMaxLength.
		  var length = byteLength(string, encoding) | 0
		  that = allocate(that, length)

		  that.write(string, encoding)
		  return that
		}

		function fromObject (that, object) {
		  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

		  if (isArray(object)) return fromArray(that, object)

		  if (object == null) {
		    throw new TypeError('must start with number, buffer, array or string')
		  }

		  if (typeof ArrayBuffer !== 'undefined') {
		    if (object.buffer instanceof ArrayBuffer) {
		      return fromTypedArray(that, object)
		    }
		    if (object instanceof ArrayBuffer) {
		      return fromArrayBuffer(that, object)
		    }
		  }

		  if (object.length) return fromArrayLike(that, object)

		  return fromJsonObject(that, object)
		}

		function fromBuffer (that, buffer) {
		  var length = checked(buffer.length) | 0
		  that = allocate(that, length)
		  buffer.copy(that, 0, 0, length)
		  return that
		}

		function fromArray (that, array) {
		  var length = checked(array.length) | 0
		  that = allocate(that, length)
		  for (var i = 0; i < length; i += 1) {
		    that[i] = array[i] & 255
		  }
		  return that
		}

		// Duplicate of fromArray() to keep fromArray() monomorphic.
		function fromTypedArray (that, array) {
		  var length = checked(array.length) | 0
		  that = allocate(that, length)
		  // Truncating the elements is probably not what people expect from typed
		  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
		  // of the old Buffer constructor.
		  for (var i = 0; i < length; i += 1) {
		    that[i] = array[i] & 255
		  }
		  return that
		}

		function fromArrayBuffer (that, array) {
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    // Return an augmented `Uint8Array` instance, for best performance
		    array.byteLength
		    that = Buffer._augment(new Uint8Array(array))
		  } else {
		    // Fallback: Return an object instance of the Buffer class
		    that = fromTypedArray(that, new Uint8Array(array))
		  }
		  return that
		}

		function fromArrayLike (that, array) {
		  var length = checked(array.length) | 0
		  that = allocate(that, length)
		  for (var i = 0; i < length; i += 1) {
		    that[i] = array[i] & 255
		  }
		  return that
		}

		// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
		// Returns a zero-length buffer for inputs that don't conform to the spec.
		function fromJsonObject (that, object) {
		  var array
		  var length = 0

		  if (object.type === 'Buffer' && isArray(object.data)) {
		    array = object.data
		    length = checked(array.length) | 0
		  }
		  that = allocate(that, length)

		  for (var i = 0; i < length; i += 1) {
		    that[i] = array[i] & 255
		  }
		  return that
		}

		if (Buffer.TYPED_ARRAY_SUPPORT) {
		  Buffer.prototype.__proto__ = Uint8Array.prototype
		  Buffer.__proto__ = Uint8Array
		}

		function allocate (that, length) {
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    // Return an augmented `Uint8Array` instance, for best performance
		    that = Buffer._augment(new Uint8Array(length))
		    that.__proto__ = Buffer.prototype
		  } else {
		    // Fallback: Return an object instance of the Buffer class
		    that.length = length
		    that._isBuffer = true
		  }

		  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
		  if (fromPool) that.parent = rootParent

		  return that
		}

		function checked (length) {
		  // Note: cannot use `length < kMaxLength` here because that fails when
		  // length is NaN (which is otherwise coerced to zero.)
		  if (length >= kMaxLength()) {
		    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
		                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
		  }
		  return length | 0
		}

		function SlowBuffer (subject, encoding) {
		  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

		  var buf = new Buffer(subject, encoding)
		  delete buf.parent
		  return buf
		}

		Buffer.isBuffer = function isBuffer (b) {
		  return !!(b != null && b._isBuffer)
		}

		Buffer.compare = function compare (a, b) {
		  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
		    throw new TypeError('Arguments must be Buffers')
		  }

		  if (a === b) return 0

		  var x = a.length
		  var y = b.length

		  var i = 0
		  var len = Math.min(x, y)
		  while (i < len) {
		    if (a[i] !== b[i]) break

		    ++i
		  }

		  if (i !== len) {
		    x = a[i]
		    y = b[i]
		  }

		  if (x < y) return -1
		  if (y < x) return 1
		  return 0
		}

		Buffer.isEncoding = function isEncoding (encoding) {
		  switch (String(encoding).toLowerCase()) {
		    case 'hex':
		    case 'utf8':
		    case 'utf-8':
		    case 'ascii':
		    case 'binary':
		    case 'base64':
		    case 'raw':
		    case 'ucs2':
		    case 'ucs-2':
		    case 'utf16le':
		    case 'utf-16le':
		      return true
		    default:
		      return false
		  }
		}

		Buffer.concat = function concat (list, length) {
		  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

		  if (list.length === 0) {
		    return new Buffer(0)
		  }

		  var i
		  if (length === undefined) {
		    length = 0
		    for (i = 0; i < list.length; i++) {
		      length += list[i].length
		    }
		  }

		  var buf = new Buffer(length)
		  var pos = 0
		  for (i = 0; i < list.length; i++) {
		    var item = list[i]
		    item.copy(buf, pos)
		    pos += item.length
		  }
		  return buf
		}

		function byteLength (string, encoding) {
		  if (typeof string !== 'string') string = '' + string

		  var len = string.length
		  if (len === 0) return 0

		  // Use a for loop to avoid recursion
		  var loweredCase = false
		  for (;;) {
		    switch (encoding) {
		      case 'ascii':
		      case 'binary':
		      // Deprecated
		      case 'raw':
		      case 'raws':
		        return len
		      case 'utf8':
		      case 'utf-8':
		        return utf8ToBytes(string).length
		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return len * 2
		      case 'hex':
		        return len >>> 1
		      case 'base64':
		        return base64ToBytes(string).length
		      default:
		        if (loweredCase) return utf8ToBytes(string).length // assume utf8
		        encoding = ('' + encoding).toLowerCase()
		        loweredCase = true
		    }
		  }
		}
		Buffer.byteLength = byteLength

		// pre-set for values that may exist in the future
		Buffer.prototype.length = undefined
		Buffer.prototype.parent = undefined

		function slowToString (encoding, start, end) {
		  var loweredCase = false

		  start = start | 0
		  end = end === undefined || end === Infinity ? this.length : end | 0

		  if (!encoding) encoding = 'utf8'
		  if (start < 0) start = 0
		  if (end > this.length) end = this.length
		  if (end <= start) return ''

		  while (true) {
		    switch (encoding) {
		      case 'hex':
		        return hexSlice(this, start, end)

		      case 'utf8':
		      case 'utf-8':
		        return utf8Slice(this, start, end)

		      case 'ascii':
		        return asciiSlice(this, start, end)

		      case 'binary':
		        return binarySlice(this, start, end)

		      case 'base64':
		        return base64Slice(this, start, end)

		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return utf16leSlice(this, start, end)

		      default:
		        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
		        encoding = (encoding + '').toLowerCase()
		        loweredCase = true
		    }
		  }
		}

		Buffer.prototype.toString = function toString () {
		  var length = this.length | 0
		  if (length === 0) return ''
		  if (arguments.length === 0) return utf8Slice(this, 0, length)
		  return slowToString.apply(this, arguments)
		}

		Buffer.prototype.equals = function equals (b) {
		  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
		  if (this === b) return true
		  return Buffer.compare(this, b) === 0
		}

		Buffer.prototype.inspect = function inspect () {
		  var str = ''
		  var max = exports.INSPECT_MAX_BYTES
		  if (this.length > 0) {
		    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
		    if (this.length > max) str += ' ... '
		  }
		  return '<Buffer ' + str + '>'
		}

		Buffer.prototype.compare = function compare (b) {
		  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
		  if (this === b) return 0
		  return Buffer.compare(this, b)
		}

		Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
		  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
		  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
		  byteOffset >>= 0

		  if (this.length === 0) return -1
		  if (byteOffset >= this.length) return -1

		  // Negative offsets start from the end of the buffer
		  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

		  if (typeof val === 'string') {
		    if (val.length === 0) return -1 // special case: looking for empty string always fails
		    return String.prototype.indexOf.call(this, val, byteOffset)
		  }
		  if (Buffer.isBuffer(val)) {
		    return arrayIndexOf(this, val, byteOffset)
		  }
		  if (typeof val === 'number') {
		    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
		      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
		    }
		    return arrayIndexOf(this, [ val ], byteOffset)
		  }

		  function arrayIndexOf (arr, val, byteOffset) {
		    var foundIndex = -1
		    for (var i = 0; byteOffset + i < arr.length; i++) {
		      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
		        if (foundIndex === -1) foundIndex = i
		        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
		      } else {
		        foundIndex = -1
		      }
		    }
		    return -1
		  }

		  throw new TypeError('val must be string, number or Buffer')
		}

		// `get` is deprecated
		Buffer.prototype.get = function get (offset) {
		  console.log('.get() is deprecated. Access using array indexes instead.')
		  return this.readUInt8(offset)
		}

		// `set` is deprecated
		Buffer.prototype.set = function set (v, offset) {
		  console.log('.set() is deprecated. Access using array indexes instead.')
		  return this.writeUInt8(v, offset)
		}

		function hexWrite (buf, string, offset, length) {
		  offset = Number(offset) || 0
		  var remaining = buf.length - offset
		  if (!length) {
		    length = remaining
		  } else {
		    length = Number(length)
		    if (length > remaining) {
		      length = remaining
		    }
		  }

		  // must be an even number of digits
		  var strLen = string.length
		  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

		  if (length > strLen / 2) {
		    length = strLen / 2
		  }
		  for (var i = 0; i < length; i++) {
		    var parsed = parseInt(string.substr(i * 2, 2), 16)
		    if (isNaN(parsed)) throw new Error('Invalid hex string')
		    buf[offset + i] = parsed
		  }
		  return i
		}

		function utf8Write (buf, string, offset, length) {
		  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
		}

		function asciiWrite (buf, string, offset, length) {
		  return blitBuffer(asciiToBytes(string), buf, offset, length)
		}

		function binaryWrite (buf, string, offset, length) {
		  return asciiWrite(buf, string, offset, length)
		}

		function base64Write (buf, string, offset, length) {
		  return blitBuffer(base64ToBytes(string), buf, offset, length)
		}

		function ucs2Write (buf, string, offset, length) {
		  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
		}

		Buffer.prototype.write = function write (string, offset, length, encoding) {
		  // Buffer#write(string)
		  if (offset === undefined) {
		    encoding = 'utf8'
		    length = this.length
		    offset = 0
		  // Buffer#write(string, encoding)
		  } else if (length === undefined && typeof offset === 'string') {
		    encoding = offset
		    length = this.length
		    offset = 0
		  // Buffer#write(string, offset[, length][, encoding])
		  } else if (isFinite(offset)) {
		    offset = offset | 0
		    if (isFinite(length)) {
		      length = length | 0
		      if (encoding === undefined) encoding = 'utf8'
		    } else {
		      encoding = length
		      length = undefined
		    }
		  // legacy write(string, encoding, offset, length) - remove in v0.13
		  } else {
		    var swap = encoding
		    encoding = offset
		    offset = length | 0
		    length = swap
		  }

		  var remaining = this.length - offset
		  if (length === undefined || length > remaining) length = remaining

		  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
		    throw new RangeError('attempt to write outside buffer bounds')
		  }

		  if (!encoding) encoding = 'utf8'

		  var loweredCase = false
		  for (;;) {
		    switch (encoding) {
		      case 'hex':
		        return hexWrite(this, string, offset, length)

		      case 'utf8':
		      case 'utf-8':
		        return utf8Write(this, string, offset, length)

		      case 'ascii':
		        return asciiWrite(this, string, offset, length)

		      case 'binary':
		        return binaryWrite(this, string, offset, length)

		      case 'base64':
		        // Warning: maxLength not taken into account in base64Write
		        return base64Write(this, string, offset, length)

		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return ucs2Write(this, string, offset, length)

		      default:
		        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
		        encoding = ('' + encoding).toLowerCase()
		        loweredCase = true
		    }
		  }
		}

		Buffer.prototype.toJSON = function toJSON () {
		  return {
		    type: 'Buffer',
		    data: Array.prototype.slice.call(this._arr || this, 0)
		  }
		}

		function base64Slice (buf, start, end) {
		  if (start === 0 && end === buf.length) {
		    return base64.fromByteArray(buf)
		  } else {
		    return base64.fromByteArray(buf.slice(start, end))
		  }
		}

		function utf8Slice (buf, start, end) {
		  end = Math.min(buf.length, end)
		  var res = []

		  var i = start
		  while (i < end) {
		    var firstByte = buf[i]
		    var codePoint = null
		    var bytesPerSequence = (firstByte > 0xEF) ? 4
		      : (firstByte > 0xDF) ? 3
		      : (firstByte > 0xBF) ? 2
		      : 1

		    if (i + bytesPerSequence <= end) {
		      var secondByte, thirdByte, fourthByte, tempCodePoint

		      switch (bytesPerSequence) {
		        case 1:
		          if (firstByte < 0x80) {
		            codePoint = firstByte
		          }
		          break
		        case 2:
		          secondByte = buf[i + 1]
		          if ((secondByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
		            if (tempCodePoint > 0x7F) {
		              codePoint = tempCodePoint
		            }
		          }
		          break
		        case 3:
		          secondByte = buf[i + 1]
		          thirdByte = buf[i + 2]
		          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
		            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
		              codePoint = tempCodePoint
		            }
		          }
		          break
		        case 4:
		          secondByte = buf[i + 1]
		          thirdByte = buf[i + 2]
		          fourthByte = buf[i + 3]
		          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
		            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
		              codePoint = tempCodePoint
		            }
		          }
		      }
		    }

		    if (codePoint === null) {
		      // we did not generate a valid codePoint so insert a
		      // replacement char (U+FFFD) and advance only 1 byte
		      codePoint = 0xFFFD
		      bytesPerSequence = 1
		    } else if (codePoint > 0xFFFF) {
		      // encode to utf16 (surrogate pair dance)
		      codePoint -= 0x10000
		      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
		      codePoint = 0xDC00 | codePoint & 0x3FF
		    }

		    res.push(codePoint)
		    i += bytesPerSequence
		  }

		  return decodeCodePointsArray(res)
		}

		// Based on http://stackoverflow.com/a/22747272/680742, the browser with
		// the lowest limit is Chrome, with 0x10000 args.
		// We go 1 magnitude less, for safety
		var MAX_ARGUMENTS_LENGTH = 0x1000

		function decodeCodePointsArray (codePoints) {
		  var len = codePoints.length
		  if (len <= MAX_ARGUMENTS_LENGTH) {
		    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
		  }

		  // Decode in chunks to avoid "call stack size exceeded".
		  var res = ''
		  var i = 0
		  while (i < len) {
		    res += String.fromCharCode.apply(
		      String,
		      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
		    )
		  }
		  return res
		}

		function asciiSlice (buf, start, end) {
		  var ret = ''
		  end = Math.min(buf.length, end)

		  for (var i = start; i < end; i++) {
		    ret += String.fromCharCode(buf[i] & 0x7F)
		  }
		  return ret
		}

		function binarySlice (buf, start, end) {
		  var ret = ''
		  end = Math.min(buf.length, end)

		  for (var i = start; i < end; i++) {
		    ret += String.fromCharCode(buf[i])
		  }
		  return ret
		}

		function hexSlice (buf, start, end) {
		  var len = buf.length

		  if (!start || start < 0) start = 0
		  if (!end || end < 0 || end > len) end = len

		  var out = ''
		  for (var i = start; i < end; i++) {
		    out += toHex(buf[i])
		  }
		  return out
		}

		function utf16leSlice (buf, start, end) {
		  var bytes = buf.slice(start, end)
		  var res = ''
		  for (var i = 0; i < bytes.length; i += 2) {
		    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
		  }
		  return res
		}

		Buffer.prototype.slice = function slice (start, end) {
		  var len = this.length
		  start = ~~start
		  end = end === undefined ? len : ~~end

		  if (start < 0) {
		    start += len
		    if (start < 0) start = 0
		  } else if (start > len) {
		    start = len
		  }

		  if (end < 0) {
		    end += len
		    if (end < 0) end = 0
		  } else if (end > len) {
		    end = len
		  }

		  if (end < start) end = start

		  var newBuf
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    newBuf = Buffer._augment(this.subarray(start, end))
		  } else {
		    var sliceLen = end - start
		    newBuf = new Buffer(sliceLen, undefined)
		    for (var i = 0; i < sliceLen; i++) {
		      newBuf[i] = this[i + start]
		    }
		  }

		  if (newBuf.length) newBuf.parent = this.parent || this

		  return newBuf
		}

		/*
		 * Need to make sure that buffer isn't trying to write out of bounds.
		 */
		function checkOffset (offset, ext, length) {
		  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
		  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
		}

		Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
		  offset = offset | 0
		  byteLength = byteLength | 0
		  if (!noAssert) checkOffset(offset, byteLength, this.length)

		  var val = this[offset]
		  var mul = 1
		  var i = 0
		  while (++i < byteLength && (mul *= 0x100)) {
		    val += this[offset + i] * mul
		  }

		  return val
		}

		Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
		  offset = offset | 0
		  byteLength = byteLength | 0
		  if (!noAssert) {
		    checkOffset(offset, byteLength, this.length)
		  }

		  var val = this[offset + --byteLength]
		  var mul = 1
		  while (byteLength > 0 && (mul *= 0x100)) {
		    val += this[offset + --byteLength] * mul
		  }

		  return val
		}

		Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 1, this.length)
		  return this[offset]
		}

		Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 2, this.length)
		  return this[offset] | (this[offset + 1] << 8)
		}

		Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 2, this.length)
		  return (this[offset] << 8) | this[offset + 1]
		}

		Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 4, this.length)

		  return ((this[offset]) |
		      (this[offset + 1] << 8) |
		      (this[offset + 2] << 16)) +
		      (this[offset + 3] * 0x1000000)
		}

		Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 4, this.length)

		  return (this[offset] * 0x1000000) +
		    ((this[offset + 1] << 16) |
		    (this[offset + 2] << 8) |
		    this[offset + 3])
		}

		Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
		  offset = offset | 0
		  byteLength = byteLength | 0
		  if (!noAssert) checkOffset(offset, byteLength, this.length)

		  var val = this[offset]
		  var mul = 1
		  var i = 0
		  while (++i < byteLength && (mul *= 0x100)) {
		    val += this[offset + i] * mul
		  }
		  mul *= 0x80

		  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

		  return val
		}

		Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
		  offset = offset | 0
		  byteLength = byteLength | 0
		  if (!noAssert) checkOffset(offset, byteLength, this.length)

		  var i = byteLength
		  var mul = 1
		  var val = this[offset + --i]
		  while (i > 0 && (mul *= 0x100)) {
		    val += this[offset + --i] * mul
		  }
		  mul *= 0x80

		  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

		  return val
		}

		Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 1, this.length)
		  if (!(this[offset] & 0x80)) return (this[offset])
		  return ((0xff - this[offset] + 1) * -1)
		}

		Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 2, this.length)
		  var val = this[offset] | (this[offset + 1] << 8)
		  return (val & 0x8000) ? val | 0xFFFF0000 : val
		}

		Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 2, this.length)
		  var val = this[offset + 1] | (this[offset] << 8)
		  return (val & 0x8000) ? val | 0xFFFF0000 : val
		}

		Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 4, this.length)

		  return (this[offset]) |
		    (this[offset + 1] << 8) |
		    (this[offset + 2] << 16) |
		    (this[offset + 3] << 24)
		}

		Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 4, this.length)

		  return (this[offset] << 24) |
		    (this[offset + 1] << 16) |
		    (this[offset + 2] << 8) |
		    (this[offset + 3])
		}

		Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 4, this.length)
		  return ieee754.read(this, offset, true, 23, 4)
		}

		Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 4, this.length)
		  return ieee754.read(this, offset, false, 23, 4)
		}

		Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 8, this.length)
		  return ieee754.read(this, offset, true, 52, 8)
		}

		Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
		  if (!noAssert) checkOffset(offset, 8, this.length)
		  return ieee754.read(this, offset, false, 52, 8)
		}

		function checkInt (buf, value, offset, ext, max, min) {
		  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
		  if (value > max || value < min) throw new RangeError('value is out of bounds')
		  if (offset + ext > buf.length) throw new RangeError('index out of range')
		}

		Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
		  value = +value
		  offset = offset | 0
		  byteLength = byteLength | 0
		  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

		  var mul = 1
		  var i = 0
		  this[offset] = value & 0xFF
		  while (++i < byteLength && (mul *= 0x100)) {
		    this[offset + i] = (value / mul) & 0xFF
		  }

		  return offset + byteLength
		}

		Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
		  value = +value
		  offset = offset | 0
		  byteLength = byteLength | 0
		  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

		  var i = byteLength - 1
		  var mul = 1
		  this[offset + i] = value & 0xFF
		  while (--i >= 0 && (mul *= 0x100)) {
		    this[offset + i] = (value / mul) & 0xFF
		  }

		  return offset + byteLength
		}

		Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
		  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
		  this[offset] = (value & 0xff)
		  return offset + 1
		}

		function objectWriteUInt16 (buf, value, offset, littleEndian) {
		  if (value < 0) value = 0xffff + value + 1
		  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
		    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
		      (littleEndian ? i : 1 - i) * 8
		  }
		}

		Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value & 0xff)
		    this[offset + 1] = (value >>> 8)
		  } else {
		    objectWriteUInt16(this, value, offset, true)
		  }
		  return offset + 2
		}

		Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value >>> 8)
		    this[offset + 1] = (value & 0xff)
		  } else {
		    objectWriteUInt16(this, value, offset, false)
		  }
		  return offset + 2
		}

		function objectWriteUInt32 (buf, value, offset, littleEndian) {
		  if (value < 0) value = 0xffffffff + value + 1
		  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
		    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
		  }
		}

		Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset + 3] = (value >>> 24)
		    this[offset + 2] = (value >>> 16)
		    this[offset + 1] = (value >>> 8)
		    this[offset] = (value & 0xff)
		  } else {
		    objectWriteUInt32(this, value, offset, true)
		  }
		  return offset + 4
		}

		Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value >>> 24)
		    this[offset + 1] = (value >>> 16)
		    this[offset + 2] = (value >>> 8)
		    this[offset + 3] = (value & 0xff)
		  } else {
		    objectWriteUInt32(this, value, offset, false)
		  }
		  return offset + 4
		}

		Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) {
		    var limit = Math.pow(2, 8 * byteLength - 1)

		    checkInt(this, value, offset, byteLength, limit - 1, -limit)
		  }

		  var i = 0
		  var mul = 1
		  var sub = value < 0 ? 1 : 0
		  this[offset] = value & 0xFF
		  while (++i < byteLength && (mul *= 0x100)) {
		    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
		  }

		  return offset + byteLength
		}

		Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) {
		    var limit = Math.pow(2, 8 * byteLength - 1)

		    checkInt(this, value, offset, byteLength, limit - 1, -limit)
		  }

		  var i = byteLength - 1
		  var mul = 1
		  var sub = value < 0 ? 1 : 0
		  this[offset + i] = value & 0xFF
		  while (--i >= 0 && (mul *= 0x100)) {
		    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
		  }

		  return offset + byteLength
		}

		Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
		  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
		  if (value < 0) value = 0xff + value + 1
		  this[offset] = (value & 0xff)
		  return offset + 1
		}

		Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value & 0xff)
		    this[offset + 1] = (value >>> 8)
		  } else {
		    objectWriteUInt16(this, value, offset, true)
		  }
		  return offset + 2
		}

		Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value >>> 8)
		    this[offset + 1] = (value & 0xff)
		  } else {
		    objectWriteUInt16(this, value, offset, false)
		  }
		  return offset + 2
		}

		Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value & 0xff)
		    this[offset + 1] = (value >>> 8)
		    this[offset + 2] = (value >>> 16)
		    this[offset + 3] = (value >>> 24)
		  } else {
		    objectWriteUInt32(this, value, offset, true)
		  }
		  return offset + 4
		}

		Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
		  value = +value
		  offset = offset | 0
		  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
		  if (value < 0) value = 0xffffffff + value + 1
		  if (Buffer.TYPED_ARRAY_SUPPORT) {
		    this[offset] = (value >>> 24)
		    this[offset + 1] = (value >>> 16)
		    this[offset + 2] = (value >>> 8)
		    this[offset + 3] = (value & 0xff)
		  } else {
		    objectWriteUInt32(this, value, offset, false)
		  }
		  return offset + 4
		}

		function checkIEEE754 (buf, value, offset, ext, max, min) {
		  if (value > max || value < min) throw new RangeError('value is out of bounds')
		  if (offset + ext > buf.length) throw new RangeError('index out of range')
		  if (offset < 0) throw new RangeError('index out of range')
		}

		function writeFloat (buf, value, offset, littleEndian, noAssert) {
		  if (!noAssert) {
		    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
		  }
		  ieee754.write(buf, value, offset, littleEndian, 23, 4)
		  return offset + 4
		}

		Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
		  return writeFloat(this, value, offset, true, noAssert)
		}

		Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
		  return writeFloat(this, value, offset, false, noAssert)
		}

		function writeDouble (buf, value, offset, littleEndian, noAssert) {
		  if (!noAssert) {
		    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
		  }
		  ieee754.write(buf, value, offset, littleEndian, 52, 8)
		  return offset + 8
		}

		Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
		  return writeDouble(this, value, offset, true, noAssert)
		}

		Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
		  return writeDouble(this, value, offset, false, noAssert)
		}

		// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
		Buffer.prototype.copy = function copy (target, targetStart, start, end) {
		  if (!start) start = 0
		  if (!end && end !== 0) end = this.length
		  if (targetStart >= target.length) targetStart = target.length
		  if (!targetStart) targetStart = 0
		  if (end > 0 && end < start) end = start

		  // Copy 0 bytes; we're done
		  if (end === start) return 0
		  if (target.length === 0 || this.length === 0) return 0

		  // Fatal error conditions
		  if (targetStart < 0) {
		    throw new RangeError('targetStart out of bounds')
		  }
		  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
		  if (end < 0) throw new RangeError('sourceEnd out of bounds')

		  // Are we oob?
		  if (end > this.length) end = this.length
		  if (target.length - targetStart < end - start) {
		    end = target.length - targetStart + start
		  }

		  var len = end - start
		  var i

		  if (this === target && start < targetStart && targetStart < end) {
		    // descending copy from end
		    for (i = len - 1; i >= 0; i--) {
		      target[i + targetStart] = this[i + start]
		    }
		  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
		    // ascending copy from start
		    for (i = 0; i < len; i++) {
		      target[i + targetStart] = this[i + start]
		    }
		  } else {
		    target._set(this.subarray(start, start + len), targetStart)
		  }

		  return len
		}

		// fill(value, start=0, end=buffer.length)
		Buffer.prototype.fill = function fill (value, start, end) {
		  if (!value) value = 0
		  if (!start) start = 0
		  if (!end) end = this.length

		  if (end < start) throw new RangeError('end < start')

		  // Fill 0 bytes; we're done
		  if (end === start) return
		  if (this.length === 0) return

		  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
		  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

		  var i
		  if (typeof value === 'number') {
		    for (i = start; i < end; i++) {
		      this[i] = value
		    }
		  } else {
		    var bytes = utf8ToBytes(value.toString())
		    var len = bytes.length
		    for (i = start; i < end; i++) {
		      this[i] = bytes[i % len]
		    }
		  }

		  return this
		}

		/**
		 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
		 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
		 */
		Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
		  if (typeof Uint8Array !== 'undefined') {
		    if (Buffer.TYPED_ARRAY_SUPPORT) {
		      return (new Buffer(this)).buffer
		    } else {
		      var buf = new Uint8Array(this.length)
		      for (var i = 0, len = buf.length; i < len; i += 1) {
		        buf[i] = this[i]
		      }
		      return buf.buffer
		    }
		  } else {
		    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
		  }
		}

		// HELPER FUNCTIONS
		// ================

		var BP = Buffer.prototype

		/**
		 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
		 */
		Buffer._augment = function _augment (arr) {
		  arr.constructor = Buffer
		  arr._isBuffer = true

		  // save reference to original Uint8Array set method before overwriting
		  arr._set = arr.set

		  // deprecated
		  arr.get = BP.get
		  arr.set = BP.set

		  arr.write = BP.write
		  arr.toString = BP.toString
		  arr.toLocaleString = BP.toString
		  arr.toJSON = BP.toJSON
		  arr.equals = BP.equals
		  arr.compare = BP.compare
		  arr.indexOf = BP.indexOf
		  arr.copy = BP.copy
		  arr.slice = BP.slice
		  arr.readUIntLE = BP.readUIntLE
		  arr.readUIntBE = BP.readUIntBE
		  arr.readUInt8 = BP.readUInt8
		  arr.readUInt16LE = BP.readUInt16LE
		  arr.readUInt16BE = BP.readUInt16BE
		  arr.readUInt32LE = BP.readUInt32LE
		  arr.readUInt32BE = BP.readUInt32BE
		  arr.readIntLE = BP.readIntLE
		  arr.readIntBE = BP.readIntBE
		  arr.readInt8 = BP.readInt8
		  arr.readInt16LE = BP.readInt16LE
		  arr.readInt16BE = BP.readInt16BE
		  arr.readInt32LE = BP.readInt32LE
		  arr.readInt32BE = BP.readInt32BE
		  arr.readFloatLE = BP.readFloatLE
		  arr.readFloatBE = BP.readFloatBE
		  arr.readDoubleLE = BP.readDoubleLE
		  arr.readDoubleBE = BP.readDoubleBE
		  arr.writeUInt8 = BP.writeUInt8
		  arr.writeUIntLE = BP.writeUIntLE
		  arr.writeUIntBE = BP.writeUIntBE
		  arr.writeUInt16LE = BP.writeUInt16LE
		  arr.writeUInt16BE = BP.writeUInt16BE
		  arr.writeUInt32LE = BP.writeUInt32LE
		  arr.writeUInt32BE = BP.writeUInt32BE
		  arr.writeIntLE = BP.writeIntLE
		  arr.writeIntBE = BP.writeIntBE
		  arr.writeInt8 = BP.writeInt8
		  arr.writeInt16LE = BP.writeInt16LE
		  arr.writeInt16BE = BP.writeInt16BE
		  arr.writeInt32LE = BP.writeInt32LE
		  arr.writeInt32BE = BP.writeInt32BE
		  arr.writeFloatLE = BP.writeFloatLE
		  arr.writeFloatBE = BP.writeFloatBE
		  arr.writeDoubleLE = BP.writeDoubleLE
		  arr.writeDoubleBE = BP.writeDoubleBE
		  arr.fill = BP.fill
		  arr.inspect = BP.inspect
		  arr.toArrayBuffer = BP.toArrayBuffer

		  return arr
		}

		var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

		function base64clean (str) {
		  // Node strips out invalid characters like \n and \t from the string, base64-js does not
		  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
		  // Node converts strings with length < 2 to ''
		  if (str.length < 2) return ''
		  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
		  while (str.length % 4 !== 0) {
		    str = str + '='
		  }
		  return str
		}

		function stringtrim (str) {
		  if (str.trim) return str.trim()
		  return str.replace(/^\s+|\s+$/g, '')
		}

		function toHex (n) {
		  if (n < 16) return '0' + n.toString(16)
		  return n.toString(16)
		}

		function utf8ToBytes (string, units) {
		  units = units || Infinity
		  var codePoint
		  var length = string.length
		  var leadSurrogate = null
		  var bytes = []

		  for (var i = 0; i < length; i++) {
		    codePoint = string.charCodeAt(i)

		    // is surrogate component
		    if (codePoint > 0xD7FF && codePoint < 0xE000) {
		      // last char was a lead
		      if (!leadSurrogate) {
		        // no lead yet
		        if (codePoint > 0xDBFF) {
		          // unexpected trail
		          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
		          continue
		        } else if (i + 1 === length) {
		          // unpaired lead
		          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
		          continue
		        }

		        // valid lead
		        leadSurrogate = codePoint

		        continue
		      }

		      // 2 leads in a row
		      if (codePoint < 0xDC00) {
		        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
		        leadSurrogate = codePoint
		        continue
		      }

		      // valid surrogate pair
		      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
		    } else if (leadSurrogate) {
		      // valid bmp char, but last char was a lead
		      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
		    }

		    leadSurrogate = null

		    // encode utf8
		    if (codePoint < 0x80) {
		      if ((units -= 1) < 0) break
		      bytes.push(codePoint)
		    } else if (codePoint < 0x800) {
		      if ((units -= 2) < 0) break
		      bytes.push(
		        codePoint >> 0x6 | 0xC0,
		        codePoint & 0x3F | 0x80
		      )
		    } else if (codePoint < 0x10000) {
		      if ((units -= 3) < 0) break
		      bytes.push(
		        codePoint >> 0xC | 0xE0,
		        codePoint >> 0x6 & 0x3F | 0x80,
		        codePoint & 0x3F | 0x80
		      )
		    } else if (codePoint < 0x110000) {
		      if ((units -= 4) < 0) break
		      bytes.push(
		        codePoint >> 0x12 | 0xF0,
		        codePoint >> 0xC & 0x3F | 0x80,
		        codePoint >> 0x6 & 0x3F | 0x80,
		        codePoint & 0x3F | 0x80
		      )
		    } else {
		      throw new Error('Invalid code point')
		    }
		  }

		  return bytes
		}

		function asciiToBytes (str) {
		  var byteArray = []
		  for (var i = 0; i < str.length; i++) {
		    // Node's code seems to be doing this and not & 0x7F..
		    byteArray.push(str.charCodeAt(i) & 0xFF)
		  }
		  return byteArray
		}

		function utf16leToBytes (str, units) {
		  var c, hi, lo
		  var byteArray = []
		  for (var i = 0; i < str.length; i++) {
		    if ((units -= 2) < 0) break

		    c = str.charCodeAt(i)
		    hi = c >> 8
		    lo = c % 256
		    byteArray.push(lo)
		    byteArray.push(hi)
		  }

		  return byteArray
		}

		function base64ToBytes (str) {
		  return base64.toByteArray(base64clean(str))
		}

		function blitBuffer (src, dst, offset, length) {
		  for (var i = 0; i < length; i++) {
		    if ((i + offset >= dst.length) || (i >= src.length)) break
		    dst[i + offset] = src[i]
		  }
		  return i
		}

		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer, (function() { return this; }())))

	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {

		var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		;(function (exports) {
			'use strict';

		  var Arr = (typeof Uint8Array !== 'undefined')
		    ? Uint8Array
		    : Array

			var PLUS   = '+'.charCodeAt(0)
			var SLASH  = '/'.charCodeAt(0)
			var NUMBER = '0'.charCodeAt(0)
			var LOWER  = 'a'.charCodeAt(0)
			var UPPER  = 'A'.charCodeAt(0)
			var PLUS_URL_SAFE = '-'.charCodeAt(0)
			var SLASH_URL_SAFE = '_'.charCodeAt(0)

			function decode (elt) {
				var code = elt.charCodeAt(0)
				if (code === PLUS ||
				    code === PLUS_URL_SAFE)
					return 62 // '+'
				if (code === SLASH ||
				    code === SLASH_URL_SAFE)
					return 63 // '/'
				if (code < NUMBER)
					return -1 //no match
				if (code < NUMBER + 10)
					return code - NUMBER + 26 + 26
				if (code < UPPER + 26)
					return code - UPPER
				if (code < LOWER + 26)
					return code - LOWER + 26
			}

			function b64ToByteArray (b64) {
				var i, j, l, tmp, placeHolders, arr

				if (b64.length % 4 > 0) {
					throw new Error('Invalid string. Length must be a multiple of 4')
				}

				// the number of equal signs (place holders)
				// if there are two placeholders, than the two characters before it
				// represent one byte
				// if there is only one, then the three characters before it represent 2 bytes
				// this is just a cheap hack to not do indexOf twice
				var len = b64.length
				placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

				// base64 is 4/3 + up to two characters of the original data
				arr = new Arr(b64.length * 3 / 4 - placeHolders)

				// if there are placeholders, only get up to the last complete 4 chars
				l = placeHolders > 0 ? b64.length - 4 : b64.length

				var L = 0

				function push (v) {
					arr[L++] = v
				}

				for (i = 0, j = 0; i < l; i += 4, j += 3) {
					tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
					push((tmp & 0xFF0000) >> 16)
					push((tmp & 0xFF00) >> 8)
					push(tmp & 0xFF)
				}

				if (placeHolders === 2) {
					tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
					push(tmp & 0xFF)
				} else if (placeHolders === 1) {
					tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
					push((tmp >> 8) & 0xFF)
					push(tmp & 0xFF)
				}

				return arr
			}

			function uint8ToBase64 (uint8) {
				var i,
					extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
					output = "",
					temp, length

				function encode (num) {
					return lookup.charAt(num)
				}

				function tripletToBase64 (num) {
					return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
				}

				// go through the array every three bytes, we'll deal with trailing stuff later
				for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
					temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
					output += tripletToBase64(temp)
				}

				// pad the end with zeros, but make sure to not forget the extra bytes
				switch (extraBytes) {
					case 1:
						temp = uint8[uint8.length - 1]
						output += encode(temp >> 2)
						output += encode((temp << 4) & 0x3F)
						output += '=='
						break
					case 2:
						temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
						output += encode(temp >> 10)
						output += encode((temp >> 4) & 0x3F)
						output += encode((temp << 2) & 0x3F)
						output += '='
						break
				}

				return output
			}

			exports.toByteArray = b64ToByteArray
			exports.fromByteArray = uint8ToBase64
		}( false ? (this.base64js = {}) : exports))


	/***/ },
	/* 8 */
	/***/ function(module, exports) {

		exports.read = function (buffer, offset, isLE, mLen, nBytes) {
		  var e, m
		  var eLen = nBytes * 8 - mLen - 1
		  var eMax = (1 << eLen) - 1
		  var eBias = eMax >> 1
		  var nBits = -7
		  var i = isLE ? (nBytes - 1) : 0
		  var d = isLE ? -1 : 1
		  var s = buffer[offset + i]

		  i += d

		  e = s & ((1 << (-nBits)) - 1)
		  s >>= (-nBits)
		  nBits += eLen
		  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

		  m = e & ((1 << (-nBits)) - 1)
		  e >>= (-nBits)
		  nBits += mLen
		  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

		  if (e === 0) {
		    e = 1 - eBias
		  } else if (e === eMax) {
		    return m ? NaN : ((s ? -1 : 1) * Infinity)
		  } else {
		    m = m + Math.pow(2, mLen)
		    e = e - eBias
		  }
		  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
		}

		exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
		  var e, m, c
		  var eLen = nBytes * 8 - mLen - 1
		  var eMax = (1 << eLen) - 1
		  var eBias = eMax >> 1
		  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
		  var i = isLE ? 0 : (nBytes - 1)
		  var d = isLE ? 1 : -1
		  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

		  value = Math.abs(value)

		  if (isNaN(value) || value === Infinity) {
		    m = isNaN(value) ? 1 : 0
		    e = eMax
		  } else {
		    e = Math.floor(Math.log(value) / Math.LN2)
		    if (value * (c = Math.pow(2, -e)) < 1) {
		      e--
		      c *= 2
		    }
		    if (e + eBias >= 1) {
		      value += rt / c
		    } else {
		      value += rt * Math.pow(2, 1 - eBias)
		    }
		    if (value * c >= 2) {
		      e++
		      c /= 2
		    }

		    if (e + eBias >= eMax) {
		      m = 0
		      e = eMax
		    } else if (e + eBias >= 1) {
		      m = (value * c - 1) * Math.pow(2, mLen)
		      e = e + eBias
		    } else {
		      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
		      e = 0
		    }
		  }

		  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

		  e = (e << mLen) | m
		  eLen += mLen
		  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

		  buffer[offset + i - d] |= s * 128
		}


	/***/ },
	/* 9 */
	/***/ function(module, exports) {


		/**
		 * isArray
		 */

		var isArray = Array.isArray;

		/**
		 * toString
		 */

		var str = Object.prototype.toString;

		/**
		 * Whether or not the given `val`
		 * is an array.
		 *
		 * example:
		 *
		 *        isArray([]);
		 *        // > true
		 *        isArray(arguments);
		 *        // > false
		 *        isArray('');
		 *        // > false
		 *
		 * @param {mixed} val
		 * @return {bool}
		 */

		module.exports = isArray || function (val) {
		  return !! val && '[object Array]' == str.call(val);
		};


	/***/ },
	/* 10 */
	/***/ function(module, exports) {

		var SceneGraph = function(sceneProperties) {
		    var nodeCount = 1;

		    //todo: move merge to helpers section
		    function merge(parent, child) {
		        for (var prop in child) {
		            parent[prop] = child[prop];
		        }
		        return parent;
		    }

		    var SceneNode = function(name) {
		        nodeCount++;
		        this.parent = null;
		        this.children = {};
		        this.id = nodeCount;
		        this.name = 'n' + nodeCount;
		        if (typeof name !== 'undefined') {
		            this.name = name;
		        }
		        this.x = this.y = this.z = 0;
		        this.width = this.height = 0;
		    };

		    SceneNode.prototype.resize = function(width, height) {
		        if (width != null) {
		            this.width = width;
		        }
		        if (height != null) {
		            this.height = height;
		        }
		    };

		    SceneNode.prototype.moveTo = function(x, y, z) {
		        this.x = x != null ? x : this.x;
		        this.y = y != null ? y : this.y;
		        this.z = z != null ? z : this.z;
		    };

		    SceneNode.prototype.add = function(child) {
		        var name = child.name;
		        if (typeof this.children[name] === 'undefined') {
		            this.children[name] = child;
		            child.parent = this;
		        } else {
		            throw 'SceneGraph: child already exists: ' + name;
		        }
		    };

		    var RootNode = function() {
		        SceneNode.call(this, 'root');
		        this.properties = sceneProperties;
		    };

		    RootNode.prototype = new SceneNode();

		    var Shape = function(name, props) {
		        SceneNode.call(this, name);
		        this.properties = {
		            'fill': '#000000'
		        };
		        if (typeof props !== 'undefined') {
		            merge(this.properties, props);
		        } else if (typeof name !== 'undefined' && typeof name !== 'string') {
		            throw 'SceneGraph: invalid node name';
		        }
		    };

		    Shape.prototype = new SceneNode();

		    var Group = function() {
		        Shape.apply(this, arguments);
		        this.type = 'group';
		    };

		    Group.prototype = new Shape();

		    var Rect = function() {
		        Shape.apply(this, arguments);
		        this.type = 'rect';
		    };

		    Rect.prototype = new Shape();

		    var Text = function(text) {
		        Shape.call(this);
		        this.type = 'text';
		        this.properties.text = text;
		    };

		    Text.prototype = new Shape();

		    var root = new RootNode();

		    this.Shape = {
		        'Rect': Rect,
		        'Text': Text,
		        'Group': Group
		    };

		    this.root = root;
		    return this;
		};

		module.exports = SceneGraph;


	/***/ },
	/* 11 */
	/***/ function(module, exports) {

		/* WEBPACK VAR INJECTION */(function(global) {/**
		 * Shallow object clone and merge
		 *
		 * @param a Object A
		 * @param b Object B
		 * @returns {Object} New object with all of A's properties, and all of B's properties, overwriting A's properties
		 */
		exports.extend = function(a, b) {
		    var c = {};
		    for (var x in a) {
		        if (a.hasOwnProperty(x)) {
		            c[x] = a[x];
		        }
		    }
		    if (b != null) {
		        for (var y in b) {
		            if (b.hasOwnProperty(y)) {
		                c[y] = b[y];
		            }
		        }
		    }
		    return c;
		};

		/**
		 * Takes a k/v list of CSS properties and returns a rule
		 *
		 * @param props CSS properties object
		 */
		exports.cssProps = function(props) {
		    var ret = [];
		    for (var p in props) {
		        if (props.hasOwnProperty(p)) {
		            ret.push(p + ':' + props[p]);
		        }
		    }
		    return ret.join(';');
		};

		/**
		 * Encodes HTML entities in a string
		 *
		 * @param str Input string
		 */
		exports.encodeHtmlEntity = function(str) {
		    var buf = [];
		    var charCode = 0;
		    for (var i = str.length - 1; i >= 0; i--) {
		        charCode = str.charCodeAt(i);
		        if (charCode > 128) {
		            buf.unshift(['&#', charCode, ';'].join(''));
		        } else {
		            buf.unshift(str[i]);
		        }
		    }
		    return buf.join('');
		};

		/**
		 * Checks if an image exists
		 *
		 * @param src URL of image
		 * @param callback Callback to call once image status has been found
		 */
		exports.imageExists = function(src, callback) {
		    var image = new Image();
		    image.onerror = function() {
		        callback.call(this, false);
		    };
		    image.onload = function() {
		        callback.call(this, true);
		    };
		    image.src = src;
		};

		/**
		 * Decodes HTML entities in a string
		 *
		 * @param str Input string
		 */
		exports.decodeHtmlEntity = function(str) {
		    return str.replace(/&#(\d+);/g, function(match, dec) {
		        return String.fromCharCode(dec);
		    });
		};


		/**
		 * Returns an element's dimensions if it's visible, `false` otherwise.
		 *
		 * @param el DOM element
		 */
		exports.dimensionCheck = function(el) {
		    var dimensions = {
		        height: el.clientHeight,
		        width: el.clientWidth
		    };

		    if (dimensions.height && dimensions.width) {
		        return dimensions;
		    } else {
		        return false;
		    }
		};


		/**
		 * Returns true if value is truthy or if it is "semantically truthy"
		 * @param val
		 */
		exports.truthy = function(val) {
		    if (typeof val === 'string') {
		        return val === 'true' || val === 'yes' || val === '1' || val === 'on' || val === '✓';
		    }
		    return !!val;
		};

		/**
		 * Parses input into a well-formed CSS color
		 * @param val
		 */
		exports.parseColor = function(val) {
		    var hexre = /(^(?:#?)[0-9a-f]{6}$)|(^(?:#?)[0-9a-f]{3}$)/i;
		    var rgbre = /^rgb\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
		    var rgbare = /^rgba\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0\.\d{1,}|1)\)$/;

		    var match = val.match(hexre);
		    var retval;

		    if (match !== null) {
		        retval = match[1] || match[2];
		        if (retval[0] !== '#') {
		            return '#' + retval;
		        } else {
		            return retval;
		        }
		    }

		    match = val.match(rgbre);

		    if (match !== null) {
		        retval = 'rgb(' + match.slice(1).join(',') + ')';
		        return retval;
		    }

		    match = val.match(rgbare);

		    if (match !== null) {
		        retval = 'rgba(' + match.slice(1).join(',') + ')';
		        return retval;
		    }

		    return null;
		};

		/**
		 * Provides the correct scaling ratio for canvas drawing operations on HiDPI screens (e.g. Retina displays)
		 */
		exports.canvasRatio = function () {
		    var devicePixelRatio = 1;
		    var backingStoreRatio = 1;

		    if (global.document) {
		        var canvas = global.document.createElement('canvas');
		        if (canvas.getContext) {
		            var ctx = canvas.getContext('2d');
		            devicePixelRatio = global.devicePixelRatio || 1;
		            backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
		        }
		    }

		    return devicePixelRatio / backingStoreRatio;
		};
		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(global) {var DOM = __webpack_require__(13);

		var SVG_NS = 'http://www.w3.org/2000/svg';
		var NODE_TYPE_COMMENT = 8;

		/**
		 * Generic SVG element creation function
		 *
		 * @param svg SVG context, set to null if new
		 * @param width Document width
		 * @param height Document height
		 */
		exports.initSVG = function(svg, width, height) {
		    var defs, style, initialize = false;

		    if (svg && svg.querySelector) {
		        style = svg.querySelector('style');
		        if (style === null) {
		            initialize = true;
		        }
		    } else {
		        svg = DOM.newEl('svg', SVG_NS);
		        initialize = true;
		    }

		    if (initialize) {
		        defs = DOM.newEl('defs', SVG_NS);
		        style = DOM.newEl('style', SVG_NS);
		        DOM.setAttr(style, {
		            'type': 'text/css'
		        });
		        defs.appendChild(style);
		        svg.appendChild(defs);
		    }

		    //IE throws an exception if this is set and Chrome requires it to be set
		    if (svg.webkitMatchesSelector) {
		        svg.setAttribute('xmlns', SVG_NS);
		    }

		    //Remove comment nodes
		    for (var i = 0; i < svg.childNodes.length; i++) {
		        if (svg.childNodes[i].nodeType === NODE_TYPE_COMMENT) {
		            svg.removeChild(svg.childNodes[i]);
		        }
		    }

		    //Remove CSS
		    while (style.childNodes.length) {
		        style.removeChild(style.childNodes[0]);
		    }

		    DOM.setAttr(svg, {
		        'width': width,
		        'height': height,
		        'viewBox': '0 0 ' + width + ' ' + height,
		        'preserveAspectRatio': 'none'
		    });

		    return svg;
		};

		/**
		 * Converts serialized SVG to a string suitable for data URI use
		 * @param svgString Serialized SVG string
		 * @param [base64] Use base64 encoding for data URI
		 */
		exports.svgStringToDataURI = function() {
		    var rawPrefix = 'data:image/svg+xml;charset=UTF-8,';
		    var base64Prefix = 'data:image/svg+xml;charset=UTF-8;base64,';

		    return function(svgString, base64) {
		        if (base64) {
		            return base64Prefix + btoa(global.unescape(encodeURIComponent(svgString)));
		        } else {
		            return rawPrefix + encodeURIComponent(svgString);
		        }
		    };
		}();

		/**
		 * Returns serialized SVG with XML processing instructions
		 *
		 * @param svg SVG context
		 * @param stylesheets CSS stylesheets to include
		 */
		exports.serializeSVG = function(svg, engineSettings) {
		    if (!global.XMLSerializer) return;
		    var serializer = new XMLSerializer();
		    var svgCSS = '';
		    var stylesheets = engineSettings.stylesheets;

		    //External stylesheets: Processing Instruction method
		    if (engineSettings.svgXMLStylesheet) {
		        var xml = DOM.createXML();
		        //Add <?xml-stylesheet ?> directives
		        for (var i = stylesheets.length - 1; i >= 0; i--) {
		            var csspi = xml.createProcessingInstruction('xml-stylesheet', 'href="' + stylesheets[i] + '" rel="stylesheet"');
		            xml.insertBefore(csspi, xml.firstChild);
		        }

		        xml.removeChild(xml.documentElement);
		        svgCSS = serializer.serializeToString(xml);
		    }

		    var svgText = serializer.serializeToString(svg);
		    svgText = svgText.replace(/\&amp;(\#[0-9]{2,}\;)/g, '&$1');
		    return svgCSS + svgText;
		};

		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 13 */
	/***/ function(module, exports) {

		/* WEBPACK VAR INJECTION */(function(global) {/**
		 * Generic new DOM element function
		 *
		 * @param tag Tag to create
		 * @param namespace Optional namespace value
		 */
		exports.newEl = function(tag, namespace) {
		    if (!global.document) return;

		    if (namespace == null) {
		        return global.document.createElement(tag);
		    } else {
		        return global.document.createElementNS(namespace, tag);
		    }
		};

		/**
		 * Generic setAttribute function
		 *
		 * @param el Reference to DOM element
		 * @param attrs Object with attribute keys and values
		 */
		exports.setAttr = function (el, attrs) {
		    for (var a in attrs) {
		        el.setAttribute(a, attrs[a]);
		    }
		};

		/**
		 * Creates a XML document
		 * @private
		 */
		exports.createXML = function() {
		    if (!global.DOMParser) return;
		    return new DOMParser().parseFromString('<xml />', 'application/xml');
		};

		/**
		 * Converts a value into an array of DOM nodes
		 *
		 * @param val A string, a NodeList, a Node, or an HTMLCollection
		 */
		exports.getNodeArray = function(val) {
		    var retval = null;
		    if (typeof(val) == 'string') {
		        retval = document.querySelectorAll(val);
		    } else if (global.NodeList && val instanceof global.NodeList) {
		        retval = val;
		    } else if (global.Node && val instanceof global.Node) {
		        retval = [val];
		    } else if (global.HTMLCollection && val instanceof global.HTMLCollection) {
		        retval = val;
		    } else if (val instanceof Array) {
		        retval = val;
		    } else if (val === null) {
		        retval = [];
		    }

		    retval = Array.prototype.slice.call(retval);

		    return retval;
		};

		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 14 */
	/***/ function(module, exports) {

		var Color = function(color, options) {
		    //todo: support rgba, hsla, and rrggbbaa notation
		    //todo: use CIELAB internally
		    //todo: add clamp function (with sign)
		    if (typeof color !== 'string') return;

		    this.original = color;

		    if (color.charAt(0) === '#') {
		        color = color.slice(1);
		    }

		    if (/[^a-f0-9]+/i.test(color)) return;

		    if (color.length === 3) {
		        color = color.replace(/./g, '$&$&');
		    }

		    if (color.length !== 6) return;

		    this.alpha = 1;

		    if (options && options.alpha) {
		        this.alpha = options.alpha;
		    }

		    this.set(parseInt(color, 16));
		};

		//todo: jsdocs
		Color.rgb2hex = function(r, g, b) {
		    function format (decimal) {
		        var hex = (decimal | 0).toString(16);
		        if (decimal < 16) {
		            hex = '0' + hex;
		        }
		        return hex;
		    }

		    return [r, g, b].map(format).join('');
		};

		//todo: jsdocs
		Color.hsl2rgb = function (h, s, l) {
		    var H = h / 60;
		    var C = (1 - Math.abs(2 * l - 1)) * s;
		    var X = C * (1 - Math.abs(parseInt(H) % 2 - 1));
		    var m = l - (C / 2);

		    var r = 0, g = 0, b = 0;

		    if (H >= 0 && H < 1) {
		        r = C;
		        g = X;
		    } else if (H >= 1 && H < 2) {
		        r = X;
		        g = C;
		    } else if (H >= 2 && H < 3) {
		        g = C;
		        b = X;
		    } else if (H >= 3 && H < 4) {
		        g = X;
		        b = C;
		    } else if (H >= 4 && H < 5) {
		        r = X;
		        b = C;
		    } else if (H >= 5 && H < 6) {
		        r = C;
		        b = X;
		    }

		    r += m;
		    g += m;
		    b += m;

		    r = parseInt(r * 255);
		    g = parseInt(g * 255);
		    b = parseInt(b * 255);

		    return [r, g, b];
		};

		/**
		 * Sets the color from a raw RGB888 integer
		 * @param raw RGB888 representation of color
		 */
		//todo: refactor into a static method
		//todo: factor out individual color spaces
		//todo: add HSL, CIELAB, and CIELUV
		Color.prototype.set = function (val) {
		    this.raw = val;

		    var r = (this.raw & 0xFF0000) >> 16;
		    var g = (this.raw & 0x00FF00) >> 8;
		    var b = (this.raw & 0x0000FF);

		    // BT.709
		    var y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		    var u = -0.09991 * r - 0.33609 * g + 0.436 * b;
		    var v = 0.615 * r - 0.55861 * g - 0.05639 * b;

		    this.rgb = {
		        r: r,
		        g: g,
		        b: b
		    };

		    this.yuv = {
		        y: y,
		        u: u,
		        v: v
		    };

		    return this;
		};

		/**
		 * Lighten or darken a color
		 * @param multiplier Amount to lighten or darken (-1 to 1)
		 */
		Color.prototype.lighten = function(multiplier) {
		    var cm = Math.min(1, Math.max(0, Math.abs(multiplier))) * (multiplier < 0 ? -1 : 1);
		    var bm = (255 * cm) | 0;
		    var cr = Math.min(255, Math.max(0, this.rgb.r + bm));
		    var cg = Math.min(255, Math.max(0, this.rgb.g + bm));
		    var cb = Math.min(255, Math.max(0, this.rgb.b + bm));
		    var hex = Color.rgb2hex(cr, cg, cb);
		    return new Color(hex);
		};

		/**
		 * Output color in hex format
		 * @param addHash Add a hash character to the beginning of the output
		 */
		Color.prototype.toHex = function(addHash) {
		    return (addHash ? '#' : '') + this.raw.toString(16);
		};

		/**
		 * Returns whether or not current color is lighter than another color
		 * @param color Color to compare against
		 */
		Color.prototype.lighterThan = function(color) {
		    if (!(color instanceof Color)) {
		        color = new Color(color);
		    }

		    return this.yuv.y > color.yuv.y;
		};

		/**
		 * Returns the result of mixing current color with another color
		 * @param color Color to mix with
		 * @param multiplier How much to mix with the other color
		 */
		/*
		Color.prototype.mix = function (color, multiplier) {
		    if (!(color instanceof Color)) {
		        color = new Color(color);
		    }

		    var r = this.rgb.r;
		    var g = this.rgb.g;
		    var b = this.rgb.b;
		    var a = this.alpha;

		    var m = typeof multiplier !== 'undefined' ? multiplier : 0.5;

		    //todo: write a lerp function
		    r = r + m * (color.rgb.r - r);
		    g = g + m * (color.rgb.g - g);
		    b = b + m * (color.rgb.b - b);
		    a = a + m * (color.alpha - a);

		    return new Color(Color.rgbToHex(r, g, b), {
		        'alpha': a
		    });
		};
		*/

		/**
		 * Returns the result of blending another color on top of current color with alpha
		 * @param color Color to blend on top of current color, i.e. "Ca"
		 */
		//todo: see if .blendAlpha can be merged into .mix
		Color.prototype.blendAlpha = function(color) {
		    if (!(color instanceof Color)) {
		        color = new Color(color);
		    }

		    var Ca = color;
		    var Cb = this;

		    //todo: write alpha blending function
		    var r = Ca.alpha * Ca.rgb.r + (1 - Ca.alpha) * Cb.rgb.r;
		    var g = Ca.alpha * Ca.rgb.g + (1 - Ca.alpha) * Cb.rgb.g;
		    var b = Ca.alpha * Ca.rgb.b + (1 - Ca.alpha) * Cb.rgb.b;

		    return new Color(Color.rgb2hex(r, g, b));
		};

		module.exports = Color;


	/***/ },
	/* 15 */
	/***/ function(module, exports) {

		module.exports = {
		  'version': '2.9.0',
		  'svg_ns': 'http://www.w3.org/2000/svg'
		};

	/***/ },
	/* 16 */
	/***/ function(module, exports, __webpack_require__) {

		var shaven = __webpack_require__(17);

		var SVG = __webpack_require__(12);
		var constants = __webpack_require__(15);
		var utils = __webpack_require__(11);

		var SVG_NS = constants.svg_ns;

		var templates = {
		  'element': function (options) {
		    var tag = options.tag;
		    var content = options.content || '';
		    delete options.tag;
		    delete options.content;
		    return  [tag, content, options];
		  }
		};

		//todo: deprecate tag arg, infer tag from shape object
		function convertShape (shape, tag) {
		  return templates.element({
		    'tag': tag,
		    'width': shape.width,
		    'height': shape.height,
		    'fill': shape.properties.fill
		  });
		}

		function textCss (properties) {
		  return utils.cssProps({
		    'fill': properties.fill,
		    'font-weight': properties.font.weight,
		    'font-family': properties.font.family + ', monospace',
		    'font-size': properties.font.size + properties.font.units
		  });
		}

		function outlinePath (bgWidth, bgHeight, outlineWidth) {
		  var outlineOffsetWidth = outlineWidth / 2;

		  return [
		    'M', outlineOffsetWidth, outlineOffsetWidth,
		    'H', bgWidth - outlineOffsetWidth,
		    'V', bgHeight - outlineOffsetWidth,
		    'H', outlineOffsetWidth,
		    'V', 0,
		    'M', 0, outlineOffsetWidth,
		    'L', bgWidth, bgHeight - outlineOffsetWidth,
		    'M', 0, bgHeight - outlineOffsetWidth,
		    'L', bgWidth, outlineOffsetWidth
		  ].join(' ');
		}

		module.exports = function (sceneGraph, renderSettings) {
		  var engineSettings = renderSettings.engineSettings;
		  var stylesheets = engineSettings.stylesheets;
		  var stylesheetXml = stylesheets.map(function (stylesheet) {
		    return '<?xml-stylesheet rel="stylesheet" href="' + stylesheet + '"?>';
		  }).join('\n');

		  var holderId = 'holder_' + Number(new Date()).toString(16);

		  var root = sceneGraph.root;
		  var textGroup = root.children.holderTextGroup;

		  var css = '#' + holderId + ' text { ' + textCss(textGroup.properties) + ' } ';

		  // push text down to be equally vertically aligned with canvas renderer
		  textGroup.y += textGroup.textPositionData.boundingBox.height * 0.8;

		  var wordTags = [];

		  Object.keys(textGroup.children).forEach(function (lineKey) {
		    var line = textGroup.children[lineKey];

		    Object.keys(line.children).forEach(function (wordKey) {
		      var word = line.children[wordKey];
		      var x = textGroup.x + line.x + word.x;
		      var y = textGroup.y + line.y + word.y;

		      var wordTag = templates.element({
		        'tag': 'text',
		        'content': word.properties.text,
		        'x': x,
		        'y': y
		      });

		      wordTags.push(wordTag);
		    });
		  });

		  var text = templates.element({
		    'tag': 'g',
		    'content': wordTags
		  });

		  var outline = null;

		  if (root.children.holderBg.properties.outline) {
		    var outlineProperties = root.children.holderBg.properties.outline;
		    outline = templates.element({
		      'tag': 'path',
		      'd': outlinePath(root.children.holderBg.width, root.children.holderBg.height, outlineProperties.width),
		      'stroke-width': outlineProperties.width,
		      'stroke': outlineProperties.fill,
		      'fill': 'none'
		    });
		  }

		  var bg = convertShape(root.children.holderBg, 'rect');

		  var sceneContent = [];

		  sceneContent.push(bg);
		  if (outlineProperties) {
		    sceneContent.push(outline);
		  }
		  sceneContent.push(text);

		  var scene = templates.element({
		    'tag': 'g',
		    'id': holderId,
		    'content': sceneContent
		  });

		  var style = templates.element({
		    'tag': 'style',
		    //todo: figure out how to add CDATA directive
		    'content': css,
		    'type': 'text/css'
		  });

		  var defs = templates.element({
		    'tag': 'defs',
		    'content': style
		  });

		  var svg = templates.element({
		    'tag': 'svg',
		    'content': [defs, scene],
		    'width': root.properties.width,
		    'height': root.properties.height,
		    'xmlns': SVG_NS,
		    'viewBox': [0, 0, root.properties.width, root.properties.height].join(' '),
		    'preserveAspectRatio': 'none'
		  });

		  var output = shaven(svg);

		  output = stylesheetXml + output[0];

		  var svgString = SVG.svgStringToDataURI(output, renderSettings.mode === 'background');
		  return svgString;
		};

	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {

		var escape = __webpack_require__(18)

		// TODO: remove namespace

		module.exports = function shaven (array, namespace, returnObject) {

			'use strict'

			var i = 1,
				doesEscape = true,
				HTMLString,
				attributeKey,
				callback,
				key


			returnObject = returnObject || {}


			function createElement (sugarString) {

				var tags = sugarString.match(/^\w+/),
					element = {
						tag: tags ? tags[0] : 'div',
						attr: {},
						children: []
					},
					id = sugarString.match(/#([\w-]+)/),
					reference = sugarString.match(/\$([\w-]+)/),
					classNames = sugarString.match(/\.[\w-]+/g)


				// Assign id if is set
				if (id) {
					element.attr.id = id[1]

					// Add element to the return object
					returnObject[id[1]] = element
				}

				if (reference)
					returnObject[reference[1]] = element

				if (classNames)
					element.attr.class = classNames.join(' ').replace(/\./g, '')

				if (sugarString.match(/&$/g))
					doesEscape = false

				return element
			}

			function replacer (key, value) {

				if (value === null || value === false || value === undefined)
					return

				if (typeof value !== 'string' && typeof value !== 'object')
					return String(value)

				return value
			}

			function escapeAttribute (string) {
				return String(string)
					.replace(/&/g, '&amp;')
					.replace(/"/g, '&quot;')
			}

			function escapeHTML (string) {
				return String(string)
					.replace(/&/g, '&amp;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&apos;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
			}


			if (typeof array[0] === 'string')
				array[0] = createElement(array[0])

			else if (Array.isArray(array[0]))
				i = 0

			else
				throw new Error(
					'First element of array must be a string, ' +
					'or an array and not ' + JSON.stringify(array[0])
				)


			for (; i < array.length; i++) {

				// Don't render element if value is false or null
				if (array[i] === false || array[i] === null) {
					array[0] = false
					break
				}

				// Continue with next array value if current value is undefined or true
				else if (array[i] === undefined || array[i] === true) {
					continue
				}

				else if (typeof array[i] === 'string') {
					if (doesEscape)
						array[i] = escapeHTML(array[i])

					array[0].children.push(array[i])
				}

				else if (typeof array[i] === 'number') {

					array[0].children.push(array[i])
				}

				else if (Array.isArray(array[i])) {

					if (Array.isArray(array[i][0])) {
						array[i].reverse().forEach(function (subArray) {
							array.splice(i + 1, 0, subArray)
						})

						if (i !== 0)
							continue
						i++
					}

					shaven(array[i], namespace, returnObject)

					if (array[i][0])
						array[0].children.push(array[i][0])
				}

				else if (typeof array[i] === 'function')
					callback = array[i]


				else if (typeof array[i] === 'object') {
					for (attributeKey in array[i])
						if (array[i].hasOwnProperty(attributeKey))
							if (array[i][attributeKey] !== null &&
								array[i][attributeKey] !== false)
								if (attributeKey === 'style' &&
									typeof array[i][attributeKey] === 'object')
									array[0].attr[attributeKey] = JSON
										.stringify(array[i][attributeKey], replacer)
										.slice(2, -2)
										.replace(/","/g, ';')
										.replace(/":"/g, ':')
										.replace(/\\"/g, '\'')

								else
									array[0].attr[attributeKey] = array[i][attributeKey]
				}

				else
					throw new TypeError('"' + array[i] + '" is not allowed as a value.')
			}


			if (array[0] !== false) {

				HTMLString = '<' + array[0].tag

				for (key in array[0].attr)
					if (array[0].attr.hasOwnProperty(key))
						HTMLString += ' ' + key + '="' +
							escapeAttribute(array[0].attr[key] || '') + '"'

				HTMLString += '>'

				array[0].children.forEach(function (child) {
					HTMLString += child
				})

				HTMLString += '</' + array[0].tag + '>'

				array[0] = HTMLString
			}

			// Return root element on index 0
			returnObject[0] = array[0]

			if (callback)
				callback(array[0])

			// returns object containing all elements with an id and the root element
			return returnObject
		}


	/***/ },
	/* 18 */
	/***/ function(module, exports) {

		/*!
		 * escape-html
		 * Copyright(c) 2012-2013 TJ Holowaychuk
		 * Copyright(c) 2015 Andreas Lubbe
		 * Copyright(c) 2015 Tiancheng "Timothy" Gu
		 * MIT Licensed
		 */

		'use strict';

		/**
		 * Module variables.
		 * @private
		 */

		var matchHtmlRegExp = /["'&<>]/;

		/**
		 * Module exports.
		 * @public
		 */

		module.exports = escapeHtml;

		/**
		 * Escape special characters in the given string of html.
		 *
		 * @param  {string} string The string to escape for inserting into HTML
		 * @return {string}
		 * @public
		 */

		function escapeHtml(string) {
		  var str = '' + string;
		  var match = matchHtmlRegExp.exec(str);

		  if (!match) {
		    return str;
		  }

		  var escape;
		  var html = '';
		  var index = 0;
		  var lastIndex = 0;

		  for (index = match.index; index < str.length; index++) {
		    switch (str.charCodeAt(index)) {
		      case 34: // "
		        escape = '&quot;';
		        break;
		      case 38: // &
		        escape = '&amp;';
		        break;
		      case 39: // '
		        escape = '&#39;';
		        break;
		      case 60: // <
		        escape = '&lt;';
		        break;
		      case 62: // >
		        escape = '&gt;';
		        break;
		      default:
		        continue;
		    }

		    if (lastIndex !== index) {
		      html += str.substring(lastIndex, index);
		    }

		    lastIndex = index + 1;
		    html += escape;
		  }

		  return lastIndex !== index
		    ? html + str.substring(lastIndex, index)
		    : html;
		}


	/***/ },
	/* 19 */
	/***/ function(module, exports, __webpack_require__) {

		var DOM = __webpack_require__(13);
		var utils = __webpack_require__(11);

		module.exports = (function() {
		    var canvas = DOM.newEl('canvas');
		    var ctx = null;

		    return function(sceneGraph) {
		        if (ctx == null) {
		            ctx = canvas.getContext('2d');
		        }

		        var dpr = utils.canvasRatio();
		        var root = sceneGraph.root;
		        canvas.width = dpr * root.properties.width;
		        canvas.height = dpr * root.properties.height ;
		        ctx.textBaseline = 'middle';

		        var bg = root.children.holderBg;
		        var bgWidth = dpr * bg.width;
		        var bgHeight = dpr * bg.height;
		        //todo: parametrize outline width (e.g. in scene object)
		        var outlineWidth = 2;
		        var outlineOffsetWidth = outlineWidth / 2;

		        ctx.fillStyle = bg.properties.fill;
		        ctx.fillRect(0, 0, bgWidth, bgHeight);

		        if (bg.properties.outline) {
		            //todo: abstract this into a method
		            ctx.strokeStyle = bg.properties.outline.fill;
		            ctx.lineWidth = bg.properties.outline.width;
		            ctx.moveTo(outlineOffsetWidth, outlineOffsetWidth);
		            // TL, TR, BR, BL
		            ctx.lineTo(bgWidth - outlineOffsetWidth, outlineOffsetWidth);
		            ctx.lineTo(bgWidth - outlineOffsetWidth, bgHeight - outlineOffsetWidth);
		            ctx.lineTo(outlineOffsetWidth, bgHeight - outlineOffsetWidth);
		            ctx.lineTo(outlineOffsetWidth, outlineOffsetWidth);
		            // Diagonals
		            ctx.moveTo(0, outlineOffsetWidth);
		            ctx.lineTo(bgWidth, bgHeight - outlineOffsetWidth);
		            ctx.moveTo(0, bgHeight - outlineOffsetWidth);
		            ctx.lineTo(bgWidth, outlineOffsetWidth);
		            ctx.stroke();
		        }

		        var textGroup = root.children.holderTextGroup;
		        ctx.font = textGroup.properties.font.weight + ' ' + (dpr * textGroup.properties.font.size) + textGroup.properties.font.units + ' ' + textGroup.properties.font.family + ', monospace';
		        ctx.fillStyle = textGroup.properties.fill;

		        for (var lineKey in textGroup.children) {
		            var line = textGroup.children[lineKey];
		            for (var wordKey in line.children) {
		                var word = line.children[wordKey];
		                var x = dpr * (textGroup.x + line.x + word.x);
		                var y = dpr * (textGroup.y + line.y + word.y + (textGroup.properties.leading / 2));

		                ctx.fillText(word.properties.text, x, y);
		            }
		        }

		        return canvas.toDataURL('image/png');
		    };
		})();

	/***/ }
	/******/ ])
	});
	;
	(function(ctx, isMeteorPackage) {
	    if (isMeteorPackage) {
	        Holder = ctx.Holder;
	    }
	})(this, typeof Meteor !== 'undefined' && typeof Package !== 'undefined');


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(4);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(15);

	var _index4 = _interopRequireDefault(_index3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_index2.default.version = '3.0.0';

	(0, _index4.default)(_index2.default, _index2.default.util);

	exports.default = _index2.default;

	module.exports = _index2.default;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _boot = __webpack_require__(5);

	var _boot2 = _interopRequireDefault(_boot);

	var _global = __webpack_require__(11);

	var _global2 = _interopRequireDefault(_global);

	var _internal = __webpack_require__(12);

	var _internal2 = _interopRequireDefault(_internal);

	var _instance = __webpack_require__(13);

	var _instance2 = _interopRequireDefault(_instance);

	var _component = __webpack_require__(14);

	var _component2 = _interopRequireDefault(_component);

	var _index = __webpack_require__(6);

	var util = _interopRequireWildcard(_index);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var UIkit = function UIkit(options) {
	    this._init(options);
	};

	UIkit.util = util;
	UIkit.data = '__uikit__';
	UIkit.options = {};
	UIkit.instances = {};
	UIkit.elements = [];

	(0, _global2.default)(UIkit);
	(0, _internal2.default)(UIkit);
	(0, _instance2.default)(UIkit);
	(0, _component2.default)(UIkit);
	(0, _boot2.default)(UIkit);

	exports.default = UIkit;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var DATA = UIkit.data;

	    var selector;

	    if (!_index.Observer) {

	        (0, _index.ready)(function () {
	            (0, _jquery2.default)(getSelector()).each(function (i, node) {
	                attachComponents(node);
	            });
	        });

	        return;
	    }

	    new _index.Observer(function (mutations) {

	        mutations.forEach(function (mutation) {

	            if (mutation.type === 'childList') {

	                for (var i = 0; i < mutation.addedNodes.length; ++i) {

	                    var node = mutation.addedNodes[i];

	                    if ((0, _index.matches)(node, getSelector())) {
	                        attachComponents(node);
	                    }
	                }

	                for (var i = 0; i < mutation.removedNodes.length; ++i) {

	                    var components = mutation.removedNodes[i][DATA];

	                    if (components) {
	                        for (var name in components) {
	                            components[name].$destroy();
	                        }
	                    }
	                }
	            }
	        });
	    }).observe(document, { childList: true, subtree: true });

	    function getSelector() {

	        if (!selector) {
	            var components = Object.keys(UIkit.components).map(_index.hyphenate);
	            selector = components.length ? '[uk-' + components.join('],[uk-') + ']' : false;
	        }

	        return selector;
	    }

	    function attachComponents(node) {
	        var _loop = function _loop() {

	            var name = node.attributes[i].name;

	            if (name.lastIndexOf('uk-', 0) === 0) {
	                name = (0, _index.camelize)(name.replace('uk-', ''));

	                if (UIkit[name]) {

	                    (0, _index.requestAnimationFrame)(function () {
	                        UIkit[name](node);
	                    });
	                }
	            }
	        };

	        for (var i = 0; i < node.attributes.length; i++) {
	            _loop();
	        }
	    }
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _dom = __webpack_require__(7);

	var _loop = function _loop(_key5) {
	  if (_key5 === "default") return 'continue';
	  Object.defineProperty(exports, _key5, {
	    enumerable: true,
	    get: function get() {
	      return _dom[_key5];
	    }
	  });
	};

	for (var _key5 in _dom) {
	  var _ret = _loop(_key5);

	  if (_ret === 'continue') continue;
	}

	var _env = __webpack_require__(8);

	var _loop2 = function _loop2(_key6) {
	  if (_key6 === "default") return 'continue';
	  Object.defineProperty(exports, _key6, {
	    enumerable: true,
	    get: function get() {
	      return _env[_key6];
	    }
	  });
	};

	for (var _key6 in _env) {
	  var _ret2 = _loop2(_key6);

	  if (_ret2 === 'continue') continue;
	}

	var _lang = __webpack_require__(9);

	var _loop3 = function _loop3(_key7) {
	  if (_key7 === "default") return 'continue';
	  Object.defineProperty(exports, _key7, {
	    enumerable: true,
	    get: function get() {
	      return _lang[_key7];
	    }
	  });
	};

	for (var _key7 in _lang) {
	  var _ret3 = _loop3(_key7);

	  if (_ret3 === 'continue') continue;
	}

	var _options = __webpack_require__(10);

	var _loop4 = function _loop4(_key8) {
	  if (_key8 === "default") return 'continue';
	  Object.defineProperty(exports, _key8, {
	    enumerable: true,
	    get: function get() {
	      return _options[_key8];
	    }
	  });
	};

	for (var _key8 in _options) {
	  var _ret4 = _loop4(_key8);

	  if (_ret4 === 'continue') continue;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Animation = exports.Transition = exports.langDirection = undefined;
	exports.ready = ready;
	exports.transition = transition;
	exports.animate = animate;
	exports.offsetParent = offsetParent;
	exports.isWithin = isWithin;
	exports.attrFilter = attrFilter;
	exports.removeClass = removeClass;
	exports.createEvent = createEvent;
	exports.isInView = isInView;
	exports.toJQuery = toJQuery;

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _env = __webpack_require__(8);

	var _lang = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var langDirection = exports.langDirection = (0, _jquery2.default)('html').attr('dir') == 'rtl' ? 'right' : 'left';

	function ready(fn) {

	    var handle = function handle() {
	        document.removeEventListener('DOMContentLoaded', handle);
	        window.removeEventListener('load', handle);
	        fn();
	    };

	    if (document.readyState === 'complete') {
	        fn();
	    } else {
	        document.addEventListener('DOMContentLoaded', handle);
	        window.addEventListener('load', handle);
	    }
	}

	function transition(element, props, duration, transition) {

	    var d = _jquery2.default.Deferred();

	    element = (0, _jquery2.default)(element);

	    for (var name in props) {
	        element.css(name, element.css(name));
	    }

	    (0, _env.cancelAnimationFrame)(element[0].__uk_transition);

	    element[0].__uk_transition = (0, _env.requestAnimationFrame)(function () {

	        var timer = setTimeout(function () {
	            element.trigger(_env.transitionend);
	        }, duration);

	        element.one(_env.transitionend, function () {
	            d.resolve();
	            element.css('transition', '');
	            clearTimeout(timer);
	        }).css('transition', 'all ' + duration + 'ms ' + (transition || 'linear')).css(props);

	        delete element[0].__uk_transition;
	    });

	    return d.promise();
	}

	var Transition = exports.Transition = {

	    start: transition,

	    stop: function stop(element) {

	        element = (0, _jquery2.default)(element);

	        (0, _env.cancelAnimationFrame)(element[0].__uk_transition);
	        (0, _jquery2.default)(element).trigger(_env.transitionend);

	        return this;
	    }
	};

	function animate(element, animation, duration, out) {

	    var d = _jquery2.default.Deferred(),
	        cls = out ? 'uk-animation-leave' : 'uk-animation-enter';

	    element = (0, _jquery2.default)(element);

	    if (out && animation.indexOf('uk-animation-') === 0) {
	        animation += ' uk-animation-reverse';
	    }

	    reset();

	    element.css('animation-duration', duration + 'ms').addClass(animation);

	    (0, _env.requestAnimationFrame)(function () {
	        element.addClass(cls);
	    });

	    element.one(_env.animationend, function () {
	        reset();
	        d.resolve();
	    });

	    return d.promise();

	    function reset() {
	        element.css('animation-duration', '').removeClass(cls + ' ' + animation);
	    }
	}

	var Animation = exports.Animation = {
	    in: function _in(element, animation, duration) {
	        return animate(element, animation, duration, false);
	    },
	    out: function out(element, animation, duration) {
	        return animate(element, animation, duration, true);
	    },
	    inProgress: function inProgress(element) {
	        return (0, _jquery2.default)(element).hasClass('uk-animation-enter') || (0, _jquery2.default)(element).hasClass('uk-animation-leave');
	    },
	    cancel: function cancel(element) {
	        (0, _jquery2.default)(element).trigger(_env.animationend);
	        return this;
	    }
	};

	// TODO still needed?
	function offsetParent(element) {
	    return (0, _jquery2.default)(element).parents().filter(function () {
	        return _jquery2.default.inArray((0, _jquery2.default)(this).css('position'), ['relative', 'fixed', 'absolute']) !== -1;
	    }).first();
	}

	function isWithin(element, selector) {
	    element = (0, _jquery2.default)(element);
	    return element.is(selector) || !!(typeof selector === 'string' ? element.parents(selector).length : _jquery2.default.contains(selector instanceof _jquery2.default ? selector[0] : selector, element[0]));
	}

	function attrFilter(element, attr, pattern, replacement) {
	    element = (0, _jquery2.default)(element);
	    element.attr(attr, function (i, value) {
	        return value ? value.replace(pattern, replacement) : value;
	    });
	    return element;
	}

	function removeClass(element, cls) {
	    return attrFilter(element, 'class', new RegExp('(^|\\s)' + cls + '(?!\\S)', 'g'), '');
	}

	function createEvent(e) {
	    if ((0, _lang.isString)(e)) {
	        var ev = document.createEvent('Event');
	        ev.initEvent(e, true, false);
	        return ev;
	    }
	    return e;
	}

	function isInView(element, offsetTop, offsetLeft) {

	    element = (0, _jquery2.default)(element);

	    if (!element.is(':visible')) {
	        return false;
	    }

	    var win = (0, _jquery2.default)(window),
	        scrollLeft = win.scrollLeft(),
	        scrollTop = win.scrollTop(),
	        offset = element.offset();

	    return offset.top + element.height() >= scrollTop && offset.top - offsetTop <= scrollTop + win.height() && offset.left + element.width() >= scrollLeft && offset.left - offsetLeft <= scrollLeft + win.width();
	}

	function toJQuery(element) {
	    if (element === true) {
	        return null;
	    }

	    element = (0, _jquery2.default)(element);
	    return element.length ? element : null;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.matches = matches;
	var Observer = exports.Observer = window.MutationObserver || window.WebKitMutationObserver;
	var requestAnimationFrame = exports.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
	    return setTimeout(fn, 1000 / 60);
	};
	var cancelAnimationFrame = exports.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

	var hasTouch = exports.hasTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch || navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 || //IE 10
	navigator.pointerEnabled && navigator.maxTouchPoints > 0; //IE >=11

	var transitionend = exports.transitionend = function () {

	    var element = document.body || document.documentElement,
	        names = {
	        WebkitTransition: 'webkitTransitionEnd',
	        MozTransition: 'transitionend',
	        OTransition: 'oTransitionEnd otransitionend',
	        transition: 'transitionend'
	    },
	        name;

	    for (name in names) {
	        if (element.style[name] !== undefined) {
	            return names[name];
	        }
	    }
	}();

	var animationend = exports.animationend = function () {

	    var element = document.body || document.documentElement,
	        names = {
	        WebkitAnimation: 'webkitAnimationEnd',
	        MozAnimation: 'animationend',
	        OAnimation: 'oAnimationEnd oanimationend',
	        animation: 'animationend'
	    },
	        name;

	    for (name in names) {
	        if (element.style[name] !== undefined) {
	            return names[name];
	        }
	    }
	}();

	var matchesFn = Element.prototype.matches ? 'matches' : Element.prototype.msMatchesSelector ? 'msMatchesSelector' : Element.prototype.webkitMatchesSelector ? 'webkitMatchesSelector' : false;
	function matches(element, selector) {
	    return element[matchesFn] ? element[matchesFn](selector) : false;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(1);

	Object.defineProperty(exports, 'each', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.each;
	    }
	});
	Object.defineProperty(exports, 'extend', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.extend;
	    }
	});
	Object.defineProperty(exports, 'map', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.map;
	    }
	});
	Object.defineProperty(exports, 'merge', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.merge;
	    }
	});
	Object.defineProperty(exports, 'isArray', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.isArray;
	    }
	});
	Object.defineProperty(exports, 'isFunction', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.isFunction;
	    }
	});
	Object.defineProperty(exports, 'isPlainObject', {
	    enumerable: true,
	    get: function get() {
	        return _jquery.isPlainObject;
	    }
	});
	exports.bind = bind;
	exports.hasOwn = hasOwn;
	exports.classify = classify;
	exports.hyphenate = hyphenate;
	exports.camelize = camelize;
	exports.isString = isString;
	exports.toBoolean = toBoolean;
	exports.toNumber = toNumber;
	exports.coerce = coerce;
	function bind(fn, context) {
	    return function (a) {
	        var l = arguments.length;
	        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
	    };
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(obj, key) {
	    return hasOwnProperty.call(obj, key);
	}

	var classifyRE = /(?:^|[-_\/])(\w)/g;
	function classify(str) {
	    return str.replace(classifyRE, function (_, c) {
	        return c ? c.toUpperCase() : '';
	    });
	}

	var hyphenateRE = /([a-z\d])([A-Z])/g;
	function hyphenate(str) {
	    return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}

	var camelizeRE = /-(\w)/g;
	function camelize(str) {
	    return str.replace(camelizeRE, toUpper);
	}

	function toUpper(_, c) {
	    return c ? c.toUpperCase() : '';
	}

	function isString(value) {
	    return typeof value === 'string';
	}

	function toBoolean(value) {
	    return typeof value === 'boolean' ? value : value === 'true' || value == '1' || value === '' ? true : value === 'false' || value == '0' ? false : value;
	}

	function toNumber(value) {
	    var number = Number(value);
	    return !isNaN(number) ? number : false;
	}

	function coerce(type, value) {

	    if (type === Boolean) {
	        return toBoolean(value);
	    } else if (type === Number) {
	        return toNumber(value);
	    }

	    return type ? type(value) : value;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.mergeOptions = mergeOptions;

	var _index = __webpack_require__(6);

	var strats = {};

	// concat strategy
	strats.init = strats.ready = strats.destroy = function (parentVal, childVal) {
	    return childVal ? parentVal ? parentVal.concat(childVal) : (0, _index.isArray)(childVal) ? childVal : [childVal] : parentVal;
	};

	// property strategy
	strats.props = function (parentVal, childVal) {

	    if ((0, _index.isArray)(childVal)) {
	        var ret = {};
	        childVal.forEach(function (val) {
	            ret[val] = String;
	        });
	        childVal = ret;
	    }

	    return strats.methods(parentVal, childVal);
	};

	// extend strategy
	strats.defaults = strats.methods = function (parentVal, childVal) {
	    return childVal ? parentVal ? (0, _index.extend)({}, parentVal, childVal) : childVal : parentVal;
	};

	// default strategy
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	    return childVal === undefined ? parentVal : childVal;
	};

	function mergeOptions(parent, child, thisArg) {

	    var options = {},
	        key;

	    if (child.mixins) {
	        for (var i = 0, l = child.mixins.length; i < l; i++) {
	            parent = mergeOptions(parent, child.mixins[i], thisArg);
	        }
	    }

	    for (key in parent) {
	        mergeKey(key);
	    }

	    for (key in child) {
	        if (!(0, _index.hasOwn)(parent, key)) {
	            mergeKey(key);
	        }
	    }

	    function mergeKey(key) {
	        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], thisArg, key);
	    }

	    return options;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.use = function (plugin) {

	        if (plugin.installed) {
	            return;
	        }

	        plugin.call(null, this);
	        plugin.installed = true;

	        return this;
	    };

	    UIkit.mixin = function (mixin) {
	        this.options = (0, _index.mergeOptions)(this.options, mixin);
	    };

	    UIkit.extend = function (options) {

	        options = options || {};

	        var Super = this,
	            name = options.name || Super.options.name;
	        var Sub = createClass(name || 'UIkitComponent');

	        Sub.prototype = Object.create(Super.prototype);
	        Sub.prototype.constructor = Sub;
	        Sub.options = (0, _index.mergeOptions)(Super.options, options);

	        Sub['super'] = Super;
	        Sub.extend = Super.extend;

	        return Sub;
	    };

	    UIkit.update = function (e) {
	        for (var id in UIkit.instances) {
	            UIkit.instances[id]._callUpdate(e);
	        }
	    };
	};

	var _index = __webpack_require__(6);

	function createClass(name) {
	    return new Function('return function ' + (0, _index.classify)(name) + ' (options) { this._init(options); }')();
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var uid = 0;

	    UIkit.prototype.props = {};

	    UIkit.prototype._init = function (options) {

	        options = options || {};
	        options = this.$options = (0, _index.mergeOptions)(this.constructor.options, options, this);

	        UIkit.instances[uid] = this;

	        this.$el = null;
	        this._uid = uid++;
	        this._initData();
	        this._initMethods();
	        this._callHook('init');

	        if (options.el) {
	            this.$mount(options.el);
	        }
	    };

	    UIkit.prototype._initData = function () {

	        var defaults = this.$options.defaults,
	            data = this.$options.data || {};

	        if (defaults) {
	            for (var key in defaults) {
	                this[key] = data[key] || defaults[key];
	            }
	        }
	    };

	    UIkit.prototype._initProps = function () {
	        var _this = this;

	        var el = this.$options.el,
	            props = this.$options.props,
	            options = el.getAttribute('uk-' + (0, _index.hyphenate)(this.$options.name));

	        if (props) {
	            for (var key in props) {
	                var prop = (0, _index.hyphenate)(key);
	                if (el.hasAttribute(prop)) {
	                    this[key] = (0, _index.coerce)(props[key], el.getAttribute(prop));
	                }
	            }

	            if (options) {
	                options.split(';').forEach(function (option) {
	                    var opt = option.split(/:(.+)/).map(function (value) {
	                        return value.trim();
	                    });
	                    if (props[opt[0]] !== undefined) {
	                        _this[opt[0]] = (0, _index.coerce)(props[opt[0]], opt[1]);
	                    }
	                });
	            }
	        }
	    };

	    UIkit.prototype._initMethods = function () {

	        var methods = this.$options.methods;

	        if (methods) {
	            for (var key in methods) {
	                this[key] = (0, _index.bind)(methods[key], this);
	            }
	        }
	    };

	    UIkit.prototype._callHook = function (hook) {
	        var _this2 = this;

	        var handlers = this.$options[hook];

	        if (handlers) {
	            handlers.forEach(function (handler) {
	                handler.call(_this2);
	            });
	        }
	    };

	    UIkit.prototype._callUpdate = function (e) {

	        e = (0, _index.createEvent)(e || 'update');

	        var update = this.$options.update;

	        if (!update) {
	            return;
	        }

	        if ((0, _index.isPlainObject)(update)) {

	            if (e.type !== 'update' && update.events && update.events.indexOf(e.type) === -1) {
	                return;
	            }

	            update = update.handler;
	        }

	        update.call(this, e);
	    };
	};

	var _index = __webpack_require__(6);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var DATA = UIkit.data;

	    UIkit.prototype.$mount = function (el) {

	        var name = this.$options.name;

	        if (!el[DATA]) {
	            el[DATA] = {};
	            UIkit.elements.push(el);
	        }

	        if (el[DATA][name]) {
	            console.warn('Component "' + name + '" is already mounted on element: ' + el);
	        }

	        el[DATA][name] = this;

	        this.$el = (0, _jquery2.default)(el);

	        this._initProps();
	        this._callHook('ready');
	        this._callUpdate();
	    };

	    UIkit.prototype.$update = function (e) {
	        (0, _jquery2.default)(UIkit.elements, this.$el).each(function () {
	            if (this[DATA]) {
	                for (var name in this[DATA]) {
	                    this[DATA][name]._callUpdate(e);
	                }
	            }
	        });
	    };

	    UIkit.prototype.$updateParents = function (e) {
	        var _this = this;

	        (0, _jquery2.default)(UIkit.elements).each(function (i, el) {
	            if (el[DATA] && _jquery2.default.contains(el, _this.$el[0])) {
	                for (var name in el[DATA]) {
	                    el[DATA][name]._callUpdate(e);
	                }
	            }
	        });
	    };

	    UIkit.prototype.$replace = function (el) {

	        var $el = (0, _jquery2.default)(el),
	            prev = this.$options.el,
	            name = this.$options.name;

	        el = $el[0];

	        delete prev[DATA][name];

	        if (!el[DATA]) {
	            el[DATA] = {};
	        }

	        el[DATA][name] = this;

	        UIkit.elements.splice(UIkit.elements.indexOf(prev), 1, el);
	        this.$el.replaceWith($el);
	        this.$options.el = el;
	        this.$el = $el;

	        this.__preventDestroy = true;

	        this.$updateParents();
	    };

	    UIkit.prototype.$destroy = function () {

	        if (this.__preventDestroy) {
	            this.__preventDestroy = false;
	            return;
	        }

	        this._callHook('destroy');

	        delete UIkit.instances[this._uid];

	        if (!this.$options.el) {
	            return;
	        }

	        var el = this.$options.el;
	        delete el[DATA][this.$options.name];

	        if (!Object.keys(el[DATA]).length) {
	            delete el[DATA];
	            delete UIkit.elements[UIkit.elements.indexOf(el)];
	        }

	        this.$el.remove();
	    };
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var DATA = UIkit.data;

	    UIkit.components = {};

	    UIkit.component = function (name, options) {

	        if ((0, _index.isPlainObject)(options)) {
	            options.name = name;
	            options = UIkit.extend(options);
	        }

	        name = (0, _index.camelize)(name);

	        UIkit.components[name] = options;

	        UIkit[name] = function (element, data) {

	            var result = [];

	            (0, _jquery2.default)(element).each(function () {
	                result.push(this[DATA] && this[DATA][name] || new UIkit.components[name]({ el: this, data: data || {} }));
	            });

	            return result;
	        };

	        return UIkit.components[name];
	    };

	    UIkit.getComponent = function (element, name) {
	        return element[DATA] && element[DATA][name];
	    };
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit, _) {

	    // add touch identifier class
	    (0, _jquery2.default)('html').addClass(_.hasTouch ? 'uk-touch' : 'uk-notouch');

	    var scroll = window.pageYOffset,
	        dir,
	        ticking,
	        resizing;

	    (0, _jquery2.default)(window).on('load', UIkit.update).on('resize orientationchange', function (e) {
	        if (!resizing) {
	            (0, _index.requestAnimationFrame)(function () {
	                UIkit.update(e);
	                resizing = false;
	            });
	            resizing = true;
	        }
	    }).on('scroll', function (e) {
	        dir = scroll < window.pageYOffset;
	        scroll = window.pageYOffset;
	        if (!ticking) {
	            (0, _index.requestAnimationFrame)(function () {
	                e.dir = dir ? 'down' : 'up';
	                UIkit.update(e);
	                ticking = false;
	            });
	            ticking = true;
	        }
	    });

	    // core components
	    UIkit.use(_alert2.default);
	    UIkit.use(_cover2.default);
	    UIkit.use(_drop2.default);
	    UIkit.use(_dropdown2.default);
	    UIkit.use(_marginWrap2.default);
	    UIkit.use(_grid2.default);
	    UIkit.use(_icon2.default);
	    UIkit.use(_close2.default);
	    UIkit.use(_matchHeight2.default);
	    UIkit.use(_navbar2.default);
	    UIkit.use(_responsive2.default);
	    UIkit.use(_scrollspy2.default);
	    UIkit.use(_scrollspyNav2.default);
	    UIkit.use(_smoothScroll2.default);
	    UIkit.use(_sticky2.default);
	    UIkit.use(_svg2.default);
	    UIkit.use(_toggle2.default);
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _alert = __webpack_require__(16);

	var _alert2 = _interopRequireDefault(_alert);

	var _close = __webpack_require__(17);

	var _close2 = _interopRequireDefault(_close);

	var _cover = __webpack_require__(18);

	var _cover2 = _interopRequireDefault(_cover);

	var _drop = __webpack_require__(19);

	var _drop2 = _interopRequireDefault(_drop);

	var _dropdown = __webpack_require__(20);

	var _dropdown2 = _interopRequireDefault(_dropdown);

	var _grid = __webpack_require__(21);

	var _grid2 = _interopRequireDefault(_grid);

	var _icon = __webpack_require__(22);

	var _icon2 = _interopRequireDefault(_icon);

	var _marginWrap = __webpack_require__(24);

	var _marginWrap2 = _interopRequireDefault(_marginWrap);

	var _matchHeight = __webpack_require__(25);

	var _matchHeight2 = _interopRequireDefault(_matchHeight);

	var _navbar = __webpack_require__(26);

	var _navbar2 = _interopRequireDefault(_navbar);

	var _responsive = __webpack_require__(27);

	var _responsive2 = _interopRequireDefault(_responsive);

	var _scrollspy = __webpack_require__(28);

	var _scrollspy2 = _interopRequireDefault(_scrollspy);

	var _scrollspyNav = __webpack_require__(29);

	var _scrollspyNav2 = _interopRequireDefault(_scrollspyNav);

	var _smoothScroll = __webpack_require__(30);

	var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

	var _sticky = __webpack_require__(31);

	var _sticky2 = _interopRequireDefault(_sticky);

	var _svg = __webpack_require__(32);

	var _svg2 = _interopRequireDefault(_svg);

	var _toggle = __webpack_require__(33);

	var _toggle2 = _interopRequireDefault(_toggle);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('alert', {

	        props: {
	            animation: null,
	            duration: Number,
	            close: String
	        },

	        defaults: {
	            animation: true,
	            duration: 200,
	            close: '.uk-alert-close'
	        },

	        ready: function ready() {
	            var _this = this;

	            this.$el.on('click', this.close, function (e) {
	                e.preventDefault();
	                _this.closeAlert();
	            });
	        },


	        methods: {
	            closeAlert: function closeAlert() {

	                this.$el.trigger('close');

	                if (String(this.animation) === 'true') {

	                    _index.Transition.start(this.$el, {
	                        'overflow': 'hidden',
	                        'height': 0,
	                        'opacity': 0,
	                        'padding-top': 0,
	                        'padding-bottom': 0,
	                        'margin-top': 0,
	                        'margin-bottom': 0
	                    }, this.duration).then(this.$destroy.bind(this));
	                } else if (typeof this.animation === 'string' && this.animation !== 'false') {

	                    _index.Animation.out(this.$el, this.animation, this.duration).then(this.$destroy.bind(this));
	                } else {
	                    this.$destroy();
	                }
	            }
	        },

	        destroy: function destroy() {
	            this.$el.off('click');
	            this.$el.trigger('closed');
	        }
	    });
	};

	var _index = __webpack_require__(6);

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('close', UIkit.components.icon.extend({

	        name: 'close',

	        defaults: { icon: 'close', exclude: ['id', 'style'] },

	        ready: function ready() {
	            this.class = this.cls;
	        },


	        methods: {
	            handleIcon: function handleIcon(icon) {
	                this.$el.append(icon);
	            }
	        }

	    }));
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    // TODO cleanup component

	    UIkit.component('cover', {

	        props: {
	            automute: Boolean,
	            width: Number,
	            height: Number
	        },

	        defaults: { automute: true },

	        ready: function ready() {

	            this.parent = this.$el.parent();

	            if (this.$el.is('iframe') && this.automute) {

	                var src = this.$el.attr('src');

	                this.$el.attr('src', '').on('load', function () {

	                    // TODO automute broken

	                    this.contentWindow.postMessage('{"event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
	                }).attr('src', [src, src.indexOf('?') > -1 ? '&' : '?', 'enablejsapi=1&api=1'].join(''));
	            }
	        },


	        update: {
	            handler: function handler() {

	                if (!this.$el.is(':visible')) {
	                    return this;
	                }

	                var dimensions = { width: '', height: '' };

	                this.$el.css(dimensions);

	                var width = this.parent.width(),
	                    height = this.parent.height(),
	                    ratio = (this.width || this.$el.width()) / (this.height || this.$el.height());

	                // if element height < parent height (gap underneath)
	                if (width / ratio < height) {

	                    dimensions.width = Math.ceil(height * ratio);
	                    dimensions.height = height;

	                    // element width < parent width (gap to right)
	                } else {

	                        dimensions.width = width;
	                        dimensions.height = Math.ceil(width / ratio);
	                    }

	                this.$el.css(dimensions);
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    var active, handler;

	    UIkit.component('drop', {

	        props: {
	            mode: String,
	            pos: String,
	            offset: Number,
	            justify: String,
	            center: String,
	            boundary: String,
	            cls: String,
	            flip: Boolean,
	            delayShow: Number,
	            delayHide: Number
	        },

	        defaults: {
	            mode: 'hover',
	            pos: 'bottom-left',
	            offset: 0,
	            justify: false,
	            center: false,
	            boundary: window,
	            cls: 'uk-drop',
	            flip: true,
	            delayShow: 0,
	            delayHide: 800,
	            hoverIdle: 200
	        },

	        ready: function ready() {
	            var _this = this;

	            this.drop = (0, _index.toJQuery)(this.$el.find('.' + this.cls));

	            this.justify = (0, _index.toJQuery)(this.justify);
	            this.center = (0, _index.toJQuery)(this.center);

	            this.boundary = (0, _index.toJQuery)(this.boundary) || window;
	            this.mode = _index.hasTouch ? 'click' : this.mode;
	            this.positions = [];
	            this.pos += this.pos.indexOf('-') === -1 ? '-center' : '';

	            // Init ARIA
	            this.$el.attr({
	                'aria-haspopup': 'true',
	                'aria-expanded': this.$el.hasClass('uk-open')
	            });

	            if (!handler) {
	                (0, _jquery2.default)('html').on('click', function (e) {
	                    if (active && !active.$el.find(e.target).length) {
	                        active.hide(true);
	                    }
	                });
	            }

	            this.$el.on('click', function (e) {
	                if (!_this.$el.hasClass('uk-open')) {
	                    _this.show(true);
	                } else if (!(0, _index.isWithin)(e.target, _this.drop) || (0, _index.isWithin)(e.target, '.' + _this.cls + '-close')) {
	                    _this.hide(true);
	                }
	            });

	            if (this.mode === 'click') {
	                this.$el.on('click', '> a[href="#"], :not(.' + this.cls + ') a[href="#"]', function (e) {
	                    e.preventDefault();
	                });
	            } else {
	                this.$el.on('mouseenter', function () {
	                    _this.$el.trigger('pointerenter', [_this]);
	                    _this.show();
	                }).on('mouseleave', function () {
	                    _this.$el.trigger('pointerleave', [_this]);
	                    _this.hide();
	                });
	            }
	        },


	        methods: {
	            show: function show(force) {
	                var _this2 = this;

	                this.clearTimers();

	                if (this.isActive()) {
	                    return;
	                } else if (!force && active && active !== this && active.isDelaying()) {
	                    this.delayShowTimer = setTimeout(this.show.bind(this), 75);
	                    return;
	                } else if (active) {
	                    active.hide(true);
	                }

	                var show = function show() {

	                    _this2.$el.trigger('beforeshow', [_this2]);

	                    _this2.updatePosition();

	                    _this2.$el.addClass('uk-open').attr('aria-expanded', 'true').trigger('show', [_this2]);

	                    _this2.initMouseTracker();

	                    _this2.$update();
	                };

	                if (!force && this.delayShow) {
	                    this.delayShowTimer = setTimeout(show, this.delayShow);
	                } else {
	                    show();
	                }

	                active = this;
	            },
	            hide: function hide(force) {
	                var _this3 = this;

	                this.clearTimers();

	                var hide = function hide() {

	                    active = active === _this3 ? null : active;

	                    _this3.$el.trigger('beforehide', [_this3, force]).removeClass('uk-open').attr('aria-expanded', 'false').trigger('hide', [_this3, force]);

	                    _this3.cancelMouseTracker();
	                };

	                if (!force && this.isDelaying()) {
	                    this.hoverTimer = setTimeout(this.hide.bind(this), this.hoverIdle);
	                } else if (!force && this.delayHide) {
	                    this.delayHideTimer = setTimeout(hide, this.delayHide);
	                } else {
	                    hide();
	                }
	            },
	            clearTimers: function clearTimers() {

	                if (this.delayShowTimer) {
	                    clearTimeout(this.delayShowTimer);
	                }

	                if (this.delayHideTimer) {
	                    clearTimeout(this.delayHideTimer);
	                }

	                if (this.hoverTimer) {
	                    clearTimeout(this.hoverTimer);
	                    delete this.hoverTimer;
	                }
	            },
	            updatePosition: function updatePosition() {

	                if (!this.drop) {
	                    return;
	                }

	                (0, _index.removeClass)(this.drop, this.cls + '-(top|bottom|left|right|stack)').css({
	                    'top-left': '',
	                    'left': '',
	                    'margin-left': '',
	                    'margin-right': ''
	                });

	                if (this.justify) {
	                    this.drop.css({ 'min-width': '', 'min-height': '' });
	                }

	                this.drop.show();

	                var pos = getBoundary(this.$el),
	                    dim = getBoundary(this.drop),
	                    boundary = getBoundary(this.boundary),
	                    dirAlign = this.pos.split('-');

	                this.dir = dirAlign[0];
	                this.align = dirAlign[1];

	                if (dim.width > Math.max(boundary.right - pos.left, pos.right - boundary.left)) {

	                    this.drop.addClass(this.cls + '-stack');
	                    this.$el.trigger('stack', [this]);

	                    dim = getBoundary(this.drop);
	                }

	                var positions = {
	                    'bottom-left': { top: pos.height + this.offset, left: 0 },
	                    'bottom-right': { top: pos.height + this.offset, left: pos.width - dim.width },
	                    'bottom-center': { top: pos.height + this.offset, left: (pos.width - dim.width) / 2 },
	                    'top-left': { top: -dim.height - this.offset, left: 0 },
	                    'top-right': { top: -dim.height - this.offset, left: pos.width - dim.width },
	                    'top-center': { top: -dim.height - this.offset, left: (pos.width - dim.width) / 2 },
	                    'left-top': { top: 0, left: -dim.width - this.offset },
	                    'left-bottom': { top: pos.height - dim.height, left: -dim.width - this.offset },
	                    'left-center': { top: (pos.height - dim.height) / 2, left: -dim.width - this.offset },
	                    'right-top': { top: 0, left: pos.width + this.offset },
	                    'right-bottom': { top: pos.height - dim.height, left: pos.width + this.offset },
	                    'right-center': { top: (pos.height - dim.height) / 2, left: pos.width + this.offset }
	                },
	                    position = positions[this.pos];

	                if (this.flip) {

	                    var axis = this.getAxis(),
	                        dir,
	                        align;

	                    if (this.flip === true || this.flip === axis) {
	                        dir = flipAxis(pos, position, dim, boundary, axis);

	                        if (dir && !flipAxis(pos, positions[dir + '-' + this.align], dim, boundary, axis)) {
	                            this.dir = dir;
	                        }
	                    }

	                    axis = axis === 'x' ? 'y' : 'x';
	                    if (this.flip === true || this.flip === axis) {
	                        align = flipPosition(flipAxis(pos, position, dim, boundary, axis));

	                        if (align && !flipAxis(pos, positions[this.dir + '-' + align], dim, boundary, axis)) {
	                            this.align = align;
	                        }
	                    }

	                    position = positions[this.dir + '-' + this.align];
	                }

	                if (this.justify) {

	                    var justify = getBoundary(this.justify);

	                    if (this.getAxis() === 'y') {
	                        position.left = 0;
	                        position['min-width'] = justify.width;
	                        position['margin-left'] = justify.left - pos.left;
	                    } else {
	                        position.top = 0;
	                        position['min-height'] = justify.height;
	                        position['margin-top'] = justify.top - pos.top;
	                    }
	                }

	                if (this.center) {

	                    var center = getBoundary(this.center);

	                    if (this.getAxis() === 'y') {
	                        position.left = center.left - pos.left + center.width / 2 - dim.width / 2;
	                    } else {
	                        position.top = center.top - pos.top + center.height / 2 - dim.height / 2;
	                    }
	                }

	                this.drop.css(position).css('display', '').addClass(this.cls + '-' + this.dir);
	            },
	            initMouseTracker: function initMouseTracker() {
	                var _this4 = this;

	                if (!this.drop) {
	                    return;
	                }

	                this.positions = [];
	                this.position = null;

	                if (this.mode !== 'hover') {
	                    return;
	                }

	                this.mouseHandler = function (e) {
	                    _this4.positions.push({ x: e.pageX, y: e.pageY });

	                    if (_this4.positions.length > 3) {
	                        _this4.positions.shift();
	                    }
	                };

	                (0, _jquery2.default)(document).on('mousemove', this.mouseHandler);

	                var boundary = getBoundary(this.drop),
	                    topLeft = { x: boundary.left, y: boundary.top },
	                    topRight = { x: boundary.left + boundary.width, y: topLeft.y },
	                    bottomLeft = { x: boundary.left, y: boundary.top + boundary.height },
	                    bottomRight = { x: topRight.x, y: bottomLeft.y };

	                if (this.dir === 'left') {
	                    this.points = [[topLeft, bottomRight], [topRight, bottomLeft]];
	                } else if (this.dir === 'right') {
	                    this.points = [[bottomRight, topLeft], [bottomLeft, topRight]];
	                } else if (this.dir === 'bottom') {
	                    this.points = [[bottomLeft, topRight], [topLeft, bottomRight]];
	                } else if (this.dir === 'top') {
	                    this.points = [[topRight, bottomLeft], [bottomRight, topLeft]];
	                }
	            },
	            cancelMouseTracker: function cancelMouseTracker() {
	                if (this.mouseHandler) {
	                    (0, _jquery2.default)(document).off('mousemove', this.mouseHandler);
	                }
	            },
	            isDelaying: function isDelaying() {

	                if (this.hoverTimer) {
	                    return true;
	                }

	                var position = this.positions[this.positions.length - 1],
	                    prevPos = this.positions[0] || position,
	                    delay = position && this.mode === 'hover' && this.points && !(this.position && position.x === this.position.x && position.y === this.position.y);

	                if (delay) {
	                    delay = !!this.points.reduce(function (result, point) {
	                        return result - (slope(position, point[0]) < slope(prevPos, point[0]) || slope(position, point[1]) > slope(prevPos, point[1]));
	                    }, 2);
	                }

	                this.position = delay ? position : null;
	                return delay;
	            },
	            getAxis: function getAxis() {
	                return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
	            },
	            isActive: function isActive() {
	                return active === this;
	            }
	        }

	    });

	    UIkit.drop.getActive = function () {
	        return active;
	    };

	    function flipPosition(pos) {
	        switch (pos) {
	            case 'left':
	                return 'right';
	            case 'right':
	                return 'left';
	            case 'top':
	                return 'bottom';
	            case 'bottom':
	                return 'top';
	            default:
	                return pos;
	        }
	    }

	    function flipAxis(pos, offset, dim, boundary, axis) {

	        var left = pos.left + offset.left,
	            top = pos.top + offset.top;

	        return axis === 'x' && left < boundary.left ? 'right' : axis === 'x' && left + dim.width > boundary.right ? 'left' : axis === 'y' && top < boundary.top ? 'bottom' : axis === 'y' && top + dim.height > boundary.bottom ? 'top' : false;
	    }

	    function getBoundary(boundary) {
	        var width = boundary.outerWidth(),
	            height = boundary.outerHeight(),
	            offset = boundary.offset(),
	            left = offset ? offset.left : boundary.scrollLeft(),
	            top = offset ? offset.top : boundary.scrollTop();

	        return { width: width, height: height, left: left, top: top, right: left + width, bottom: top + height };
	    }

	    function slope(a, b) {
	        return (b.y - a.y) / (b.x - a.x);
	    }
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('dropdown', UIkit.components.drop.extend({

	        name: 'dropdown',

	        defaults: { cls: 'uk-dropdown' }

	    }));
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('grid', UIkit.components.marginWrap.extend({

	        name: 'grid',

	        defaults: { margin: 'uk-grid-margin' }

	    }));
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('icon', {

	        mixins: [_svg2.default],

	        props: ['icon'],

	        defaults: { cls: 'uk-icon' },

	        ready: function ready() {

	            if (!this.icon) {
	                return;
	            }

	            this.class += (this.class ? ' ' : '') + this.cls;

	            this.getIcon(this.$el.css('background-image').slice(4, -1).replace(/"/g, ''), this.icon).then(this.handleIcon);
	        },


	        methods: {
	            handleIcon: function handleIcon(icon) {
	                this.$replace(icon);
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _svg = __webpack_require__(23);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(15);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var storage = window.sessionStorage || {},
	    svgs = {};

	exports.default = {

	    props: { id: String, class: String, style: String, width: Number, height: Number, ratio: Number },

	    defaults: { ratio: 1, id: false, class: '', exclude: [] },

	    methods: {
	        get: function get(src) {

	            if (svgs[src]) {
	                return svgs[src];
	            }

	            var key = 'uikit_' + _index2.default.version + '_' + src;
	            svgs[src] = _jquery2.default.Deferred();

	            if (!storage[key]) {
	                _jquery2.default.get(src).then(function (doc, status, res) {
	                    storage[key] = res.responseText;
	                    svgs[src].resolve(storage[key]);
	                });
	            } else {
	                svgs[src].resolve(storage[key]);
	            }

	            return svgs[src];
	        },
	        getIcon: function getIcon(src, icon) {
	            var _this = this;

	            return this.get(src).then(function (doc) {

	                var el = (0, _jquery2.default)('#' + icon, doc),
	                    dimensions;

	                if (!el || !el.length) {
	                    return _jquery2.default.Deferred().reject('Icon not found.');
	                }

	                el = (0, _jquery2.default)((0, _jquery2.default)('<div>').append(el.clone()).html().replace(/symbol/g, 'svg')); // IE workaround, el[0].outerHTML

	                dimensions = el[0].getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')
	                if (dimensions) {
	                    dimensions = dimensions.split(' ');
	                    _this.width = _this.width || dimensions[2];
	                    _this.height = _this.height || dimensions[3];
	                }

	                _this.width *= _this.ratio;
	                _this.height *= _this.ratio;

	                for (var prop in _this.$options.props) {
	                    if (_this[prop] && _this.exclude.indexOf(prop) === -1) {
	                        el.attr(prop, _this[prop]);
	                    }
	                }

	                if (!_this.id) {
	                    el.removeAttr('id');
	                }

	                if (_this.width && !_this.height) {
	                    el.removeAttr('height');
	                }

	                if (_this.height && !_this.width) {
	                    el.removeAttr('width');
	                }

	                return el;
	            });
	        }
	    }

	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('margin-wrap', {

	        props: ['margin', 'rowFirst'],

	        defaults: {
	            margin: 'uk-margin-small-top',
	            rowFirst: 'uk-row-first'
	        },

	        update: {
	            handler: function handler() {
	                var _this = this;

	                if (!this.$el.is(':visible')) {
	                    return this;
	                }

	                var skip = false,
	                    columns = this.$el.children(':visible').removeClass(this.margin),
	                    offset = columns.length ? columns.position().top + columns.outerHeight() - 1 : false; // (-1): weird firefox bug when parent container is display:flex

	                if (offset !== false && columns.length > 1) {
	                    columns.slice(1).each(function (i, column) {

	                        column = (0, _jquery2.default)(column);

	                        if (skip) {
	                            column.addClass(_this.margin);
	                        } else if (column.position().top >= offset) {
	                            skip = column.addClass(_this.margin);
	                        }
	                    });
	                }

	                if (this.rowFirst) {

	                    // Mark first column elements
	                    columns.removeClass(this.rowFirst);

	                    var pos = columns.first().position();

	                    if (pos) {
	                        columns.each(function (i, el) {
	                            (0, _jquery2.default)(el).toggleClass(_this.rowFirst, (0, _jquery2.default)(el).position().left == pos.left);
	                        });
	                    }
	                }

	                return this;
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('match-height', {

	        props: {
	            target: String,
	            row: Boolean
	        },

	        defaults: {
	            target: false,
	            row: true
	        },

	        update: {
	            handler: function handler() {
	                var _this = this;

	                var elements = (this.target ? (0, _jquery2.default)(this.target, this.$el) : this.$el.children()).css('min-height', '');

	                if (!this.row) {
	                    this.match(elements);
	                    return this;
	                }

	                (0, _index.requestAnimationFrame)(function () {

	                    var lastOffset = false,
	                        group = [];

	                    elements.each(function (i, el) {

	                        el = (0, _jquery2.default)(el);

	                        var offset = el.offset().top;

	                        if (offset != lastOffset && group.length) {
	                            _this.match((0, _jquery2.default)(group));
	                            group = [];
	                            offset = el.offset().top;
	                        }

	                        group.push(el);
	                        lastOffset = offset;
	                    });

	                    if (group.length) {
	                        _this.match((0, _jquery2.default)(group));
	                    }
	                });
	            },


	            events: ['resize', 'orientationchange']

	        },

	        methods: {
	            match: function match(elements) {

	                if (elements.length < 2) {
	                    return;
	                }

	                var max = 0;

	                elements.each(function () {
	                    max = Math.max(max, (0, _jquery2.default)(this).outerHeight());
	                }).each(function () {
	                    var el = (0, _jquery2.default)(this);
	                    el.css('min-height', max - (el.css('box-sizing') == 'border-box' ? 0 : el.outerHeight() - el.height()) + 'px');
	                });
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('navbar', {

	        props: {
	            dropdown: String,
	            mode: String,
	            pos: String,
	            offset: Number,
	            justify: Boolean,
	            center: Boolean,
	            boundary: String,
	            cls: String,
	            delayShow: Number,
	            delayHide: Number,
	            dropbar: Boolean,
	            duration: Number,
	            dropbarMode: String
	        },

	        defaults: {
	            dropdown: '.uk-navbar-nav > li',
	            mode: 'hover',
	            pos: 'bottom-left',
	            offset: 0,
	            justify: false,
	            center: false,
	            boundary: window,
	            cls: 'uk-navbar-dropdown',
	            delayHide: 800,
	            hoverIdle: 200,
	            dropbar: false,
	            duration: 200,
	            dropbarMode: 'hover'
	        },

	        ready: function ready() {
	            var _this = this;

	            UIkit.drop(this.$el.find(this.dropdown + ':not([uk-drop], [uk-dropdown])'), {
	                mode: this.mode,
	                pos: this.pos,
	                offset: this.offset,
	                justify: this.justify ? this.$el : false,
	                center: this.center ? this.$el : false,
	                boundary: this.boundary,
	                cls: this.cls,
	                flip: 'x',
	                delayShow: this.delayShow,
	                delayHide: this.delayHide
	            });

	            if (!this.dropbar) {
	                return;
	            }

	            this.dropbar = (0, _index.toJQuery)(this.dropbar);

	            if (!this.dropbar) {
	                this.dropbar = (0, _jquery2.default)('<div class="uk-navbar-dropbar"></div>').insertAfter(this.$el);
	            }

	            if (this.dropbarMode === 'hover') {
	                this.dropbar.addClass('uk-navbar-dropbar-hover');
	            }

	            var height, transition;

	            this.$el.on({

	                show: function show(e, drop) {

	                    drop.$el.removeClass('uk-open');

	                    var newHeight = drop.drop.outerHeight(true);
	                    if (height === newHeight) {

	                        if (transition && transition.state() !== 'pending') {
	                            drop.$el.addClass('uk-open');
	                        }

	                        return;
	                    }
	                    height = newHeight;

	                    transition = _index.Transition.start(_this.dropbar, { height: drop.drop.outerHeight(true) }, _this.duration).then(function () {
	                        var active = _this.getActive();
	                        if (active) {
	                            active.$el.addClass('uk-open');
	                            active.$update();
	                        }
	                    });
	                },

	                hide: function hide() {
	                    (0, _index.requestAnimationFrame)(function () {
	                        if (!_this.getActive()) {
	                            _index.Transition.stop(_this.dropbar).start(_this.dropbar, { height: 0 }, _this.duration);
	                            height = 0;
	                        }
	                    });
	                }

	            });

	            this.dropbar.on({

	                mouseenter: function mouseenter() {
	                    var active = _this.getActive();
	                    if (active) {
	                        active.clearTimers();
	                    }
	                },

	                mouseleave: function mouseleave(e) {
	                    var active = _this.getActive();
	                    if (active && !(0, _index.isWithin)(e.relatedTarget, active.$el)) {
	                        active.hide();
	                    }
	                }

	            });
	        },


	        methods: {
	            getActive: function getActive() {
	                var active = UIkit.drop.getActive();
	                if (active && (0, _index.isWithin)(active.$el, this.$el)) {
	                    return active;
	                }
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('responsive', {

	        props: ['width', 'height'],

	        update: {
	            handler: function handler() {

	                if (!this.$el.is(':visible') || !this.width || !this.height) {
	                    return;
	                }

	                var width = this.$el.parent().width();

	                this.$el.css({ height: width < this.width ? Math.floor(width / this.width * this.height) : this.height });
	            },


	            events: ['load', 'resize', 'orientationchange']

	        }

	    });
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('scrollspy', {

	        props: {
	            initCls: String,
	            cls: String,
	            target: String,
	            offsetTop: Number,
	            offsetLeft: Number,
	            repeat: Boolean,
	            delay: Number
	        },

	        defaults: {
	            initCls: 'uk-scrollspy-init-inview',
	            cls: 'uk-scrollspy-inview',
	            target: false,
	            offsetTop: 0,
	            offsetLeft: 0,
	            repeat: false,
	            delay: 0,
	            inViewClass: 'uk-scrollspy-inview'
	        },

	        ready: function ready() {
	            this.elements = this.target ? this.$el.find(this.target) : this.$el;
	        },


	        update: {
	            handler: function handler() {
	                var _this = this;

	                var index = this.elements.length === 1 ? 1 : 0;

	                this.elements.each(function (i, el) {

	                    var $el = (0, _jquery2.default)(el);

	                    if (!el.__uk_scrollspy) {
	                        el.__uk_scrollspy = { toggles: ($el.attr('cls') ? $el.attr('cls') : _this.cls).split(',') };
	                    }

	                    var data = el.__uk_scrollspy;

	                    if ((0, _index.isInView)(el, _this.offsetTop, _this.offsetLeft)) {

	                        if (!data.inview && !data.timer) {

	                            if (!$el.hasClass(_this.initCls)) {
	                                $el.addClass(_this.initCls).trigger('init'); // TODO rename event?
	                            }

	                            data.timer = setTimeout(function () {

	                                $el.addClass(_this.inViewClass).toggleClass(data.toggles[0]).trigger('inview'); // TODO rename event?

	                                data.inview = true;
	                                delete data.timer;
	                            }, _this.delay * index);

	                            index++;
	                        }
	                    } else {

	                        if (data.inview && _this.repeat) {

	                            if (data.timer) {
	                                clearTimeout(data.timer);
	                                delete data.timer;
	                            }

	                            $el.removeClass(_this.inViewClass).toggleClass(data.toggles[0]).trigger('outview'); // TODO rename event?
	                            data.inview = false;
	                        }
	                    }

	                    data.toggles.reverse();
	                });
	            },


	            events: ['scroll', 'load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('scrollspy-nav', {

	        props: {
	            cls: String,
	            closest: String,
	            offsetTop: Number,
	            offsetLeft: Number,
	            smoothScroll: Boolean
	        },

	        defaults: {
	            cls: 'uk-active',
	            closest: false,
	            offsetTop: 0,
	            offsetLeft: 0,
	            smoothScroll: false
	        },

	        ready: function ready() {
	            this.links = this.$el.find('a[href^="#"]').filter(function (i, el) {
	                return el.hash;
	            });
	            this.targets = (0, _jquery2.default)(_jquery2.default.map(this.links, function (el) {
	                return el.hash;
	            }).join(','));

	            if (this.smoothScroll) {
	                this.links.each(function () {
	                    UIkit.smoothScroll(this);
	                });
	            }
	        },


	        update: {
	            handler: function handler() {
	                var _this = this;

	                var scrollTop = (0, _jquery2.default)(window).scrollTop(),
	                    target,
	                    links,
	                    visible = this.targets.filter(function (i, el) {
	                    return (0, _index.isInView)(el, _this.offsetTop, _this.offsetLeft);
	                });

	                visible.each(function (i, el) {

	                    if (!(0, _jquery2.default)(el).offset().top >= scrollTop || target) {
	                        return;
	                    }

	                    target = (0, _jquery2.default)(el);

	                    if (_this.closest) {
	                        _this.links.blur().closest(_this.closest).removeClass(_this.cls);
	                        links = _this.links.filter('a[href="#' + target.attr('id') + '"]').closest(_this.closest);
	                    } else {
	                        links = _this.links.removeClass(_this.cls).filter('a[href="#' + target.attr('id') + '"]');
	                    }

	                    links.addClass(_this.cls);

	                    _this.$el.trigger('inview', [target, links]);
	                });
	            },


	            events: ['scroll', 'load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('smooth-scroll', {

	        props: {
	            duration: Number,
	            transition: String,
	            offset: Number
	        },

	        defaults: {
	            duration: 1000,
	            transition: 'easeOutExpo',
	            offset: 0,
	            complete: function complete() {}
	        },

	        ready: function ready() {
	            var _this = this;

	            this.$el.on('click', function (e) {
	                e.preventDefault();
	                _this.scrollToElement((0, _jquery2.default)(_this.$el[0].hash).length ? _this.$el[0].hash : 'body');
	            });
	        },


	        methods: {
	            scrollToElement: function scrollToElement(el) {

	                el = (0, _jquery2.default)(el);

	                // get / set parameters
	                var target = el.offset().top - this.offset,
	                    docHeight = (0, _jquery2.default)(document).height(),
	                    winHeight = window.innerHeight;

	                if (target + winHeight > docHeight) {
	                    target = docHeight - winHeight;
	                }

	                // animate to target, fire callback when done
	                (0, _jquery2.default)('html,body').stop().animate({ scrollTop: target }, this.duration, this.transition, this.complete);
	            }
	        }

	    });

	    if (!_jquery2.default.easing.easeOutExpo) {
	        _jquery2.default.easing.easeOutExpo = function (x, t, b, c, d) {
	            return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	        };
	    }
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('sticky', {

	        props: {
	            top: null,
	            bottom: Boolean,
	            offset: Number,
	            animation: String,
	            clsInit: String,
	            clsActive: String,
	            clsInactive: String,
	            widthElement: String,
	            showOnUp: Boolean,
	            media: Number,
	            target: Number
	        },

	        defaults: {
	            top: 0,
	            bottom: false,
	            offset: 0,
	            animation: '',
	            clsInit: 'uk-sticky-init',
	            clsActive: 'uk-active',
	            clsInactive: '',
	            widthElement: false,
	            showOnUp: false,
	            media: false,
	            target: false
	        },

	        ready: function ready() {
	            var _this = this;

	            this.placeholder = (0, _jquery2.default)('<div class="uk-sticky-placeholder"></div>').insertAfter(this.$el).css({
	                height: this.$el.css('position') !== 'absolute' ? this.$el.outerHeight() : '',
	                margin: this.$el.css('margin')
	            }).attr('hidden', true);

	            this.widthElement = (0, _index.toJQuery)(this.widthElement) || this.placeholder;
	            this.topProp = this.top;
	            this.bottomProp = this.bottom;

	            var scroll = (0, _jquery2.default)(window).scrollTop();
	            if (location.hash && scroll > 0 && this.target) {

	                var target = (0, _index.toJQuery)(location.hash);

	                if (target) {
	                    (0, _index.requestAnimationFrame)(function () {

	                        var top = target.offset().top,
	                            elTop = _this.$el.offset().top,
	                            elHeight = _this.$el.outerHeight(),
	                            elBottom = elTop + elHeight;

	                        if (elBottom >= top && elTop <= top + target.outerHeight()) {
	                            window.scrollTo(0, top - elHeight - _this.target - _this.offset);
	                        }
	                    });
	                }
	            }
	        },


	        update: {
	            handler: function handler(_ref) {
	                var type = _ref.type;
	                var dir = _ref.dir;


	                var isActive = this.$el.hasClass(this.clsActive);

	                if (type !== 'scroll') {

	                    this.offsetTop = (isActive ? this.placeholder.offset() : this.$el.offset()).top;

	                    this.top = this.topProp;

	                    if (this.topProp && typeof this.topProp === 'string') {
	                        if (this.topProp.match(/^-?\d+vh$/)) {
	                            this.top = window.innerHeight * parseFloat(this.topProp) / 100;
	                        } else {
	                            var el = (0, _index.toJQuery)(this.topProp);
	                            if (el) {
	                                this.top = el[0].offsetTop + el[0].offsetHeight;
	                            }
	                        }
	                    }

	                    this.top = Math.max(parseFloat(this.top), this.offsetTop) - this.offset;

	                    if (this.bottomProp === true || this.bottomProp[0] === '!') {
	                        this.bottom = this.bottomProp === true ? this.$el.parent() : this.$el.closest(this.bottomProp.substr(1));
	                        this.bottom = this.bottom.offset().top + this.bottom.height() + parseFloat(this.bottom.css('padding-top'));
	                    } else if (typeof this.bottomProp === 'string') {
	                        this.bottom = (0, _index.toJQuery)(this.bottomProp);
	                        if (this.bottom) {
	                            this.bottom = this.bottom.offset().top;
	                        }
	                    }

	                    this.bottom = this.bottom ? this.bottom - this.$el.height() : this.bottom;

	                    this.mediaInactive = this.media && !(typeof this.media === 'number' && window.innerWidth >= this.media || typeof this.media === 'string' && window.matchMedia(this.media).matches);
	                }

	                if ((0, _jquery2.default)(window).scrollTop() < 0 || !this.$el.is(':visible') || this.disabled) {
	                    return;
	                }

	                var scroll = (0, _jquery2.default)(window).scrollTop();

	                if (this.mediaInactive || scroll < this.top || this.showOnUp && (dir === 'down' || dir === 'up' && !isActive && scroll <= this.offsetTop + this.$el.height())) {
	                    if (isActive) {

	                        _index.Animation.cancel(this.$el);

	                        this.$el.css({ position: '', top: '', width: '', left: '', margin: '' }).removeClass(this.clsActive).addClass(this.clsInactive).trigger('inactive');

	                        this.placeholder.attr('hidden', true);
	                    }

	                    return;
	                }

	                this.placeholder.attr('hidden', false);

	                var top = Math.max(0, this.offset);
	                if (this.bottom && scroll > this.bottom) {
	                    top = this.bottom - scroll;
	                }

	                this.$el.css({
	                    position: 'fixed',
	                    top: top + 'px',
	                    width: this.widthElement.width()
	                });

	                if (isActive) {
	                    return;
	                }

	                if (this.animation) {
	                    _index.Animation.cancel(this.$el).in(this.$el, this.animation);
	                }

	                this.$el.addClass(this.clsInit).addClass(this.clsActive).removeClass(this.clsInactive).trigger('active');
	            },


	            events: ['scroll', 'load', 'resize', 'orientationchange']

	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('svg', {

	        mixins: [_svg2.default],

	        props: ['src'],

	        defaults: { exclude: ['src'] },

	        ready: function ready() {
	            var _this = this;

	            if (this.src.indexOf('#') !== -1) {

	                var parts = this.src.split('#');

	                if (parts.length < 2) {
	                    return;
	                }

	                this.getIcon(parts[0], parts[1]).then(this.$replace.bind(this));
	            } else {

	                this.get(this.src).then(function (doc) {

	                    if (!doc.documentElement || doc.documentElement.tagName.toLowerCase() !== 'svg') {
	                        return;
	                    }

	                    _this.$replace((0, _jquery2.default)(doc.documentElement).clone());
	                });
	            }
	        }
	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _svg = __webpack_require__(23);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (UIkit) {

	    UIkit.component('toggle', {

	        props: ['target', 'cls', 'animation', 'duration'],

	        defaults: {
	            target: false,
	            cls: false,
	            animation: false,
	            duration: 200
	        },

	        ready: function ready() {
	            var _this = this;

	            this.cls = (0, _index.toBoolean)(this.cls);
	            this.aria = this.cls === false;
	            this.targets = (0, _jquery2.default)(this.target);
	            this.animations = this.animation && this.animation.split(' ');

	            if (this.animations) {

	                if (this.animations.length == 1) {
	                    this.animations[1] = this.animations[0];
	                }

	                this.animations[0] = this.animations[0].trim();
	                this.animations[1] = this.animations[1].trim();
	            }

	            this.$el.on('click', function (e) {

	                if (_this.$el.is('a[href="#"]')) {
	                    e.preventDefault();
	                }

	                _this.toggle();
	            });
	        },


	        methods: {
	            toggle: function toggle() {
	                var _this2 = this;

	                if (!this.targets.length) {
	                    return;
	                }

	                _index.Animation.cancel(this.targets);

	                if (this.animations) {

	                    this.targets.each(function (i, target) {

	                        var el = (0, _jquery2.default)(target);

	                        if (_this2.isToggled(el)) {

	                            _this2.doToggle(el);
	                            _index.Animation.in(el, _this2.animations[0], _this2.duration).then(_this2.doUpdate.bind(_this2));
	                        } else {

	                            _index.Animation.out(el, _this2.animations[1], _this2.duration).then(function () {
	                                _this2.doToggle(el);
	                                _this2.doUpdate();
	                            });
	                        }
	                    });
	                } else {
	                    this.doToggle(this.targets);
	                    this.doUpdate();
	                }
	            },
	            doToggle: function doToggle(targets) {
	                var _this3 = this;

	                if (this.cls) {
	                    targets.toggleClass(this.cls);
	                } else {
	                    targets.each(function (i, el) {
	                        (0, _jquery2.default)(el).attr('hidden', !_this3.isToggled(el));
	                    });
	                }
	            },
	            isToggled: function isToggled(el) {
	                el = (0, _jquery2.default)(el);
	                return this.cls ? el.hasClass(this.cls) : !!el.attr('hidden');
	            },
	            doUpdate: function doUpdate() {
	                this.$update();

	                if (this.aria) {
	                    this.targets.each(function () {
	                        (0, _jquery2.default)(this).attr('aria-hidden', !!(0, _jquery2.default)(this).attr('hidden'));
	                    });
	                }
	            }
	        }

	    });
	};

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _index = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }
/******/ ]);