/*!

Holder - client side image placeholders
Version 2.5.2+2mg3u
© 2015 Ivan Malopinsky - http://imsky.co

Site:     http://holderjs.com
Issues:   https://github.com/imsky/holder/issues
License:  http://opensource.org/licenses/MIT

*/
/*!
 * onDomReady.js 1.4.0 (c) 2013 Tubal Martin - MIT license
 *
 * Specially modified to work with Holder.js
 */

;(function(name, global, callback){
		global[name] = callback;
})("onDomReady", this,

(function(win) {

    'use strict';

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
        top = FALSE,

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
            top = win.frameElement == null && docElem;
        } catch(e) {}

        if ( top && top.doScroll ) {
            (function doScrollCheck() {
                if ( !isReady ) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        top.doScroll("left");
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
})(this));

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

//https://github.com/inexorabletash/polyfill/blob/master/web.js
(function (global) {
  var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  global.atob = global.atob || function (input) {
    input = String(input);
    var position = 0,
        output = [],
        buffer = 0, bits = 0, n;

    input = input.replace(/\s/g, '');
    if ((input.length % 4) === 0) { input = input.replace(/=+$/, ''); }
    if ((input.length % 4) === 1) { throw Error("InvalidCharacterError"); }
    if (/[^+/0-9A-Za-z]/.test(input)) { throw Error("InvalidCharacterError"); }

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

    if (/[^\x00-\xFF]/.test(input)) { throw Error("InvalidCharacterError"); }

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
}(this));

//https://gist.github.com/jimeh/332357
if (!Object.prototype.hasOwnProperty){
    /*jshint -W001, -W103 */
    Object.prototype.hasOwnProperty = function(prop) {
		var proto = this.__proto__ || this.constructor.prototype;
		return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
	}
    /*jshint +W001, +W103 */
}

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
	}(this));
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
	}(this));
  } else {
	(function (global) {
	  global.requestAnimationFrame = function (callback) {
		return global.setTimeout(callback, 1000 / 60);
	  }

	  global.cancelAnimationFrame = global.clearTimeout;
	})(this);
  }
}
(function (global, factory) {
	global.augment = factory();
}(this, function () {
    var Factory = function () {};
    var slice = Array.prototype.slice;

    var augment = function (base, body) {
        var uber = Factory.prototype = typeof base === "function" ? base.prototype : base;
        var prototype = new Factory(), properties = body.apply(prototype, slice.call(arguments, 2).concat(uber));
        if (typeof properties === "object") for (var key in properties) prototype[key] = properties[key];
        if (!prototype.hasOwnProperty("constructor")) return prototype;
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    };

    augment.defclass = function (prototype) {
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    };

    augment.extend = function (base, body) {
        return augment(base, function (uber) {
            this.uber = uber;
            return body;
        });
    };

    return augment;
}));

/*
Holder.js - client side image placeholders
© 2012-2015 Ivan Malopinsky - http://imsky.co
*/
(function(register, global, undefined) {
    //Constants and definitions
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var NODE_TYPE_COMMENT = 8;
    var document = global.document;
    var version = '2.5.2';
    var generatorComment = '\n' +
        'Created with Holder.js ' + version + '.\n' +
        'Learn more at http://holderjs.com\n' +
        '(c) 2012-2015 Ivan Malopinsky - http://imsky.co\n';

    var Holder = {
        version: version,

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
         * @param {string} el Selector of target element(s)
         */
        addImage: function(src, el) {
            var node = document.querySelectorAll(el);
            if (node.length) {
                for (var i = 0, l = node.length; i < l; i++) {
                    var img = newEl('img');
                    setAttr(img, {
                        'data-src': src
                    });
                    node[i].appendChild(img);
                }
            }
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
            userOptions = userOptions || {};
            var engineSettings = {};

            App.vars.preempted = true;

            var options = extend(App.settings, userOptions);

            engineSettings.renderer = options.renderer ? options.renderer : App.setup.renderer;
            if (App.setup.renderers.join(',').indexOf(engineSettings.renderer) === -1) {
                engineSettings.renderer = App.setup.supportsSVG ? 'svg' : (App.setup.supportsCanvas ? 'canvas' : 'html');
            }

            var images = getNodeArray(options.images);
            var bgnodes = getNodeArray(options.bgnodes);
            var stylenodes = getNodeArray(options.stylenodes);
            var objects = getNodeArray(options.objects);

            engineSettings.stylesheets = [];
            engineSettings.svgXMLStylesheet = true;
            engineSettings.noFontFallback = options.noFontFallback ? options.noFontFallback : false;

            for (var i = 0; i < stylenodes.length; i++) {
                var styleNode = stylenodes[i];
                if (styleNode.attributes.rel && styleNode.attributes.href && styleNode.attributes.rel.value == 'stylesheet') {
                    var href = styleNode.attributes.href.value;
                    //todo: write isomorphic relative-to-absolute URL function
                    var proxyLink = newEl('a');
                    proxyLink.href = href;
                    var stylesheetURL = proxyLink.protocol + '//' + proxyLink.host + proxyLink.pathname + proxyLink.search;
                    engineSettings.stylesheets.push(stylesheetURL);
                }
            }

            for (i = 0; i < bgnodes.length; i++) {
                //Skip processing background nodes if getComputedStyle is unavailable, since only modern browsers would be able to use canvas or SVG to render to background
                if (!global.getComputedStyle) continue;
                var backgroundImage = global.getComputedStyle(bgnodes[i], null).getPropertyValue('background-image');
                var dataBackgroundImage = bgnodes[i].getAttribute('data-background-src');
                var rawURL = null;

                if (dataBackgroundImage == null) {
                    rawURL = backgroundImage;
                } else {
                    rawURL = dataBackgroundImage;
                }

                var holderURL = null;
                var holderString = '?' + options.domain + '/';

                if (rawURL.indexOf(holderString) === 0) {
                    holderURL = rawURL.slice(1);
                } else if (rawURL.indexOf(holderString) != -1) {
                    var fragment = rawURL.substr(rawURL.indexOf(holderString)).slice(1);
                    var fragmentMatch = fragment.match(/([^\"]*)"?\)/);

                    if (fragmentMatch != null) {
                        holderURL = fragmentMatch[1];
                    }
                }

                if (holderURL != null) {
                    var holderFlags = parseURL(holderURL, options);
                    if (holderFlags) {
                        prepareDOMElement({
                            mode: 'background',
                            el: bgnodes[i],
                            flags: holderFlags,
                            engineSettings: engineSettings
                        });
                    }
                }
            }

            for (i = 0; i < objects.length; i++) {
                var object = objects[i];
                var objectAttr = {};

                try {
                    objectAttr.data = object.getAttribute('data');
                    objectAttr.dataSrc = object.getAttribute('data-src');
                } catch (e) {}

                var objectHasSrcURL = objectAttr.data != null && objectAttr.data.indexOf(options.domain) === 0;
                var objectHasDataSrcURL = objectAttr.dataSrc != null && objectAttr.dataSrc.indexOf(options.domain) === 0;

                if (objectHasSrcURL) {
                    prepareImageElement(options, engineSettings, objectAttr.data, object);
                } else if (objectHasDataSrcURL) {
                    prepareImageElement(options, engineSettings, objectAttr.dataSrc, object);
                }
            }

            for (i = 0; i < images.length; i++) {
                var image = images[i];
                var imageAttr = {};

                try {
                    imageAttr.src = image.getAttribute('src');
                    imageAttr.dataSrc = image.getAttribute('data-src');
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
                                imageExists(src, function(exists) {
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
            }

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
            stylesheets: [],
            themes: {
                'gray': {
                    background: '#EEEEEE',
                    foreground: '#AAAAAA'
                },
                'social': {
                    background: '#3a5a97',
                    foreground: '#FFFFFF'
                },
                'industrial': {
                    background: '#434A52',
                    foreground: '#C2F200'
                },
                'sky': {
                    background: '#0D8FDB',
                    foreground: '#FFFFFF'
                },
                'vine': {
                    background: '#39DBAC',
                    foreground: '#1E292C'
                },
                'lava': {
                    background: '#F8591A',
                    foreground: '#1C2846'
                }
            }
        },
        defaults: {
            size: 10,
            units: 'pt',
            scale: 1 / 16
        },
        flags: {
            dimensions: {
                regex: /^(\d+)x(\d+)$/,
                output: function(val) {
                    var exec = this.regex.exec(val);
                    return {
                        width: +exec[1],
                        height: +exec[2]
                    };
                }
            },
            fluid: {
                regex: /^([0-9]+%?)x([0-9]+%?)$/,
                output: function(val) {
                    var exec = this.regex.exec(val);
                    return {
                        width: exec[1],
                        height: exec[2]
                    };
                }
            },
            colors: {
                regex: /(?:#|\^)([0-9a-f]{3,})\:(?:#|\^)([0-9a-f]{3,})/i,
                output: function(val) {
                    var exec = this.regex.exec(val);
                    return {
                        foreground: '#' + exec[2],
                        background: '#' + exec[1]
                    };
                }
            },
            text: {
                regex: /text\:(.*)/,
                output: function(val) {
                    return this.regex.exec(val)[1].replace('\\/', '/');
                }
            },
            font: {
                regex: /font\:(.*)/,
                output: function(val) {
                    return this.regex.exec(val)[1];
                }
            },
            auto: {
                regex: /^auto$/
            },
            textmode: {
                regex: /textmode\:(.*)/,
                output: function(val) {
                    return this.regex.exec(val)[1];
                }
            },
            random: {
                regex: /^random$/
            },
            size: {
                regex: /size\:(\d+)/,
                output: function(val){
                    return this.regex.exec(val)[1];
                }
            }
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
     * Processes a Holder URL and extracts flags
     *
     * @private
     * @param url URL
     * @param options Instance options from Holder.run
     */
    function parseURL(url, options) {
        var ret = {
            theme: extend(App.settings.themes.gray, null),
            stylesheets: options.stylesheets,
            holderURL: []
        };
        var render = false;
        var vtab = String.fromCharCode(11);
        var flags = url.replace(/([^\\])\//g, '$1' + vtab).split(vtab);
        var uriRegex = /%[0-9a-f]{2}/gi;
        for (var fl = flags.length, j = 0; j < fl; j++) {
            var flag = flags[j];
            if (flag.match(uriRegex)) {
                try {
                    flag = decodeURIComponent(flag);
                } catch (e) {
                    flag = flags[j];
                }
            }

            var push = false;

            if (App.flags.dimensions.match(flag)) {
                render = true;
                ret.dimensions = App.flags.dimensions.output(flag);
                push = true;
            } else if (App.flags.fluid.match(flag)) {
                render = true;
                ret.dimensions = App.flags.fluid.output(flag);
                ret.fluid = true;
                push = true;
            } else if (App.flags.textmode.match(flag)) {
                ret.textmode = App.flags.textmode.output(flag);
                push = true;
            } else if (App.flags.colors.match(flag)) {
                var colors = App.flags.colors.output(flag);
                ret.theme = extend(ret.theme, colors);
                //todo: convert implicit theme use to a theme: flag
                push = true;
            } else if (options.themes[flag]) {
                //If a theme is specified, it will override custom colors
                if (options.themes.hasOwnProperty(flag)) {
                    ret.theme = extend(options.themes[flag], null);
                }
                push = true;
            } else if (App.flags.font.match(flag)) {
                ret.font = App.flags.font.output(flag);
                push = true;
            } else if (App.flags.auto.match(flag)) {
                ret.auto = true;
                push = true;
            } else if (App.flags.text.match(flag)) {
                ret.text = App.flags.text.output(flag);
                push = true;
            } else if (App.flags.size.match(flag)) {
                ret.size = App.flags.size.output(flag);
                push = true;
            } else if (App.flags.random.match(flag)) {
                if (App.vars.cache.themeKeys == null) {
                    App.vars.cache.themeKeys = Object.keys(options.themes);
                }
                var theme = App.vars.cache.themeKeys[0 | Math.random() * App.vars.cache.themeKeys.length];
                ret.theme = extend(options.themes[theme], null);
                push = true;
            }

            if (push) {
                ret.holderURL.push(flag);
            }
        }
        ret.holderURL.unshift(options.domain);
        ret.holderURL = ret.holderURL.join('/');
        return render ? ret : false;
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

        if (flags.text != null) {
            theme.text = flags.text;

            //<object> SVG embedding doesn't parse Unicode properly
            if (el.nodeName.toLowerCase() === 'object') {
                var textLines = theme.text.split('\\n');
                for (var k = 0; k < textLines.length; k++) {
                    textLines[k] = encodeHtmlEntity(textLines[k]);
                }
                theme.text = textLines.join('\\n');
            }
        }

        var holderURL = flags.holderURL;
        var engineSettings = extend(_engineSettings, null);

        if (flags.font) {
            theme.font = flags.font;
            //Only run the <canvas> webfont fallback if noFontFallback is false, if the node is not an image, and if canvas is supported
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
                setAttr(el, {
                    'data-background-src': holderURL
                });
            }
        } else {
            setAttr(el, {
                'data-src': holderURL
            });
        }

        flags.theme = theme;

        //todo consider using all renderSettings in holderData
        el.holderData = {
            flags: flags,
            engineSettings: engineSettings
        };

        if (mode == 'image' || mode == 'fluid') {
            setAttr(el, {
                'alt': (theme.text ? theme.text + ' [' + dimensionsCaption + ']' : dimensionsCaption)
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
            if (engineSettings.renderer == 'html' || !flags.auto) {
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
        var holderSettings = renderSettings.holderSettings;
        var el = renderSettings.el;
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
                    image = sgSVGRenderer(sceneGraph, renderSettings);
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
                setAttr(el, {
                    'src': image
                });
            } else if (el.nodeName.toLowerCase() === 'object') {
                setAttr(el, {
                    'data': image
                });
                setAttr(el, {
                    'type': 'image/svg+xml'
                });
            }
            if (engineSettings.reRender) {
                global.setTimeout(function() {
                    var image = getRenderedImage();
                    if (image == null) {
                        throw 'Holder: couldn\'t render placeholder';
                    }
                    if (el.nodeName.toLowerCase() === 'img') {
                        setAttr(el, {
                            'src': image
                        });
                    } else if (el.nodeName.toLowerCase() === 'object') {
                        setAttr(el, {
                            'data': image
                        });
                        setAttr(el, {
                            'type': 'image/svg+xml'
                        });
                    }
                }, 100);
            }
        }
        setAttr(el, {
            'data-holder-rendered': true
        });
    }

    /**
     * Core function that takes a Holder scene description and builds a scene graph
     *
     * @private
     * @param scene Holder scene object
     */
    function buildSceneGraph(scene) {
        var fontSize = App.defaults.size;
        if (parseFloat(scene.theme.size)) {
            fontSize = scene.theme.size;
        } else if (parseFloat(scene.flags.size)) {
            fontSize = scene.flags.size;
        }

        scene.font = {
            family: scene.theme.font ? scene.theme.font : 'Arial, Helvetica, Open Sans, sans-serif',
            size: textSize(scene.width, scene.height, fontSize),
            units: scene.theme.units ? scene.theme.units : App.defaults.units,
            weight: scene.theme.fontweight ? scene.theme.fontweight : 'bold'
        };
        scene.text = scene.theme.text ? scene.theme.text : Math.floor(scene.width) + 'x' + Math.floor(scene.height);

        switch (scene.flags.textmode) {
            case 'literal':
                scene.text = scene.flags.dimensions.width + 'x' + scene.flags.dimensions.height;
                break;
            case 'exact':
                if (!scene.flags.exactDimensions) break;
                scene.text = Math.floor(scene.flags.exactDimensions.width) + 'x' + Math.floor(scene.flags.exactDimensions.height);
                break;
        }

        var sceneGraph = new SceneGraph({
            width: scene.width,
            height: scene.height
        });

        var Shape = sceneGraph.Shape;

        var holderBg = new Shape.Rect('holderBg', {
            fill: scene.theme.background
        });

        holderBg.resize(scene.width, scene.height);
        sceneGraph.root.add(holderBg);

        var holderTextGroup = new Shape.Group('holderTextGroup', {
            text: scene.text,
            align: 'center',
            font: scene.font,
            fill: scene.theme.foreground
        });

        holderTextGroup.moveTo(null, null, 1);
        sceneGraph.root.add(holderTextGroup);

        var tpdata = holderTextGroup.textPositionData = stagingRenderer(sceneGraph);
        if (!tpdata) {
            throw 'Holder: staging fallback not supported yet.';
        }
        holderTextGroup.properties.leading = tpdata.boundingBox.height;

        //todo: alignment: TL, TC, TR, CL, CR, BL, BC, BR
        var textNode = null;
        var line = null;

        function finalizeLine(parent, line, width, height) {
            line.width = width;
            line.height = height;
            parent.width = Math.max(parent.width, line.width);
            parent.height += line.height;
            parent.add(line);
        }

        if (tpdata.lineCount > 1) {
            var offsetX = 0;
            var offsetY = 0;
            var maxLineWidth = scene.width * App.setup.lineWrapRatio;
            var lineIndex = 0;
            line = new Shape.Group('line' + lineIndex);

            for (var i = 0; i < tpdata.words.length; i++) {
                var word = tpdata.words[i];
                textNode = new Shape.Text(word.text);
                var newline = word.text == '\\n';
                if (offsetX + word.width >= maxLineWidth || newline === true) {
                    finalizeLine(holderTextGroup, line, offsetX, holderTextGroup.properties.leading);
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

            for (var lineKey in holderTextGroup.children) {
                line = holderTextGroup.children[lineKey];
                line.moveTo(
                    (holderTextGroup.width - line.width) / 2,
                    null,
                    null);
            }

            holderTextGroup.moveTo(
                (scene.width - holderTextGroup.width) / 2,
                (scene.height - holderTextGroup.height) / 2,
                null);

            //If the text exceeds vertical space, move it down so the first line is visible
            if ((scene.height - holderTextGroup.height) / 2 < 0) {
                holderTextGroup.moveTo(null, 0, null);
            }
        } else {
            textNode = new Shape.Text(scene.text);
            line = new Shape.Group('line0');
            line.add(textNode);
            holderTextGroup.add(line);

            holderTextGroup.moveTo(
                (scene.width - tpdata.boundingBox.width) / 2,
                (scene.height - tpdata.boundingBox.height) / 2,
                null);
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
     */
    function textSize(width, height, fontSize) {
        var stageWidth = parseInt(width, 10);
        var stageHeight = parseInt(height, 10);

        var bigSide = Math.max(stageWidth, stageHeight);
        var smallSide = Math.min(stageWidth, stageHeight);

        var newHeight = 0.8 * Math.min(smallSide, bigSide * App.defaults.scale);
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
     * Returns an element's dimensions if it's visible, `false` otherwise.
     *
     * @private
     * @param el DOM element
     */
    function dimensionCheck(el) {
        var dimensions = {
            height: el.clientHeight,
            width: el.clientWidth
        };

        if (dimensions.height && dimensions.width) {
            return dimensions;
        }
        else{
            return false;
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
        for (var i = 0, l = keys.length; i < l; i++) {
            el = App.vars.invisibleImages[keys[i]];
            if (dimensionCheck(el) && el.nodeName.toLowerCase() == 'img') {
                renderableImages.push(el);
                delete App.vars.invisibleImages[keys[i]];
            }
        }

        if (renderableImages.length) {
            Holder.run({
                images: renderableImages
            });
        }

        global.requestAnimationFrame(visibilityCheck);
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

                svg = initSVG(svg, rootNode.properties.width, rootNode.properties.height);
                //Show staging element before staging
                svg.style.display = 'block';

                if (firstTimeSetup) {
                    stagingText = newEl('text', SVG_NS);
                    stagingTextNode = tnode(null);
                    setAttr(stagingText, {
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
                setAttr(stagingText, {
                    'y': htgProps.font.size,
                    'style': cssProps({
                        'font-weight': htgProps.font.weight,
                        'font-size': htgProps.font.size + htgProps.font.units,
                        'font-family': htgProps.font.family
                    })
                });

                //Get bounding box for the whole string (total width and height)
                stagingTextNode.nodeValue = htgProps.text;
                var stagingTextBBox = stagingText.getBBox();

                //Get line count and split the string into words
                var lineCount = Math.ceil(stagingTextBBox.width / (rootNode.properties.width * App.setup.lineWrapRatio));
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
                        stagingTextNode.nodeValue = decodeHtmlEntity(words[i]);
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

    var sgCanvasRenderer = (function() {
        var canvas = newEl('canvas');
        var ctx = null;

        return function(sceneGraph) {
            if (ctx == null) {
                ctx = canvas.getContext('2d');
            }
            var root = sceneGraph.root;
            canvas.width = App.dpr(root.properties.width);
            canvas.height = App.dpr(root.properties.height);
            ctx.textBaseline = 'middle';

            ctx.fillStyle = root.children.holderBg.properties.fill;
            ctx.fillRect(0, 0, App.dpr(root.children.holderBg.width), App.dpr(root.children.holderBg.height));

            var textGroup = root.children.holderTextGroup;
            var tgProps = textGroup.properties;
            ctx.font = textGroup.properties.font.weight + ' ' + App.dpr(textGroup.properties.font.size) + textGroup.properties.font.units + ' ' + textGroup.properties.font.family + ', monospace';
            ctx.fillStyle = textGroup.properties.fill;

            for (var lineKey in textGroup.children) {
                var line = textGroup.children[lineKey];
                for (var wordKey in line.children) {
                    var word = line.children[wordKey];
                    var x = App.dpr(textGroup.x + line.x + word.x);
                    var y = App.dpr(textGroup.y + line.y + word.y + (textGroup.properties.leading / 2));

                    ctx.fillText(word.properties.text, x, y);
                }
            }

            return canvas.toDataURL('image/png');
        };
    })();

    var sgSVGRenderer = (function() {
        //Prevent IE <9 from initializing SVG renderer
        if (!global.XMLSerializer) return;
        var svg = initSVG(null, 0, 0);
        var bgEl = newEl('rect', SVG_NS);
        svg.appendChild(bgEl);

        //todo: create a reusable pool for textNodes, resize if more words present

        return function(sceneGraph, renderSettings) {
            var root = sceneGraph.root;

            var holderURL = renderSettings.holderSettings.flags.holderURL;
            var commentNode = document.createComment('\n' + 'Source URL: ' + holderURL + generatorComment);

            initSVG(svg, root.properties.width, root.properties.height);
            svg.insertBefore(commentNode, svg.firstChild);

            var groups = svg.querySelectorAll('g');

            for (var i = 0; i < groups.length; i++) {
                groups[i].parentNode.removeChild(groups[i]);
            }

            setAttr(bgEl, {
                'width': root.children.holderBg.width,
                'height': root.children.holderBg.height,
                'fill': root.children.holderBg.properties.fill
            });

            var textGroup = root.children.holderTextGroup;
            var tgProps = textGroup.properties;
            var textGroupEl = newEl('g', SVG_NS);
            var tpdata = textGroup.textPositionData;
            svg.appendChild(textGroupEl);

            textGroup.y += tpdata.boundingBox.height * 0.8;

            for (var lineKey in textGroup.children) {
                var line = textGroup.children[lineKey];
                for (var wordKey in line.children) {
                    var word = line.children[wordKey];
                    var x = textGroup.x + line.x + word.x;
                    var y = textGroup.y + line.y + word.y;

                    var textEl = newEl('text', SVG_NS);
                    var textNode = document.createTextNode(null);

                    setAttr(textEl, {
                        'x': x,
                        'y': y,
                        'style': cssProps({
                            'fill': tgProps.fill,
                            'font-weight': tgProps.font.weight,
                            'font-family': tgProps.font.family + ', monospace',
                            'font-size': tgProps.font.size + tgProps.font.units
                        })
                    });

                    textNode.nodeValue = word.properties.text;
                    textEl.appendChild(textNode);
                    textGroupEl.appendChild(textEl);
                }
            }

            var svgString = 'data:image/svg+xml;base64,' +
                btoa(unescape(encodeURIComponent(serializeSVG(svg, renderSettings.engineSettings))));
            return svgString;
        };
    })();

    //Helpers

    /**
     * Generic new DOM element function
     *
     * @private
     * @param tag Tag to create
     * @param namespace Optional namespace value
     */
    function newEl(tag, namespace) {
        if (namespace == null) {
            return document.createElement(tag);
        } else {
            return document.createElementNS(namespace, tag);
        }
    }

    /**
     * Generic setAttribute function
     *
     * @private
     * @param el Reference to DOM element
     * @param attrs Object with attribute keys and values
     */
    function setAttr(el, attrs) {
        for (var a in attrs) {
            el.setAttribute(a, attrs[a]);
        }
    }

    /**
     * Generic SVG element creation function
     *
     * @private
     * @param svg SVG context, set to null if new
     * @param width Document width
     * @param height Document height
     */
    function initSVG(svg, width, height) {
        if (svg == null) {
            svg = newEl('svg', SVG_NS);
            var defs = newEl('defs', SVG_NS);
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

        setAttr(svg, {
            'width': width,
            'height': height,
            'viewBox': '0 0 ' + width + ' ' + height,
            'preserveAspectRatio': 'none'
        });
        return svg;
    }

    /**
     * Generic SVG serialization function
     *
     * @private
     * @param svg SVG context
     * @param stylesheets CSS stylesheets to include
     */
    function serializeSVG(svg, engineSettings) {
        if (!global.XMLSerializer) return;
        var serializer = new XMLSerializer();
        var svgCSS = '';
        var stylesheets = engineSettings.stylesheets;
        var defs = svg.querySelector('defs');

        //External stylesheets: Processing Instruction method
        if (engineSettings.svgXMLStylesheet) {
            var xml = new DOMParser().parseFromString('<xml />', 'application/xml');
            //Add <?xml-stylesheet ?> directives
            for (var i = stylesheets.length - 1; i >= 0; i--) {
                var csspi = xml.createProcessingInstruction('xml-stylesheet', 'href="' + stylesheets[i] + '" rel="stylesheet"');
                xml.insertBefore(csspi, xml.firstChild);
            }

            //Add <?xml ... ?> UTF-8 directive
            var xmlpi = xml.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8" standalone="yes"');
            xml.insertBefore(xmlpi, xml.firstChild);
            xml.removeChild(xml.documentElement);
            svgCSS = serializer.serializeToString(xml);
        }

        /*

		//External stylesheets: <link> method
		if (renderSettings.svgLinkStylesheet) {

			defs.removeChild(defs.firstChild);
			for (i = 0; i < stylesheets.length; i++) {
				var link = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
				link.setAttribute('href', stylesheets[i]);
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('type', 'text/css');
				defs.appendChild(link);
			}
		}

		//External stylesheets: <style> and @import method
		if (renderSettings.svgImportStylesheet) {
			var style = document.createElementNS(SVG_NS, 'style');
			var styleText = [];

			for (i = 0; i < stylesheets.length; i++) {
				styleText.push('@import url(' + stylesheets[i] + ');');
			}

			var styleTextNode = document.createTextNode(styleText.join('\n'));
			style.appendChild(styleTextNode);
			defs.appendChild(style);
		}

		*/

        var svgText = serializer.serializeToString(svg);
        svgText = svgText.replace(/\&amp;(\#[0-9]{2,}\;)/g, '&$1');
        return svgCSS + svgText;
    }

    /**
     * Shallow object clone and merge
     *
     * @param a Object A
     * @param b Object B
     * @returns {Object} New object with all of A's properties, and all of B's properties, overwriting A's properties
     */
    function extend(a, b) {
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
    }

    /**
     * Takes a k/v list of CSS properties and returns a rule
     *
     * @param props CSS properties object
     */
    function cssProps(props) {
        var ret = [];
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                ret.push(p + ':' + props[p]);
            }
        }
        return ret.join(';');
    }

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

    /**
     * Converts a value into an array of DOM nodes
     *
     * @param val A string, a NodeList, a Node, or an HTMLCollection
     */
    function getNodeArray(val) {
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
        return retval;
    }

    /**
     * Checks if an image exists
     *
     * @param src URL of image
     * @param callback Callback to call once image status has been found
     */
    function imageExists(src, callback) {
        var image = new Image();
        image.onerror = function() {
            callback.call(this, false);
        };
        image.onload = function() {
            callback.call(this, true);
        };
        image.src = src;
    }

    /**
     * Encodes HTML entities in a string
     *
     * @param str Input string
     */
    function encodeHtmlEntity(str) {
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
    }

    /**
     * Decodes HTML entities in a stirng
     *
     * @param str Input string
     */
    function decodeHtmlEntity(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
    }

    // Scene graph

    var SceneGraph = function(sceneProperties) {
        var nodeCount = 1;

        //todo: move merge to helpers section
        function merge(parent, child) {
            for (var prop in child) {
                parent[prop] = child[prop];
            }
            return parent;
        }

        var SceneNode = augment.defclass({
            constructor: function(name) {
                nodeCount++;
                this.parent = null;
                this.children = {};
                this.id = nodeCount;
                this.name = 'n' + nodeCount;
                if (name != null) {
                    this.name = name;
                }
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.width = 0;
                this.height = 0;
            },
            resize: function(width, height) {
                if (width != null) {
                    this.width = width;
                }
                if (height != null) {
                    this.height = height;
                }
            },
            moveTo: function(x, y, z) {
                this.x = x != null ? x : this.x;
                this.y = y != null ? y : this.y;
                this.z = z != null ? z : this.z;
            },
            add: function(child) {
                    var name = child.name;
                    if (this.children[name] == null) {
                        this.children[name] = child;
                        child.parent = this;
                    } else {
                        throw 'SceneGraph: child with that name already exists: ' + name;
                    }
                }
                /*,	// probably unnecessary in Holder
				remove: function(name){
					if(this.children[name] == null){
						throw 'SceneGraph: child with that name doesn\'t exist: '+name;
					}
					else{
						child.parent = null;
						delete this.children[name];
					}
				},
				removeAll: function(){
					for(var child in this.children){
						this.remove(child);
					}
				}*/
        });

        var RootNode = augment(SceneNode, function(uber) {
            this.constructor = function() {
                uber.constructor.call(this, 'root');
                this.properties = sceneProperties;
            };
        });

        var Shape = augment(SceneNode, function(uber) {
            function constructor(name, props) {
                uber.constructor.call(this, name);
                this.properties = {
                    fill: '#000'
                };
                if (props != null) {
                    merge(this.properties, props);
                } else if (name != null && typeof name !== 'string') {
                    throw 'SceneGraph: invalid node name';
                }
            }

            this.Group = augment.extend(this, {
                constructor: constructor,
                type: 'group'
            });

            this.Rect = augment.extend(this, {
                constructor: constructor,
                type: 'rect'
            });

            this.Text = augment.extend(this, {
                constructor: function(text) {
                    constructor.call(this);
                    this.properties.text = text;
                },
                type: 'text'
            });
        });

        var root = new RootNode();

        this.Shape = Shape;
        this.root = root;

        return this;
    };

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
        renderers: ['html', 'canvas', 'svg']
    };

    App.dpr = function(val) {
        return val * App.setup.ratio;
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
        var devicePixelRatio = 1,
            backingStoreRatio = 1;

        var canvas = newEl('canvas');
        var ctx = null;

        if (canvas.getContext) {
            if (canvas.toDataURL('image/png').indexOf('data:image/png') != -1) {
                App.setup.renderer = 'canvas';
                ctx = canvas.getContext('2d');
                App.setup.supportsCanvas = true;
            }
        }

        if (App.setup.supportsCanvas) {
            devicePixelRatio = global.devicePixelRatio || 1;
            backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        }

        App.setup.ratio = devicePixelRatio / backingStoreRatio;

        if (!!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect) {
            App.setup.renderer = 'svg';
            App.setup.supportsSVG = true;
        }
    })();
    
    //Starts checking for invisible placeholders
    startVisibilityCheck();

    //Exposing to environment and setting up listeners
    register(Holder, 'Holder', global);

    if (global.onDomReady) {
        global.onDomReady(function() {
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

})(function(fn, name, global) {
    var isAMD = (typeof define === 'function' && define.amd);
    var isNode = (typeof exports === 'object');
    var isWeb = !isNode;

    if (isAMD) {
        define(fn);
    } else {
        //todo: npm/browserify registration
        global[name] = fn;
    }
}, this);