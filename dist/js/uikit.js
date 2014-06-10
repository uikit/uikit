/*! UIkit 2.7.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(core) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit", function(){

            var uikit = core(window, window.jQuery, window.document);

            uikit.load = function(res, req, onload, config) {

                var resources = res.split(','), load = [], i, base = (config.config && config.config.uikit && config.config.uikit.base ? config.config.uikit.base : "").replace(/\/+$/g, "");

                if (!base) {
                    throw new Error( "Please define base path to uikit in the requirejs config." );
                }

                for (i = 0; i < resources.length; i += 1) {
                    var resource = resources[i].replace(/\./g, '/');
                    load.push(base+'/js/addons/'+resource);
                }

                req(load, function() {
                    onload(uikit);
                });
            };

            return uikit;
        });
    }

    if (!window.jQuery) {
        throw new Error( "UIkit requires jQuery" );
    }

    if (window && window.jQuery) {
        core(window, window.jQuery, window.document);
    }


})(function(global, $, doc) {

    "use strict";

    var UI = $.UIkit || {}, $html = $("html"), $win = $(window), $doc = $(document);

    if (UI.fn) {
        return UI;
    }

    UI.version = '2.7.0';

    UI.fn = function(command, options) {

        var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), component = cmd[1], method = cmd[2];

        if (!UI[component]) {
            $.error("UIkit component [" + component + "] does not exist.");
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
            if (!data) $this.data(component, (data = UI[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };


    UI.support = {};
    UI.support.transition = (function() {

        var transitionEnd = (function() {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && { end: transitionEnd };
    })();

    UI.support.animation = (function() {

        var animationEnd = (function() {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && { end: animationEnd };
    })();

    UI.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ setTimeout(callback, 1000/60); };
    UI.support.touch                 = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (global.DocumentTouch && document instanceof global.DocumentTouch)  ||
        (global.navigator['msPointerEnabled'] && global.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (global.navigator['pointerEnabled'] && global.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );
    UI.support.mutationobserver      = (global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver || null);

    UI.Utils = {};

    UI.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    UI.Utils.removeCssRules = function(selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if(!selectorRegEx) return;

        setTimeout(function(){
            try {
              _ref = document.styleSheets;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stylesheet = _ref[_i];
                idxs = [];
                stylesheet.cssRules = stylesheet.cssRules;
                for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                  if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                    idxs.unshift(idx);
                  }
                }
                for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                  stylesheet.deleteRule(idxs[_k]);
                }
              }
            } catch (_error) {}
        }, 0);
    };

    UI.Utils.isInView = function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    };

    UI.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    UI.Utils.template = function(str, data) {

        var tokens = str.replace(/\n/g, '\\n').replace(/\{\{\{\s*(.+?)\s*\}\}\}/g, "{{!$1}}").split(/(\{\{\s*(.+?)\s*\}\})/g),
            i=0, toc, cmd, prop, val, fn, output = [], openblocks = 0;

        while(i < tokens.length) {

            toc = tokens[i];

            if(toc.match(/\{\{\s*(.+?)\s*\}\}/)) {
                i = i + 1;
                toc  = tokens[i];
                cmd  = toc[0];
                prop = toc.substring(toc.match(/^(\^|\#|\!|\~|\:)/) ? 1:0);

                switch(cmd) {
                    case '~':
                        output.push("for(var $i=0;$i<"+prop+".length;$i++) { var $item = "+prop+"[$i];");
                        openblocks++;
                        break;
                    case ':':
                        output.push("for(var $key in "+prop+") { var $val = "+prop+"[$key];");
                        openblocks++;
                        break;
                    case '#':
                        output.push("if("+prop+") {");
                        openblocks++;
                        break;
                    case '^':
                        output.push("if(!"+prop+") {");
                        openblocks++;
                        break;
                    case '/':
                        output.push("}");
                        openblocks--;
                        break;
                    case '!':
                        output.push("__ret.push("+prop+");");
                        break;
                    default:
                        output.push("__ret.push(escape("+prop+"));");
                        break;
                }
            } else {
                output.push("__ret.push('"+toc.replace(/\'/g, "\\'")+"');");
            }
            i = i + 1;
        }

        fn  = [
            'var __ret = [];',
            'try {',
            'with($data){', (!openblocks ? output.join('') : '__ret = ["Not all blocks are closed correctly."]'), '};',
            '}catch(e){__ret = [e.message];}',
            'return __ret.join("").replace(/\\n\\n/g, "\\n");',
            "function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"
        ].join("\n");

        var func = new Function('$data', fn);
        return data ? func(data) : func;
    };

    UI.Utils.events       = {};
    UI.Utils.events.click = UI.support.touch ? 'tap' : 'click';

    $.UIkit = UI;
    $.fn.uk = UI.fn;

    $.UIkit.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

    $(function(){

        $doc.trigger("uk-domready");

        // custom scroll observer
        setInterval((function(){

            var memory = {x: window.scrollX, y:window.scrollY};

            var fn = function(){

                if (memory.x != window.scrollX || memory.y != window.scrollY) {
                    memory = {x: window.scrollX, y:window.scrollY};
                    $doc.trigger('uk-scroll', [memory]);
                }
            };

            if ($.UIkit.support.touch) {
                $doc.on('touchmove touchend MSPointerMove MSPointerUp', fn);
            }

            if(memory.x || memory.y) fn();

            return fn;

        })(), 15);


        // Check for dom modifications
        if(!UI.support.mutationobserver) return;

        try{

            var observer = new UI.support.mutationobserver(UI.Utils.debounce(function(mutations) {
                $doc.trigger("uk-domready");
            }, 150));

            // pass in the target node, as well as the observer options
            observer.observe(document.body, { childList: true, subtree: true });

        } catch(e) {}

        // remove css hover rules for touch devices
        if (UI.support.touch) {
            UI.Utils.removeCssRules(/\.uk-(?!navbar).*:hover/);
        }
    });

    // add touch identifier class
    $html.addClass(UI.support.touch ? "uk-touch" : "uk-notouch");

    // add uk-hover class on tap to support overlays on touch devices
    if (UI.support.touch) {

        var hoverset = false, selector = '.uk-overlay, .uk-overlay-toggle, .uk-has-hover', exclude;

        $doc.on('touchstart MSPointerDown', selector, function() {

            if(hoverset) $('.uk-hover').removeClass('uk-hover');

            hoverset = $(this).addClass('uk-hover');

        }).on('touchend MSPointerUp', function(e) {

            exclude = $(e.target).parents(selector);

            if (hoverset) hoverset.not(exclude).removeClass('uk-hover');
        });
    }

    return UI;
});

/**
 * Promises/A+ spec. polyfill
 * promiscuous - https://github.com/RubenVerborgh/promiscuous
 * @license MIT
 * Ruben Verborgh
 */

(function(global){

    global.Promise = global.Promise || (function (func, obj) {

        // Type checking utility function
        function is(type, item) { return (typeof item)[0] == type; }

        // Creates a promise, calling callback(resolve, reject), ignoring other parameters.
        function Promise(callback, handler) {
            // The `handler` variable points to the function that will
            // 1) handle a .then(resolved, rejected) call
            // 2) handle a resolve or reject call (if the first argument === `is`)
            // Before 2), `handler` holds a queue of callbacks.
            // After 2), `handler` is a finalized .then handler.
            handler = function pendingHandler(resolved, rejected, value, queue, then, i) {
                queue = pendingHandler.q;

                // Case 1) handle a .then(resolved, rejected) call
                if (resolved != is) {
                    return Promise(function (resolve, reject) {
                        queue.push({ p: this, r: resolve, j: reject, 1: resolved, 0: rejected });
                    });
                }

                // Case 2) handle a resolve or reject call
                // (`resolved` === `is` acts as a sentinel)
                // The actual function signature is
                // .re[ject|solve](<is>, success, value)

                // Check if the value is a promise and try to obtain its `then` method
                if (value && (is(func, value) | is(obj, value))) {
                    try { then = value.then; }
                    catch (reason) { rejected = 0; value = reason; }
                }
                // If the value is a promise, take over its state
                if (is(func, then)) {
                    var valueHandler = function (resolved) {
                        return function (value) { return then && (then = 0, pendingHandler(is, resolved, value)); };
                    };
                    try { then.call(value, valueHandler(1), rejected = valueHandler(0)); }
                    catch (reason) { rejected(reason); }
                }
                // The value is not a promise; handle resolve/reject
                else {
                    // Replace this handler with a finalized resolved/rejected handler
                    handler = function (Resolved, Rejected) {
                        // If the Resolved or Rejected parameter is not a function,
                        // return the original promise (now stored in the `callback` variable)
                        if (!is(func, (Resolved = rejected ? Resolved : Rejected))) return callback;
                        // Otherwise, return a finalized promise, transforming the value with the function
                        return Promise(function (resolve, reject) { finalize(this, resolve, reject, value, Resolved); });
                    };
                    // Resolve/reject pending callbacks
                    i = 0;
                    while (i < queue.length) {
                        then = queue[i++];
                        // If no callback, just resolve/reject the promise
                        if (!is(func, resolved = then[rejected])) {
                            (rejected ? then.r : then.j)(value);
                        // Otherwise, resolve/reject the promise with the result of the callback
                        } else {
                            finalize(then.p, then.r, then.j, value, resolved);
                        }
                    }
                }
            };

            // The queue of pending callbacks; garbage-collected when handler is resolved/rejected
            handler.q = [];

            // Create and return the promise (reusing the callback variable)
            callback.call(callback = {
                    then:  function (resolved, rejected) { return handler(resolved, rejected); },
                    catch: function (rejected)           { return handler(0,        rejected); }
                },
                function (value)  { handler(is, 1,  value); },
                function (reason) { handler(is, 0, reason); }
            );

            return callback;
        }

        // Finalizes the promise by resolving/rejecting it with the transformed value
        function finalize(promise, resolve, reject, value, transform) {
            setTimeout(function () {
                try {
                    // Transform the value through and check whether it's a promise
                    value = transform(value);
                    transform = value && (is(obj, value) | is(func, value)) && value.then;
                    // Return the result if it's not a promise
                    if (!is(func, transform))
                        resolve(value);
                    // If it's a promise, make sure it's not circular
                    else if (value == promise)
                        reject(TypeError());
                    // Take over the promise's state
                    else
                        transform.call(value, resolve, reject);
                }
                catch (error) { reject(error); }
            }, 0);
        }

        // Creates a resolved promise
        Promise.resolve = ResolvedPromise;
        function ResolvedPromise(value) { return Promise(function (resolve) { resolve(value); }); }

        // Creates a rejected promise
        Promise.reject = function (reason) { return Promise(function (resolve, reject) { reject(reason); }); };

        // Transforms an array of promises into a promise for an array
        Promise.all = function (promises) {
            return Promise(function (resolve, reject, count, values) {
                // Array of collected values
                values = [];
                // Resolve immediately if there are no promises
                count = promises.length || resolve(values);
                // Transform all elements (`map` is shorter than `forEach`)
                promises.map(function (promise, index) {
                    ResolvedPromise(promise).then(
                    // Store the value and resolve if it was the last
                    function (value) {
                        values[index] = value;
                        count = count -1;
                        if(!count) resolve(values);
                    },
                    // Reject if one element fails
                    reject);
                });
            });
        };

        return Promise;
    })('f', 'o');
})(this);

(function($, UI) {

    "use strict";

    UI.components = {};

    UI.component = function(name, def) {

        var fn = function(element, options) {

            var $this = this;

            this.element = element ? $(element) : null;
            this.options = $.extend(true, {}, this.defaults, options);
            this.plugins = {};

            if (this.element) {
                this.element.data(name, this);
            }

            this.init();

            (this.options.plugins.length ? this.options.plugins : Object.keys(fn.plugins)).forEach(function(plugin) {

                if (fn.plugins[plugin].init) {
                    fn.plugins[plugin].init($this);
                    $this.plugins[plugin] = true;
                }

            });

            this.trigger('init', [this]);
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults : {plugins: []},

            init: function(){},

            on: function(){
                return $(this.element || this).on.apply(this.element || this, arguments);
            },

            one: function(){
                return $(this.element || this).one.apply(this.element || this, arguments);
            },

            off: function(evt){
                return $(this.element || this).off(evt);
            },

            trigger: function(evt, params) {
                return $(this.element || this).trigger(evt, params);
            },

            find: function(selector) {
                return this.element ? this.element.find(selector) : $([]);
            },

            proxy: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = function() { return obj[method].apply(obj, arguments); };
                });
            },

            mixin: function(obj, methods) {

                var $this = this;

                methods.split(' ').forEach(function(method) {
                    if (!$this[method]) $this[method] = obj[method].bind($this);
                });
            },

        }, def);

        this.components[name] = fn;

        this[name] = function() {

            var element, options;

            if(arguments.length) {
                switch(arguments.length) {
                    case 1:

                        if (typeof arguments[0] === "string" || arguments[0].nodeType || arguments[0] instanceof jQuery) {
                            element = $(arguments[0]);
                        } else {
                            options = arguments[0];
                        }

                        break;
                    case 2:

                        element = $(arguments[0]);
                        options = arguments[1];
                        break;
                }
            }

            if (element && element.data(name)) {
                return element.data(name);
            }

            return (new UI.components[name](element, options));
        };

        return fn;
    };

    UI.plugin = function(component, name, def) {
        this.components[component].plugins[name] = def;
    };

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange', stacks = [];

    UI.component('stackMargin', {

        defaults: {
            'cls': 'uk-margin-small-top'
        },

        init: function() {

            var $this = this;

            this.columns = this.element.children();

            if (!this.columns.length) return;

            win.on(event, (function() {
                var fn = function() {
                    $this.process();
                };

                $(function() {
                    fn();
                    win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 150);
            })());

            $(document).on("uk-domready", function(e) {
                $this.columns  = $this.element.children();
                $this.process();
            });

            stacks.push(this);
        },

        process: function() {

            var $this = this;

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? firstvisible.offset().top : false;

            if (offset === false) return;

            this.columns.each(function() {

                var column = $(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass($this.options.cls);
                    } else {
                        if (column.offset().top != offset) {
                            column.addClass($this.options.cls);
                            skip = true;
                        }
                    }
                }
            });

            return this;
        },

        revert: function() {
            this.columns.removeClass(this.options.cls);
            return this;
        }
    });

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-margin]").each(function() {
            var ele = $(this), obj;

            if (!ele.data("stackMargin")) {
                obj = UI.stackMargin(ele, UI.Utils.options(ele.attr("data-uk-margin")));
            }
        });
    });


    $(document).on("uk-check-display", function(e) {
        stacks.forEach(function(item) {
            if(item.element.is(":visible")) item.process();
        });
    });

})(jQuery, jQuery.UIkit);

//  Based on Zeptos touch.js
//  https://raw.github.com/madrobby/zepto/master/src/touch.js
//  Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture;

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }

  function longTap() {
    longTapTimeout = null;
    if (touch.last) {
      touch.el.trigger('longTap');
      touch = {};
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout);
    longTapTimeout = null;
  }

  function cancelAll() {
    if (touchTimeout)   clearTimeout(touchTimeout);
    if (tapTimeout)     clearTimeout(tapTimeout);
    if (swipeTimeout)   clearTimeout(swipeTimeout);
    if (longTapTimeout) clearTimeout(longTapTimeout);
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
    touch = {};
  }

  function isPrimaryTouch(event){
    return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary;
  }

  $(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch;

    if ('MSGesture' in window) {
      gesture = new MSGesture();
      gesture.target = document.body;
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe');
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity);
        }
      })
      .on('touchstart MSPointerDown', function(e){

        if(e.type == 'MSPointerDown' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = e.type == 'MSPointerDown' ? e : e.originalEvent.touches[0];

        now      = Date.now();
        delta    = now - (touch.last || now);
        touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

        if(touchTimeout) clearTimeout(touchTimeout);

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;

        touch.last = now;
        longTapTimeout = setTimeout(longTap, longTapDelay);

        // adds the current touch contact for IE gesture recognition
        if (gesture && e.type == 'MSPointerDown') gesture.addPointer(e.originalEvent.pointerId);
      })
      .on('touchmove MSPointerMove', function(e){

        if(e.type == 'MSPointerMove' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = e.type == 'MSPointerMove' ? e : e.originalEvent.touches[0];

        cancelLongTap();
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
      })
      .on('touchend MSPointerUp', function(e){

        if(e.type == 'MSPointerUp' && !isPrimaryTouch(e.originalEvent)) return;

        cancelLongTap();

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)){

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe');
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
            touch = {};
          }, 0);

        // normal tap
        } else if ('last' in touch) {

          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (isNaN(deltaX) || (deltaX < 30 && deltaY < 30)) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap');
              event.cancelTouch = cancelAll;
              touch.el.trigger(event);

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                touch.el.trigger('doubleTap');
                touch = {};
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null;
                  touch.el.trigger('singleTap');
                  touch = {};
                }, 250);
              }
            }, 0);
          } else {
            touch = {};
          }
          deltaX = deltaY = 0;
        }
      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel', cancelAll);

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll);
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return $(this).on(eventName, callback); };
  });
})(jQuery);

(function($, UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            "fade": true,
            "duration": 200,
            "trigger": ".uk-alert-close"
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.trigger, function(e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function() {

            var element = this.trigger("close");

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height": 0,
                    "opacity": 0,
                    "padding-top": 0,
                    "padding-bottom": 0,
                    "margin-top": 0,
                    "margin-bottom": 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }

            function removeElement() {
                element.trigger("closed").remove();
            }
        }

    });

    // init code
    $(document).on("click.alert.uikit", "[data-uk-alert]", function(e) {

        var ele = $(this);

        if (!ele.data("alert")) {

            var alert = UI.alert(ele, UI.Utils.options(ele.data("uk-alert")));

            if ($(e.target).is(ele.data("alert").options.trigger)) {
                e.preventDefault();
                alert.close();
            }
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            "target": ".uk-button"
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if ($(this).is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(this).removeClass("uk-active").blur();
                $this.trigger("change", [$(this).addClass("uk-active")]);
            });

        },

        getSelected: function() {
            this.find(".uk-active");
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            "target": ".uk-button"
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if ($(this).is('a[href="#"]')) e.preventDefault();

                $this.trigger("change", [$(this).toggleClass("uk-active").blur()]);
            });

        },

        getSelected: function() {
            this.find(".uk-active");
        }
    });


    UI.component('button', {

        defaults: {},

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger("change", [$element.blur().hasClass("uk-active")]);
            });

        },

        toggle: function() {
            this.element.toggleClass("uk-active");
        }
    });


    // init code
    $(document).on("click.buttonradio.uikit", "[data-uk-button-radio]", function(e) {
        var ele = $(this);

        if (!ele.data("buttonRadio")) {
            var obj = UI.buttonRadio(ele, UI.Utils.options(ele.attr("data-uk-button-radio")));

            if ($(e.target).is(obj.options.target)) {
                $(e.target).trigger("click");
            }
        }
    });

    $(document).on("click.buttoncheckbox.uikit", "[data-uk-button-checkbox]", function(e) {
        var ele = $(this);

        if (!ele.data("buttonCheckbox")) {

            var obj = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr("data-uk-button-checkbox"))), target=$(e.target);

            if (target.is(obj.options.target)) {
                ele.trigger("change", [target.toggleClass("uk-active").blur()]);
            }
        }
    });

    $(document).on("click.button.uikit", "[data-uk-button]", function(e) {
        var ele = $(this);

        if (!ele.data("button")) {

            var obj = UI.button(ele, UI.Utils.options(ele.attr("data-uk-button")));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var active = false;

    UI.component('dropdown', {

        defaults: {
           "mode": "hover",
           "remaintime": 800,
           "justify": false,
           "boundary": $(window)
        },

        remainIdle: false,

        init: function() {

            var $this = this;

            this.dropdown = this.find(".uk-dropdown");

            this.centered  = this.dropdown.hasClass("uk-dropdown-center");
            this.justified = this.options.justify ? $(this.options.justify) : false;

            this.boundary  = $(this.options.boundary);
            this.flipped   = this.dropdown.hasClass('uk-dropdown-flip');

            if(!this.boundary.length) {
                this.boundary = $(window);
            }

            if (this.options.mode == "click" || UI.support.touch) {

                this.on("click", function(e) {

                    var $target = $(e.target);

                    if (!$target.parents(".uk-dropdown").length) {

                        if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                            e.preventDefault();
                        }

                        $target.blur();
                    }

                    if (!$this.element.hasClass("uk-open")) {

                        $this.show();

                    } else {

                        if ($target.is("a:not(.js-uk-prevent)") || $target.is(".uk-dropdown-close") || !$this.dropdown.find(e.target).length) {
                            $this.element.removeClass("uk-open");
                            active = false;
                        }
                    }
                });

            } else {

                this.on("mouseenter", function(e) {

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    $this.show();

                }).on("mouseleave", function() {

                    $this.remainIdle = setTimeout(function() {

                        $this.element.removeClass("uk-open");
                        $this.remainIdle = false;

                        if (active && active[0] == $this.element[0]) active = false;

                    }, $this.options.remaintime);

                }).on("click", function(e){

                    var $target = $(e.target);

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if ($target.is("a[href='#']") || $target.parent().is("a[href='#']")){
                        e.preventDefault();
                    }

                    $this.show();
                });
            }
        },

        show: function(){

            if (active && active[0] != this.element[0]) {
                active.removeClass("uk-open");
            }

            this.checkDimensions();
            this.element.addClass("uk-open");
            this.trigger('uk.dropdown.show', [this]);
            active = this.element;

            this.registerOuterClick();
        },

        registerOuterClick: function(){

            var $this = this;

            $(document).off("click.outer.dropdown");

            setTimeout(function() {
                $(document).on("click.outer.dropdown", function(e) {

                    var $target = $(e.target);

                    if (active && active[0] == $this.element[0] && ($target.is("a:not(.js-uk-prevent)") || $target.is(".uk-dropdown-close") || !$this.dropdown.find(e.target).length)) {
                        active.removeClass("uk-open");
                        $(document).off("click.outer.dropdown");
                    }
                });
            }, 10);
        },

        checkDimensions: function() {

            if(!this.dropdown.length) return;

            if (this.justified && this.justified.length) {
                this.dropdown.css("min-width", "");
            }

            var $this     = this,
                dropdown  = this.dropdown.css("margin-" + $.UIkit.langdirection, ""),
                offset    = dropdown.show().offset(),
                width     = dropdown.outerWidth(),
                boundarywidth  = this.boundary.width(),
                boundaryoffset = this.boundary.offset() ? this.boundary.offset().left:0;

            // centered dropdown
            if (this.centered) {
                dropdown.css("margin-" + $.UIkit.langdirection, (parseFloat(width) / 2 - dropdown.parent().width() / 2) * -1);
                offset = dropdown.offset();

                // reset dropdown
                if ((width + offset.left) > boundarywidth || offset.left < 0) {
                    dropdown.css("margin-" + $.UIkit.langdirection, "");
                    offset = dropdown.offset();
                }
            }

            // justify dropdown
            if (this.justified && this.justified.length) {

                var jwidth = this.justified.outerWidth();

                dropdown.css("min-width", jwidth);

                if ($.UIkit.langdirection == 'right') {

                    var right1   = boundarywidth - (this.justified.offset().left + jwidth),
                        right2   = boundarywidth - (dropdown.offset().left + dropdown.outerWidth());

                    dropdown.css("margin-right", right1 - right2);

                } else {
                    dropdown.css("margin-left", this.justified.offset().left - offset.left);
                }

                offset = dropdown.offset();

            }

            if ((width + (offset.left-boundaryoffset)) > boundarywidth) {
                dropdown.addClass("uk-dropdown-flip");
                offset = dropdown.offset();
            }

            if ((offset.left-boundaryoffset) < 0) {

                dropdown.addClass("uk-dropdown-stack");

                if (dropdown.hasClass("uk-dropdown-flip")) {

                    if (!this.flipped) {
                        dropdown.removeClass("uk-dropdown-flip");
                        offset = dropdown.offset();
                        dropdown.addClass("uk-dropdown-flip");
                    }

                    setTimeout(function(){

                        if ((dropdown.offset().left-boundaryoffset) < 0 || !$this.flipped && (dropdown.outerWidth() + (offset.left-boundaryoffset)) < boundarywidth) {
                            dropdown.removeClass("uk-dropdown-flip");
                        }
                    }, 0);
                }

                this.trigger('uk.dropdown.stack', [this]);
            }

            dropdown.css("display", "");
        }

    });

    var triggerevent = UI.support.touch ? "click" : "mouseenter";

    // init code
    $(document).on(triggerevent+".dropdown.uikit", "[data-uk-dropdown]", function(e) {
        var ele = $(this);

        if (!ele.data("dropdown")) {

            var dropdown = UI.dropdown(ele, UI.Utils.options(ele.data("uk-dropdown")));

            if (triggerevent=="click" || (triggerevent=="mouseenter" && dropdown.options.mode=="hover")) {
                dropdown.show();
            }

            if(dropdown.element.find('.uk-dropdown').length) {
                e.preventDefault();
            }
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var win = $(window), event = 'resize orientationchange', grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            "target" : false,
            "row"    : true
        },

        init: function() {

            var $this = this;

            this.columns  = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            win.on(event, (function() {
                var fn = function() {
                    $this.match();
                };

                $(function() {
                    fn();
                    win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 150);
            })());

            $(document).on("uk-domready", function(e) {
                $this.columns  = $this.element.children();
                $this.elements = $this.options.target ? $this.find($this.options.target) : $this.columns;
                $this.match();
            });

            grids.push(this);
        },

        match: function() {

            this.revert();

            var firstvisible = this.columns.filter(":visible:first");

            if (!firstvisible.length) return;

            var stacked = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100 ? true : false,
                max     = 0,
                $this   = this;

            if (stacked) return;

            if(this.options.row) {

                this.element.width(); // force redraw

                setTimeout(function(){

                    var lastoffset = false, group = [];

                    $this.elements.each(function(i) {
                        var ele = $(this), offset = ele.offset().top;

                        if(offset != lastoffset && group.length) {

                            $this.matchHeights($(group));
                            group  = [];
                            offset = ele.offset().top;
                        }

                        group.push(ele);
                        lastoffset = offset;
                    });

                    if(group.length) {
                        $this.matchHeights($(group));
                    }

                }, 0);

            } else {

                this.matchHeights(this.elements);
            }

            return this;
        },

        revert: function() {
            this.elements.css('min-height', '');
            return this;
        },

        matchHeights: function(elements){

            if(elements.length < 2) return;

            var max = 0;

            elements.each(function() {
                max = Math.max(max, $(this).outerHeight());
            }).each(function(i) {

                var element = $(this),
                    height  = max - (element.outerHeight() - element.height());

                element.css('min-height', height + 'px');
            });
        }
    });

    UI.component('gridMargin', {

        defaults: {
            "cls": "uk-grid-margin"
        },

        init: function() {

            var $this = this;

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });


    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-grid-match],[data-uk-grid-margin]").each(function() {
            var grid = $(this), obj;

            if (grid.is("[data-uk-grid-match]") && !grid.data("gridMatchHeight")) {
                obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr("data-uk-grid-match")));
            }

            if (grid.is("[data-uk-grid-margin]") && !grid.data("gridMargin")) {
                obj = UI.gridMargin(grid, UI.Utils.options(grid.attr("data-uk-grid-margin")));
            }
        });
    });

    $(document).on("uk-check-display", function(e) {
        grids.forEach(function(item) {
            if(item.element.is(":visible")) item.match();
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI, $win) {

    "use strict";

    var active = false, body;

    UI.component('modal', {

        defaults: {
            keyboard: true,
            bgclose: true,
            minScrollHeight: 150
        },

        scrollable: false,
        transition: false,

        init: function() {

            if (!body) body = $('body');

            var $this = this;

            this.transition = UI.support.transition;
            this.dialog     = this.find(".uk-modal-dialog");

            this.on("click", ".uk-modal-close", function(e) {
                e.preventDefault();
                $this.hide();

            }).on("click", function(e) {

                var target = $(e.target);

                if (target[0] == $this.element[0] && $this.options.bgclose) {
                    $this.hide();
                }

            });

        },

        toggle: function() {
            return this[this.isActive() ? "hide" : "show"]();
        },

        show: function() {

            var $this = this;

            if (this.isActive()) return;
            if (active) active.hide(true);

            this.element.removeClass("uk-open").show();
            this.resize();

            active = this;
            body.addClass("uk-modal-page").height(); // force browser engine redraw

            this.element.addClass("uk-open").trigger("uk.modal.show");

            $(document).trigger("uk-check-display");

            return this;
        },

        hide: function(force) {

            if (!this.isActive()) return;

            if (!force && UI.support.transition) {

                var $this = this;

                this.one(UI.support.transition.end, function() {
                    $this._hide();
                }).removeClass("uk-open");

            } else {

                this._hide();
            }

            return this;
        },

        resize: function() {

            var paddingdir = "padding-" + (UI.langdirection == 'left' ? "right":"left");

            this.scrollbarwidth = window.innerWidth - body.width();

            body.css(paddingdir, this.scrollbarwidth);

            this.element.css(paddingdir, "");

            if (this.dialog.offset().left > this.scrollbarwidth) {
                this.element.css(paddingdir, this.scrollbarwidth - (this.element[0].scrollHeight==window.innerHeight ? 0:this.scrollbarwidth ));
            }

            this.updateScrollable();

        },

        updateScrollable: function() {

            // has scrollable?

            var scrollable = this.dialog.find('.uk-overflow-container:visible:first');

            if (scrollable) {

                scrollable.css("height", 0);

                var offset = Math.abs(parseInt(this.dialog.css("margin-top"), 10)),
                    dh     = this.dialog.outerHeight(),
                    wh     = window.innerHeight,
                    h      = wh - 2*(offset < 20 ? 20:offset) - dh;

                scrollable.css("height", h < this.options.minScrollHeight ? "":h);
            }
        },

        _hide: function() {

            this.element.hide().removeClass("uk-open");

            body.removeClass("uk-modal-page").css("padding-" + (UI.langdirection == 'left' ? "right":"left"), "");

            if(active===this) active = false;

            this.trigger("uk.modal.hide");
        },

        isActive: function() {
            return (active == this);
        }

    });

    UI.component('modalTrigger', {

        init: function() {

            var $this = this;

            this.options = $.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.modal = UI.modal(this.options.target, this.options);

            this.on("click", function(e) {
                e.preventDefault();
                $this.show();
            });

            //methods
            this.proxy(this.modal, "show hide isActive");
        }
    });

    UI.modal.dialog = function(content, options) {

        var modal = UI.modal($(UI.modal.dialog.template).appendTo("body"), options);

        modal.on("uk.modal.hide", function(){
            if (modal.persist) {
                modal.persist.appendTo(modal.persist.data("modalPersistParent"));
                modal.persist = false;
            }
            modal.element.remove();
        });

        setContent(content, modal);

        return modal;
    };

    UI.modal.dialog.template = '<div class="uk-modal"><div class="uk-modal-dialog"></div></div>';

    UI.modal.alert = function(content, options) {

        UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-primary uk-modal-close">Ok</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options)).show();
    };

    UI.modal.confirm = function(content, onconfirm, options) {

        onconfirm = $.isFunction(onconfirm) ? onconfirm : function(){};

        var modal = UI.modal.dialog(([
            '<div class="uk-margin uk-modal-content">'+String(content)+'</div>',
            '<div class="uk-modal-buttons"><button class="uk-button uk-button-primary js-modal-confirm">Ok</button> <button class="uk-button uk-modal-close">Cancel</button></div>'
        ]).join(""), $.extend({bgclose:false, keyboard:false}, options));

        modal.element.find(".js-modal-confirm").on("click", function(){
            onconfirm();
            modal.hide();
        });

        modal.show();
    };

    // init code
    $(document).on("click.modal.uikit", "[data-uk-modal]", function(e) {

        var ele = $(this);

        if(ele.is("a")) {
            e.preventDefault();
        }

        if (!ele.data("modalTrigger")) {
            var modal = UI.modalTrigger(ele, UI.Utils.options(ele.attr("data-uk-modal")));
            modal.show();
        }

    });

    // close modal on esc button
    $(document).on('keydown.modal.uikit', function (e) {

        if (active && e.keyCode === 27 && active.options.keyboard) { // ESC
            e.preventDefault();
            active.hide();
        }
    });

    $win.on("resize orientationchange", UI.Utils.debounce(function(){
        if(active) active.resize();
    }, 150));


    // helper functions
    function setContent(content, modal){

        if(!modal) return;

        if (typeof content === 'object') {

            // convert DOM object to a jQuery object
            content = content instanceof jQuery ? content : $(content);

            if(content.parent().length) {
                modal.persist = content;
                modal.persist.data("modalPersistParent", content.parent());
            }
        }else if (typeof content === 'string' || typeof content === 'number') {
                // just insert the data as innerHTML
                content = $('<div></div>').html(content);
        }else {
                // unsupported data type!
                content = $('<div></div>').html('$.UIkitt.modal Error: Unsupported data type: ' + typeof content);
        }

        content.appendTo(modal.element.find('.uk-modal-dialog'));

        return modal;
    }

})(jQuery, jQuery.UIkit, jQuery(window));

(function($, UI) {

    "use strict";

    var scrollpos = {x: window.scrollX, y: window.scrollY},
        $win      = $(window),
        $doc      = $(document),
        $html     = $('html'),
        Offcanvas = {

        show: function(element) {

            element = $(element);

            if (!element.length) return;

            var $body     = $('body'),
                winwidth  = $win.width(),
                bar       = element.find(".uk-offcanvas-bar:first"),
                rtl       = ($.UIkit.langdirection == "right"),
                flip      = bar.hasClass("uk-offcanvas-bar-flip") ? -1:1,
                dir       = flip * (rtl ? -1 : 1);

            scrollpos = {x: window.scrollX, y: window.scrollY};

            element.addClass("uk-active");

            $body.css({"width": window.innerWidth, "height": $win.height()}).addClass("uk-offcanvas-page");
            $body.css((rtl ? "margin-right" : "margin-left"), (rtl ? -1 : 1) * (bar.outerWidth() * dir)).width(); // .width() - force redraw

            $html.css('margin-top', scrollpos.y * -1);

            bar.addClass("uk-offcanvas-bar-show");

            element.off(".ukoffcanvas").on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

                var target = $(e.target);

                if (!e.type.match(/swipe/)) {

                    if (!target.hasClass("uk-offcanvas-close")) {
                        if (target.hasClass("uk-offcanvas-bar")) return;
                        if (target.parents(".uk-offcanvas-bar:first").length) return;
                    }
                }

                e.stopImmediatePropagation();
                Offcanvas.hide();
            });

            $doc.on('keydown.ukoffcanvas', function(e) {
                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },

        hide: function(force) {

            var $body = $('body'),
                panel = $(".uk-offcanvas.uk-active"),
                rtl   = ($.UIkit.langdirection == "right"),
                bar   = panel.find(".uk-offcanvas-bar:first");

            if (!panel.length) return;

            if ($.UIkit.support.transition && !force) {

                $body.one($.UIkit.support.transition.end, function() {
                    $body.removeClass("uk-offcanvas-page").css({"width": "", "height": ""});
                    panel.removeClass("uk-active");
                    $html.css('margin-top', '');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                }).css((rtl ? "margin-right" : "margin-left"), "");

                setTimeout(function(){
                    bar.removeClass("uk-offcanvas-bar-show");
                }, 0);

            } else {
                $body.removeClass("uk-offcanvas-page").css({"width": "", "height": ""});
                panel.removeClass("uk-active");
                bar.removeClass("uk-offcanvas-bar-show");
                $html.css('margin-top', '');
                window.scrollTo(scrollpos.x, scrollpos.y);
            }

            panel.off(".ukoffcanvas");
            $doc.off(".ukoffcanvas");
        }
    };

    UI.component('offcanvasTrigger', {

        init: function() {

            var $this = this;

            this.options = $.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.on("click", function(e) {
                e.preventDefault();
                Offcanvas.show($this.options.target);
            });
        }
    });

    UI.offcanvas = Offcanvas;

    // init code
    $doc.on("click.offcanvas.uikit", "[data-uk-offcanvas]", function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data("offcanvasTrigger")) {
            var obj = UI.offcanvasTrigger(ele, UI.Utils.options(ele.attr("data-uk-offcanvas")));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    UI.component('nav', {

        defaults: {
            "toggle": ">li.uk-parent > a[href='#']",
            "lists": ">li.uk-parent > ul",
            "multiple": false
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                var ele = $(this);
                $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
            });

            this.find(this.options.lists).each(function() {
                var $ele   = $(this),
                    parent = $ele.parent(),
                    active = parent.hasClass("uk-active");

                $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
                parent.data("list-container", $ele.parent());

                if (active) $this.open(parent, true);
            });

        },

        open: function(li, noanimation) {

            var element = this.element, $li = $(li);

            if (!this.options.multiple) {

                element.children(".uk-open").not(li).each(function() {
                    if ($(this).data("list-container")) {
                        $(this).data("list-container").stop().animate({height: 0}, function() {
                            $(this).parent().removeClass("uk-open");
                        });
                    }
                });
            }

            $li.toggleClass("uk-open");

            if ($li.data("list-container")) {
                if (noanimation) {
                    $li.data('list-container').stop().height($li.hasClass("uk-open") ? "auto" : 0);
                } else {
                    $li.data('list-container').stop().animate({
                        height: ($li.hasClass("uk-open") ? getHeight($li.data('list-container').find('ul:first')) : 0)
                    });
                }
            }
        }
    });


    // helper

    function getHeight(ele) {
        var $ele = $(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {
            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-nav]").each(function() {
            var nav = $(this);

            if (!nav.data("nav")) {
                var obj = UI.nav(nav, UI.Utils.options(nav.attr("data-uk-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI, $win) {

    "use strict";

    var $tooltip,   // tooltip container
        tooltipdelay;

    UI.component('tooltip', {

        defaults: {
            "offset": 5,
            "pos": "top",
            "animation": false,
            "delay": 0, // in miliseconds
            "src": function() { return this.attr("title"); }
        },

        tip: "",

        init: function() {

            var $this = this;

            if (!$tooltip) {
                $tooltip = $('<div class="uk-tooltip"></div>').appendTo("body");
            }

            this.on({
                "focus"     : function(e) { $this.show(); },
                "blur"      : function(e) { $this.hide(); },
                "mouseenter": function(e) { $this.show(); },
                "mouseleave": function(e) { $this.hide(); }
            });

            this.tip = typeof(this.options.src) === "function" ? this.options.src.call(this.element) : this.options.src;

            // disable title attribute
            this.element.attr("data-cached-title", this.element.attr("title")).attr("title", "");
        },

        show: function() {

            if (tooltipdelay)     clearTimeout(tooltipdelay);
            if (!this.tip.length) return;

            $tooltip.stop().css({"top": -2000, "visibility": "hidden"}).show();
            $tooltip.html('<div class="uk-tooltip-inner">' + this.tip + '</div>');

            var $this      = this,
                bodyoffset = $('body').offset(),
                pos        = $.extend({}, this.element.offset(), {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight}),
                width      = $tooltip[0].offsetWidth,
                height     = $tooltip[0].offsetHeight,
                offset     = typeof(this.options.offset) === "function" ? this.options.offset.call(this.element) : this.options.offset,
                position   = typeof(this.options.pos) === "function" ? this.options.pos.call(this.element) : this.options.pos,
                tmppos     = position.split("-"),
                tcss       = {
                    "display": "none",
                    "visibility": "visible",
                    "top": (pos.top + pos.height + height),
                    "left": pos.left
                };

            // prevent strange position
            // when tooltip is in offcanvas etc.
            pos.left -= bodyoffset.left;
            pos.top  -= bodyoffset.top;

            if ((tmppos[0] == "left" || tmppos[0] == "right") && $.UIkit.langdirection == 'right') {
                tmppos[0] = tmppos[0] == "left" ? "right" : "left";
            }

            var variants =  {
                "bottom"  : {top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - width / 2},
                "top"     : {top: pos.top - height - offset, left: pos.left + pos.width / 2 - width / 2},
                "left"    : {top: pos.top + pos.height / 2 - height / 2, left: pos.left - width - offset},
                "right"   : {top: pos.top + pos.height / 2 - height / 2, left: pos.left + pos.width + offset}
            };

            $.extend(tcss, variants[tmppos[0]]);

            if (tmppos.length == 2) tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);

            var boundary = this.checkBoundary(tcss.left, tcss.top, width, height);

            if(boundary) {

                switch(boundary) {
                    case "x":

                        if (tmppos.length == 2) {
                            position = tmppos[0]+"-"+(tcss.left < 0 ? "left": "right");
                        } else {
                            position = tcss.left < 0 ? "right": "left";
                        }

                        break;

                    case "y":
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? "bottom": "top")+"-"+tmppos[1];
                        } else {
                            position = (tcss.top < 0 ? "bottom": "top");
                        }

                        break;

                    case "xy":
                        if (tmppos.length == 2) {
                            position = (tcss.top < 0 ? "bottom": "top")+"-"+(tcss.left < 0 ? "left": "right");
                        } else {
                            position = tcss.left < 0 ? "right": "left";
                        }

                        break;

                }

                tmppos = position.split("-");

                $.extend(tcss, variants[tmppos[0]]);

                if (tmppos.length == 2) tcss.left = (tmppos[1] == 'left') ? (pos.left) : ((pos.left + pos.width) - width);
            }


            tcss.left -= $("body").position().left;

            tooltipdelay = setTimeout(function(){

                $tooltip.css(tcss).attr("class", "uk-tooltip uk-tooltip-" + position);

                if ($this.options.animation) {
                    $tooltip.css({opacity: 0, display: 'block'}).animate({opacity: 1}, parseInt($this.options.animation, 10) || 400);
                } else {
                    $tooltip.show();
                }

                tooltipdelay = false;
            }, parseInt(this.options.delay, 10) || 0);
        },

        hide: function() {
            if(this.element.is("input") && this.element[0]===document.activeElement) return;

            if(tooltipdelay) clearTimeout(tooltipdelay);

            $tooltip.stop();

            if (this.options.animation) {
                $tooltip.fadeOut(parseInt(this.options.animation, 10) || 400);
            } else {
                $tooltip.hide();
            }
        },

        content: function() {
            return this.tip;
        },

        checkBoundary: function(left, top, width, height) {

            var axis = "";

            if(left < 0 || ((left-$win.scrollLeft())+width) > window.innerWidth) {
               axis += "x";
            }

            if(top < 0 || ((top-$win.scrollTop())+height) > window.innerHeight) {
               axis += "y";
            }

            return axis;
        }
    });


    // init code
    $(document).on("mouseenter.tooltip.uikit focus.tooltip.uikit", "[data-uk-tooltip]", function(e) {
        var ele = $(this);

        if (!ele.data("tooltip")) {
            var obj = UI.tooltip(ele, UI.Utils.options(ele.attr("data-uk-tooltip")));
            ele.trigger("mouseenter");
        }
    });

})(jQuery, jQuery.UIkit, jQuery(window));

(function($, UI) {

    "use strict";

    UI.component('switcher', {

        defaults: {
            connect : false,
            toggle  : ">*",
            active  : 0
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                if ($(this).is('a[href="#"]')) e.preventDefault();
                $this.show(this);
            });

            if (this.options.connect) {

                this.connect = $(this.options.connect).find(".uk-active").removeClass(".uk-active").end();

                var toggles = this.find(this.options.toggle),
                    active   = toggles.filter(".uk-active");

                if (active.length) {
                    this.show(active);
                } else {
                    active = toggles.eq(this.options.active);
                    this.show(active.length ? active : toggles.eq(0));
                }
            }

        },

        show: function(tab) {

            tab = isNaN(tab) ? $(tab) : this.find(this.options.toggle).eq(tab);

            var active = tab;

            if (active.hasClass("uk-disabled")) return;

            this.find(this.options.toggle).filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                var index = this.find(this.options.toggle).index(active);

                this.connect.children().removeClass("uk-active").eq(index).addClass("uk-active");
            }

            this.trigger("uk.switcher.show", [active]);
            $(document).trigger("uk-check-display");
        }
    });


    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-switcher]").each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-uk-switcher")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";


    UI.component('tab', {

        defaults: {
            connect: false,
            active: 0
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {
                e.preventDefault();
                $this.find($this.options.target).not(this).removeClass("uk-active").blur();
                $this.trigger("change", [$(this).addClass("uk-active")]);
            });


            if (this.options.connect) {
                this.connect = $(this.options.connect);
            }

            if (location.hash && location.hash.match(/^#[a-z0-9_-]+$/)) {
                var active = this.element.children().filter(window.location.hash);

                if (active.length) {
                    this.element.children().removeClass('uk-active').filter(active).addClass("uk-active");
                }
            }

            var mobiletab = $('<li class="uk-tab-responsive uk-active"><a href="javascript:void(0);"></a></li>'),
                caption   = mobiletab.find("a:first"),
                dropdown  = $('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>'),
                ul        = dropdown.find("ul");

            caption.html(this.find("li.uk-active:first").find("a").text());

            if (this.element.hasClass("uk-tab-bottom")) dropdown.addClass("uk-dropdown-up");
            if (this.element.hasClass("uk-tab-flip")) dropdown.addClass("uk-dropdown-flip");

            this.find("a").each(function(i) {

                var tab  = $(this).parent(),
                    item = $('<li><a href="javascript:void(0);">' + tab.text() + '</a></li>').on("click", function(e) {
                        $this.element.data("switcher").show(i);
                    });

                if (!$(this).parents(".uk-disabled:first").length) ul.append(item);
            });

            this.element.uk("switcher", {"toggle": ">li:not(.uk-tab-responsive)", "connect": this.options.connect, "active": this.options.active});

            mobiletab.append(dropdown).uk("dropdown", {"mode": "click"});

            this.element.append(mobiletab).data({
                "dropdown": mobiletab.data("dropdown"),
                "mobilecaption": caption
            }).on("uk.switcher.show", function(e, tab) {
                mobiletab.addClass("uk-active");
                caption.html(tab.find("a").text());
            });

        }
    });

    $(document).on("uk-domready", function(e) {

        $("[data-uk-tab]").each(function() {
            var tab = $(this);

            if (!tab.data("tab")) {
                var obj = UI.tab(tab, UI.Utils.options(tab.attr("data-uk-tab")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    var $win           = $(window),
        $doc           = $(document),
        scrollspies    = [],
        checkScrollSpy = function() {
            for(var i=0; i < scrollspies.length; i++) {
                UI.support.requestAnimationFrame.apply(window, [scrollspies[i].check]);
            }
        };

    UI.component('scrollspy', {

        defaults: {
            "cls"        : "uk-scrollspy-inview",
            "initcls"    : "uk-scrollspy-init-inview",
            "topoffset"  : 0,
            "leftoffset" : 0,
            "repeat"     : false,
            "delay"      : 0
        },

        init: function() {

            var $this = this, idle, inviewstate, initinview,
                fn = function(){

                    var inview = UI.Utils.isInView($this.element, $this.options);

                    if(inview && !inviewstate) {

                        if(idle) clearTimeout(idle);

                        if(!initinview) {
                            $this.element.addClass($this.options.initcls);
                            $this.offset = $this.element.offset();
                            initinview = true;

                            $this.trigger("uk.scrollspy.init");
                        }

                        idle = setTimeout(function(){

                            if(inview) {
                                $this.element.addClass("uk-scrollspy-inview").addClass($this.options.cls).width();
                            }
                        }, $this.options.delay);

                        inviewstate = true;
                        $this.trigger("uk.scrollspy.inview");
                    }

                    if (!inview && inviewstate && $this.options.repeat) {
                        $this.element.removeClass("uk-scrollspy-inview").removeClass($this.options.cls);
                        inviewstate = false;

                        $this.trigger("uk.scrollspy.outview");
                    }
                };

            fn();

            this.check = fn;
            scrollspies.push(this);
        }
    });


    var scrollspynavs = [],
        checkScrollSpyNavs = function() {
            for(var i=0; i < scrollspynavs.length; i++) {
                UI.support.requestAnimationFrame.apply(window, [scrollspynavs[i].check]);
            }
        };

    UI.component('scrollspynav', {

        defaults: {
            "cls"          : 'uk-active',
            "closest"      : false,
            "topoffset"    : 0,
            "leftoffset"   : 0,
            "smoothscroll" : false
        },

        init: function() {

            var ids     = [],
                links   = this.find("a[href^='#']").each(function(){ ids.push($(this).attr("href")); }),
                targets = $(ids.join(","));

            var $this = this, inviews, fn = function(){

                inviews = [];

                for(var i=0 ; i < targets.length ; i++) {
                    if(UI.Utils.isInView(targets.eq(i), $this.options)) {
                        inviews.push(targets.eq(i));
                    }
                }

                if(inviews.length) {

                    var scrollTop = $win.scrollTop(),
                        target = (function(){
                            for(var i=0; i< inviews.length;i++){
                                if(inviews[i].offset().top >= scrollTop){
                                    return inviews[i];
                                }
                            }
                        })();

                    if(!target) return;

                    if($this.options.closest) {
                        links.closest($this.options.closest).removeClass($this.options.cls).end().filter("a[href='#"+target.attr("id")+"']").closest($this.options.closest).addClass($this.options.cls);
                    } else {
                        links.removeClass($this.options.cls).filter("a[href='#"+target.attr("id")+"']").addClass($this.options.cls);
                    }
                }
            };

            if(this.options.smoothscroll && UI["smoothScroll"]) {
                links.each(function(){
                    UI.smoothScroll(this, $this.options.smoothscroll);
                });
            }

            fn();

            this.element.data("scrollspynav", this);

            this.check = fn;
            scrollspynavs.push(this);

        }
    });


    var fnCheck = function(){
        checkScrollSpy();
        checkScrollSpyNavs();
    };

    // listen to scroll and resize
    $doc.on("uk-scroll", fnCheck);
    $win.on("resize orientationchange", UI.Utils.debounce(fnCheck, 50));

    // init code
    $doc.on("uk-domready", function(e) {
        $("[data-uk-scrollspy]").each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                var obj = UI.scrollspy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
            }
        });

        $("[data-uk-scrollspy-nav]").each(function() {

            var element = $(this);

            if (!element.data("scrollspynav")) {
                var obj = UI.scrollspynav(element, UI.Utils.options(element.attr("data-uk-scrollspy-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);

(function($, UI) {

    "use strict";

    UI.component('smoothScroll', {

        defaults: {
            duration: 1000,
            transition: 'easeOutExpo',
            offset: 0
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                // get / set parameters
                var ele       = ($(this.hash).length ? $(this.hash) : $("body")),
                    target    = ele.offset().top - $this.options.offset,
                    docheight = $(document).height(),
                    winheight = $(window).height(),
                    eleheight = ele.outerHeight();

                if ((target + winheight) > docheight) {
                    target = docheight - winheight;
                }

                // animate to target and set the hash to the window.location after the animation
                $("html,body").stop().animate({scrollTop: target}, $this.options.duration, $this.options.transition);

                // cancel default click action
                return false;
            });

        }
    });

    if (!$.easing['easeOutExpo']) {
        $.easing['easeOutExpo'] = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }

    // init code
    $(document).on("click.smooth-scroll.uikit", "[data-uk-smooth-scroll]", function(e) {
        var ele = $(this);

        if (!ele.data("smoothScroll")) {
            var obj = UI.smoothScroll(ele, UI.Utils.options(ele.attr("data-uk-smooth-scroll")));
            ele.trigger("click");
        }

        return false;
    });

})(jQuery, jQuery.UIkit);


(function(global, $, UI){


    UI.component('toggle', {

        defaults: {
            target: false,
            cls: 'uk-hidden'
        },

        init: function() {

            var $this = this;

            this.totoggle = this.options.target ? $(this.options.target):[];

            this.on("click", function(e) {
                if ($this.element.is('a[href="#"]')) e.preventDefault();
                $this.toggle();
            });
        },

        toggle: function() {

            if(!this.totoggle.length) return;

            this.totoggle.toggleClass(this.options.cls);

            if(this.options.cls == 'uk-hidden') {
                $(document).trigger("uk-check-display");
            }
        }
    });

    $(document).on("uk-domready", function(e) {

        $("[data-uk-toggle]").each(function() {
            var ele = $(this);

            if (!ele.data("toggle")) {
               var obj = UI.toggle(ele, UI.Utils.options(ele.attr("data-uk-toggle")));
            }
        });
    });

})(this, jQuery, jQuery.UIkit);