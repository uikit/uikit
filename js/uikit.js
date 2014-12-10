/*! UIkit 2.14.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(core) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit", function(){

            var uikit = core(window, window.jQuery, window.document);

            uikit.load = function(res, req, onload, config) {

                var resources = res.split(','), load = [], i, base = (config.config && config.config.uikit && config.config.uikit.base ? config.config.uikit.base : "").replace(/\/+$/g, "");

                if (!base) {
                    throw new Error( "Please define base path to UIkit in the requirejs config." );
                }

                for (i = 0; i < resources.length; i += 1) {
                    var resource = resources[i].replace(/\./g, '/');
                    load.push(base+'/components/'+resource);
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

    var UI = {}, _UI = window.UIkit;

    UI.version = '2.14.0';
    UI._prefix = 'uk';

    UI.noConflict = function(prefix) {
        // resore UIkit version
        if (_UI) {
            window.UIkit = _UI;
            $.UIkit      = _UI;
            $.fn.uk      = _UI.fn;
        }
        if (prefix) {} UI._prefix = prefix;
        return UI;
    };

    UI.prefix = function(str) {
        return typeof(str)=='string' ? str.replace(/@/g, UI._prefix) : str;
    };

    // wrap jQuery to auto prefix string arguments
    UI.$ = function() {

        if (arguments[0] && typeof(arguments[0])=='string') {
            arguments[0] = UI.prefix(arguments[0]);
        }

        var obj = $.apply($, arguments), i;

        if (!obj.length) {
            return obj;
        }

        [
            'find', 'filter', 'closest',
            'attr', 'parent', 'parents', 'children',
            'addClass', 'removeClass', 'toggleClass', 'hasClass',
            'is',
            'on', 'one'
        ].forEach(function(m){

            var method = obj[m], result, collections = ['find','filter','parent', 'parents', 'children', 'closest'];

            obj[m] = function() {

                for (i=0;i<arguments.length;i++) {

                    if (typeof(arguments[i])=='string') {
                        arguments[i] = UI.prefix(arguments[i]);
                    }
                }

                result = method.apply(this, arguments);

                return (collections.indexOf(m) > -1) ? UI.$(result) : result;
            };
            return obj;
        });

        return obj;
    };

    UI.$doc  = UI.$(document);
    UI.$win  = UI.$(window);
    UI.$html = UI.$('html');

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
                    WebkitTransition : 'webkitTransitionEnd',
                    MozTransition    : 'transitionend',
                    OTransition      : 'oTransitionEnd otransitionend',
                    transition       : 'transitionend'
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
                    WebkitAnimation : 'webkitAnimationEnd',
                    MozAnimation    : 'animationend',
                    OAnimation      : 'oAnimationEnd oanimationend',
                    animation       : 'animationend'
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
        (global.navigator.msPointerEnabled && global.navigator.msMaxTouchPoints > 0) || //IE 10
        (global.navigator.pointerEnabled && global.navigator.maxTouchPoints > 0) || //IE >=11
        false
    );
    UI.support.mutationobserver = (global.MutationObserver || global.WebKitMutationObserver || null);

    UI.Utils = {};

    UI.Utils.str2json = function(str) {
        return str
        // wrap keys without quote with valid double quote
        .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
        // replacing single quote wrapped ones to double quote
        .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';});

        /* old method:
            try {
                return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            } catch(e) { return false; }
        */
    };

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

        var window_left = UI.$win.scrollLeft(), window_top = UI.$win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + UI.$win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + UI.$win.width()) {
          return true;
        } else {
          return false;
        }
    };

    UI.Utils.checkDisplay = function(context, initanimation) {

        var elements = UI.$('[data-@-margin], [data-@-grid-match], [data-@-grid-margin], [data-@-check-display]', context || document), animated;

        if (context && !elements.length) {
            elements = $(context);
        }

        elements.trigger('display.uk.check');

        // fix firefox / IE animations
        if (initanimation) {

            if (typeof(initanimation)!='string') {
                initanimation = UI.prefix('[class*="@-animation-"]');
            }

            elements.find(initanimation).each(function(){

                var ele  = UI.$(this),
                    cls  = ele.attr('class'),
                    anim = cls.match(/uk\-animation\-(.+)/);

                ele.removeClass(anim[0]).width();

                ele.addClass(anim[0]);
            });
        }

        return elements;
    };

    UI.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = JSON.parse(UI.Utils.str2json(string.substr(start)));
            } catch (e) {}
        }

        return options;
    };

    UI.Utils.animate = function(element, cls) {

        var d = $.Deferred();

        element = UI.$(element);
        cls     = UI.prefix(cls);

        element.css('display', 'none').addClass(cls).one(UI.support.animation.end, function() {
            element.removeClass(cls);
            d.resolve();
        }).width();

        element.css('display', '');

        return d.promise();
    };

    UI.Utils.uid = function(prefix) {
        return (prefix || 'id') + (new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
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

        fn  = new Function('$data', [
            'var __ret = [];',
            'try {',
            'with($data){', (!openblocks ? output.join('') : '__ret = ["Not all blocks are closed correctly."]'), '};',
            '}catch(e){__ret = [e.message];}',
            'return __ret.join("").replace(/\\n\\n/g, "\\n");',
            "function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"
        ].join("\n"));

        return data ? fn(data) : fn;
    };

    UI.Utils.events       = {};
    UI.Utils.events.click = UI.support.touch ? 'tap' : 'click';

    window.UIkit = UI;
    $.UIkit      = UI;
    $.fn.uk      = UI.fn;

    UI.langdirection = UI.$html.attr("dir") == "rtl" ? "right" : "left";

    UI.components = {};

    UI.component = function(name, def) {

        var fn = function(element, options) {

            var $this = this;

            this.UIkit   = UI;
            this.element = element ? UI.$(element) : null;
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

            this.trigger('init.uk.component', [name, this]);

            return this;
        };

        fn.plugins = {};

        $.extend(true, fn.prototype, {

            defaults : {plugins: []},

            boot: function(){},
            init: function(){},

            on: function(a1,a2,a3){
                return UI.$(this.element || this).on(a1,a2,a3);
            },

            one: function(a1,a2,a3){
                return UI.$(this.element || this).one(a1,a2,a3);
            },

            off: function(evt){
                return UI.$(this.element || this).off(evt);
            },

            trigger: function(evt, params) {
                return UI.$(this.element || this).trigger(evt, params);
            },

            find: function(selector) {
                return UI.$(this.element ? this.element: []).find(selector);
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
            }

        }, def);

        this.components[name] = fn;

        this[name] = function() {

            var element, options;

            if (arguments.length) {

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

        if (UI.domready) {
            UI.component.boot(name);
        }

        return fn;
    };

    UI.plugin = function(component, name, def) {
        this.components[component].plugins[name] = def;
    };

    UI.component.boot = function(name) {

        if (UI.components[name].prototype && UI.components[name].prototype.boot && !UI.components[name].booted) {
            UI.components[name].prototype.boot.apply(UI, []);
            UI.components[name].booted = true;
        }
    };

    UI.component.bootComponents = function() {

        for (var component in UI.components) {
            UI.component.boot(component);
        }
    };


    // DOM mutation save ready helper function

    UI.domObservers = [];
    UI.domready     = false;

    UI.ready = function(fn) {

        UI.domObservers.push(fn);

        if (UI.domready) {
            fn(document);
        }
    };

    UI.on = function(a1,a2,a3){

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply(UI.$doc);
        }

        return UI.$doc.on(a1,a2,a3);
    };

    UI.one = function(a1,a2,a3){

        if (a1 && a1.indexOf('ready.uk.dom') > -1 && UI.domready) {
            a2.apply(UI.$doc);
            return UI.$doc;
        }

        return UI.$doc.one(a1,a2,a3);
    };

    UI.trigger = function(evt, params) {
        return UI.$doc.trigger(evt, params);
    };

    UI.domObserve = function(selector, fn) {

        if(!UI.support.mutationobserver) return;

        fn = fn || function() {};

        UI.$(selector).each(function() {

            var element  = this,
                $element = UI.$(element);

            if ($element.data('observer')) {
                return;
            }

            try {

                var observer = new UI.support.mutationobserver(UI.Utils.debounce(function(mutations) {
                    fn.apply(element, []);
                    $element.trigger('changed.uk.dom');
                }, 50));

                // pass in the target node, as well as the observer options
                observer.observe(element, { childList: true, subtree: true });

                $element.data('observer', observer);

            } catch(e) {}
        });
    };


    $(function(){

        UI.$body = UI.$('body');

        UI.ready(function(context){
            UI.domObserve('[data-@-observe]');
        });

        UI.on('ready.uk.dom', function(){

            UI.domObservers.forEach(function(fn){
                fn(document);
            });

            if (UI.domready) UI.Utils.checkDisplay(document);
        });


        UI.on('changed.uk.dom', function(e) {

            var ele = e.target;

            UI.domObservers.forEach(function(fn){
                fn(ele);
            });

            UI.Utils.checkDisplay(ele);
        });

        UI.trigger('beforeready.uk.dom');

        UI.component.bootComponents();

        // custom scroll observer
        setInterval((function(){

            var memory = {x: window.pageXOffset, y:window.pageYOffset}, dir;

            var fn = function(){

                if (memory.x != window.pageXOffset || memory.y != window.pageYOffset) {

                    dir = {x: 0 , y: 0};

                    if (window.pageXOffset != memory.x) dir.x = window.pageXOffset > memory.x ? 1:-1;
                    if (window.pageYOffset != memory.y) dir.y = window.pageYOffset > memory.y ? 1:-1;

                    memory = {
                        "dir": dir, "x": window.pageXOffset, "y": window.pageYOffset
                    };

                    UI.$doc.trigger('scrolling.uk.document', [memory]);
                }
            };

            if (UI.support.touch) {
                UI.$html.on('touchmove touchend MSPointerMove MSPointerUp pointermove pointerup', fn);
            }

            if (memory.x || memory.y) fn();

            return fn;

        })(), 15);

        // run component init functions on dom
        UI.trigger('ready.uk.dom');

        if (UI.support.touch) {

            // remove css hover rules for touch devices
            // UI.Utils.removeCssRules(/\.uk-(?!navbar).*:hover/);

            // viewport unit fix for uk-height-viewport - should be fixed in iOS 8
            if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

                UI.$win.on('load orientationchange resize', UI.Utils.debounce((function(){

                    var fn = function() {
                        $(UI.prefix('.@-height-viewport')).css('height', window.innerHeight);
                        return fn;
                    };

                    return fn();

                })(), 100));
            }
        }

        UI.trigger('afterready.uk.dom');

        // mark that domready is left behind
        UI.domready = true;
    });

    // add touch identifier class
    UI.$html.addClass(UI.support.touch ? "@-touch" : "@-notouch");

    // add uk-hover class on tap to support overlays on touch devices
    if (UI.support.touch) {

        var hoverset = false, exclude, selector = '.@-overlay, .@-overlay-toggle, .@-caption-toggle, .@-animation-hover, .@-has-hover';

        UI.$html.on('touchstart MSPointerDown pointerdown', selector, function() {

            if (hoverset) UI.$('.@-hover').removeClass('@-hover');

            hoverset = UI.$(this).addClass('@-hover');

        }).on('touchend MSPointerUp pointerup', function(e) {

            exclude = UI.$(e.target).parents(selector);

            if (hoverset) hoverset.not(exclude).removeClass('@-hover');
        });
    }

    return UI;
});

//  Based on Zeptos touch.js
//  https://raw.github.com/madrobby/zepto/master/src/touch.js
//  Zepto.js may be freely distributed under the MIT license.

;(function($){

  if ($.fn.swipeLeft) {
    return;
  }


  var touch = {}, touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, longTapDelay = 750, gesture;

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
      .on('MSGestureEnd gestureend', function(e){

        var swipeDirectionFromVelocity = e.originalEvent.velocityX > 1 ? 'Right' : e.originalEvent.velocityX < -1 ? 'Left' : e.originalEvent.velocityY > 1 ? 'Down' : e.originalEvent.velocityY < -1 ? 'Up' : null;

        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe');
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity);
        }
      })
      // MSPointerDown: for IE10
      // pointerdown: for IE11
      .on('touchstart MSPointerDown pointerdown', function(e){

        if(e.type == 'MSPointerDown' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = (e.type == 'MSPointerDown' || e.type == 'pointerdown') ? e : e.originalEvent.touches[0];

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
        if (gesture && ( e.type == 'MSPointerDown' || e.type == 'pointerdown' || e.type == 'touchstart' ) ) {
          gesture.addPointer(e.originalEvent.pointerId);
        }

      })
      // MSPointerMove: for IE10
      // pointermove: for IE11
      .on('touchmove MSPointerMove pointermove', function(e){

        if (e.type == 'MSPointerMove' && !isPrimaryTouch(e.originalEvent)) return;

        firstTouch = (e.type == 'MSPointerMove' || e.type == 'pointermove') ? e : e.originalEvent.touches[0];

        cancelLongTap();
        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
      })
      // MSPointerUp: for IE10
      // pointerup: for IE11
      .on('touchend MSPointerUp pointerup', function(e){

        if (e.type == 'MSPointerUp' && !isPrimaryTouch(e.originalEvent)) return;

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

    var stacks = [];

    UI.component('stackMargin', {

        defaults: {
            'cls': '@-margin-small-top'
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-margin]", context).each(function() {

                    var ele = UI.$(this), obj;

                    if (!ele.data("stackMargin")) {
                        obj = UI.stackMargin(ele, UI.Utils.options(ele.attr("data-@-margin")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns = this.element.children();

            if (!this.columns.length) return;

            UI.$win.on('resize orientationchange', (function() {

                var fn = function() {
                    $this.process();
                };

                $(function() {
                    fn();
                    UI.$win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 20);
            })());

            UI.$html.on("changed.uk.dom", function(e) {
                $this.columns  = $this.element.children();
                $this.process();
            });

            this.on("display.uk.check", function(e) {
                $this.columns = $this.element.children();
                if(this.element.is(":visible")) this.process();
            }.bind(this));

            stacks.push(this);
        },

        process: function() {

            var $this = this;

            this.revert();

            var skip         = false,
                firstvisible = this.columns.filter(":visible:first"),
                offset       = firstvisible.length ? (firstvisible.position().top + firstvisible.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

            if (offset === false) return;

            this.columns.each(function() {

                var column = UI.$(this);

                if (column.is(":visible")) {

                    if (skip) {
                        column.addClass($this.options.cls);
                    } else {

                        if (column.position().top >= offset) {
                            skip = column.addClass($this.options.cls);
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

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    UI.component('smoothScroll', {

        boot: function() {

            // init code
            UI.$html.on("click.smooth-scroll.uikit", "[data-@-smooth-scroll]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("smoothScroll")) {
                    var obj = UI.smoothScroll(ele, UI.Utils.options(ele.attr("data-@-smooth-scroll")));
                    ele.trigger("click");
                }

                return false;
            });
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {
                e.preventDefault();
                scrollToElement(UI.$(this.hash).length ? UI.$(this.hash) : UI.$("body"), $this.options);
            });
        }
    });

    function scrollToElement(ele, options) {

        options = $.extend({
            duration: 1000,
            transition: 'easeOutExpo',
            offset: 0,
            complete: function(){}
        }, options);

        // get / set parameters
        var target    = ele.offset().top - options.offset,
            docheight = UI.$doc.height(),
            winheight = window.innerHeight;

        if ((target + winheight) > docheight) {
            target = docheight - winheight;
        }

        // animate to target, fire callback when done
        UI.$("html,body").stop().animate({scrollTop: target}, options.duration, options.transition).promise().done(options.complete);
    }

    UI.Utils.scrollToElement = scrollToElement;

    if (!$.easing.easeOutExpo) {
        $.easing.easeOutExpo = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var $win           = UI.$win,
        $doc           = UI.$doc,
        scrollspies    = [],
        checkScrollSpy = function() {
            for(var i=0; i < scrollspies.length; i++) {
                UI.support.requestAnimationFrame.apply(window, [scrollspies[i].check]);
            }
        };

    UI.component('scrollspy', {

        defaults: {
            "cls"        : "@-scrollspy-inview",
            "initcls"    : "@-scrollspy-init-inview",
            "topoffset"  : 0,
            "leftoffset" : 0,
            "repeat"     : false,
            "delay"      : 0
        },

        boot: function() {

            // listen to scroll and resize
            $doc.on("scrolling.uk.document", checkScrollSpy);
            $win.on("resize orientationchange", UI.Utils.debounce(checkScrollSpy, 50));

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-scrollspy]", context).each(function() {

                    var element = UI.$(this);

                    if (!element.data("scrollspy")) {
                        var obj = UI.scrollspy(element, UI.Utils.options(element.attr("data-@-scrollspy")));
                    }
                });
            });
        },

        init: function() {


            var $this = this, idle, inviewstate, initinview,
                fn = function(){

                    var inview = UI.Utils.isInView($this.element, $this.options);

                    if (inview && !inviewstate) {

                        if(idle) clearTimeout(idle);

                        if(!initinview) {
                            $this.element.addClass($this.options.initcls);
                            $this.offset = $this.element.offset();
                            initinview = true;

                            $this.trigger("init.uk.scrollspy");
                        }

                        idle = setTimeout(function(){

                            if(inview) {
                                $this.element.addClass("@-scrollspy-inview").addClass($this.options.cls).width();
                            }
                        }, $this.options.delay);

                        inviewstate = true;
                        $this.trigger("inview.uk.scrollspy");
                    }

                    if (!inview && inviewstate && $this.options.repeat) {
                        $this.element.removeClass("@-scrollspy-inview").removeClass($this.options.cls);
                        inviewstate = false;

                        $this.trigger("outview.uk.scrollspy");
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
            "cls"          : '@-active',
            "closest"      : false,
            "topoffset"    : 0,
            "leftoffset"   : 0,
            "smoothscroll" : false
        },

        boot: function() {

            // listen to scroll and resize
            $doc.on("scrolling.uk.document", checkScrollSpyNavs);
            $win.on("resize orientationchange", UI.Utils.debounce(checkScrollSpyNavs, 50));

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-scrollspy-nav]", context).each(function() {

                    var element = UI.$(this);

                    if (!element.data("scrollspynav")) {
                        var obj = UI.scrollspynav(element, UI.Utils.options(element.attr("data-@-scrollspy-nav")));
                    }
                });
            });
        },

        init: function() {

            var ids     = [],
                links   = this.find("a[href^='#']").each(function(){ ids.push($(this).attr("href")); }),
                targets = $(ids.join(",")),

                clsActive  = UI.prefix(this.options.cls),
                clsClosest = UI.prefix(this.options.closest || this.options.closest);

            var $this = this, inviews, fn = function(){

                inviews = [];

                for (var i=0 ; i < targets.length ; i++) {
                    if (UI.Utils.isInView(targets.eq(i), $this.options)) {
                        inviews.push(targets.eq(i));
                    }
                }

                if (inviews.length) {

                    var navitems,
                        scrollTop = $win.scrollTop(),
                        target = (function(){
                            for(var i=0; i< inviews.length;i++){
                                if(inviews[i].offset().top >= scrollTop){
                                    return inviews[i];
                                }
                            }
                        })();

                    if (!target) return;

                    if ($this.options.closest) {
                        links.closest(clsClosest).removeClass(clsActive);
                        navitems = links.filter("a[href='#"+target.attr("id")+"']").closest(clsClosest).addClass(clsActive);
                    } else {
                        navitems = links.removeClass(clsActive).filter("a[href='#"+target.attr("id")+"']").addClass(clsActive);
                    }

                    $this.element.trigger("inview.uk.scrollspynav", [target, navitems]);
                }
            };

            if (this.options.smoothscroll && UI.smoothScroll) {
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

})(jQuery, UIkit);

(function(global, $, UI){

    "use strict";

    var togglers = [];

    UI.component('toggle', {

        defaults: {
            target    : false,
            cls       : '@-hidden',
            animation : false,
            duration  : 200
        },

        boot: function(){

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-toggle]", context).each(function() {
                    var ele = UI.$(this);

                    if (!ele.data("toggle")) {
                        var obj = UI.toggle(ele, UI.Utils.options(ele.attr("data-@-toggle")));
                    }
                });

                setTimeout(function(){

                    togglers.forEach(function(toggler){
                        toggler.getTogglers();
                    });

                }, 0);
            });
        },

        init: function() {

            var $this = this;

            this.getTogglers();

            this.on("click", function(e) {
                if ($this.element.is('a[href="#"]')) e.preventDefault();
                $this.toggle();
            });

            togglers.push(this);
        },

        toggle: function() {

            if(!this.totoggle.length) return;

            if (this.options.animation) {

                var $this = this, animations = UI.prefix(this.options.animation).split(',');

                if (animations.length == 1) {
                    animations[1] = animations[0];
                }

                animations[0] = animations[0].trim();
                animations[1] = animations[1].trim();

                this.totoggle.css('animation-duration', this.options.duration+'ms');

                if (this.totoggle.hasClass(this.options.cls)) {

                    this.totoggle.toggleClass(this.options.cls);

                    this.totoggle.each(function(){
                        UI.Utils.animate(this, animations[0]).then(function(){
                            $(this).css('animation-duration', '');
                            UI.Utils.checkDisplay(this);
                        });
                    });

                } else {

                    this.totoggle.each(function(){
                        UI.Utils.animate(this, animations[1]+' @-animation-reverse').then(function(){
                            UI.$(this).toggleClass($this.options.cls).css('animation-duration', '');
                            UI.Utils.checkDisplay(this);
                        }.bind(this));
                    });
                }

            } else {
                this.totoggle.toggleClass(this.options.cls);
                UI.Utils.checkDisplay(this.totoggle);
            }
        },

        getTogglers: function() {
            this.totoggle = this.options.target ? UI.$(this.options.target):[];
        }
    });

})(this, jQuery, UIkit);

(function($, UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            "fade": true,
            "duration": 200,
            "trigger": ".@-alert-close"
        },

        boot: function() {

            // init code
            UI.$html.on("click.alert.uikit", "[data-@-alert]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("alert")) {

                    var alert = UI.alert(ele, UI.Utils.options(ele.attr("data-@-alert")));

                    if (UI.$(e.target).is(alert.options.trigger)) {
                        e.preventDefault();
                        alert.close();
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.trigger, function(e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function() {

            var element       = this.trigger("close.uk.alert"),
                removeElement = function () {
                    this.trigger("closed.uk.alert").remove();
                }.bind(this);

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height"         : 0,
                    "opacity"        : 0,
                    "padding-top"    : 0,
                    "padding-bottom" : 0,
                    "margin-top"     : 0,
                    "margin-bottom"  : 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }
        }

    });

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            "target": ".@-button"
        },

        boot: function() {

            // init code
            UI.$html.on("click.buttonradio.uikit", "[data-@-button-radio]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("buttonRadio")) {

                    var obj    = UI.buttonRadio(ele, UI.Utils.options(ele.attr("data-@-button-radio"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger("click");
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(ele).removeClass(UI.prefix("@-active")).blur();
                $this.trigger("change.uk.button", [ele.addClass("@-active")]);
            });

        },

        getSelected: function() {
            return this.find(".@-active");
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            "target": ".@-button"
        },

        boot: function() {

            UI.$html.on("click.buttoncheckbox.uikit", "[data-@-button-checkbox]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("buttonCheckbox")) {

                    var obj    = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr("data-@-button-checkbox"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        ele.trigger("change.uk.button", [target.toggleClass("@-active").blur()]);
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if ($(this).is('a[href="#"]')) e.preventDefault();

                $this.trigger("change.uk.button", [UI.$(this).toggleClass("@-active").blur()]);
            });

        },

        getSelected: function() {
            return this.find(".@-active");
        }
    });


    UI.component('button', {

        defaults: {},

        boot: function() {

            UI.$html.on("click.button.uikit", "[data-@-button]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("button")) {

                    var obj = UI.button(ele, UI.Utils.options(ele.attr("data-@-button")));
                    ele.trigger("click");
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger("change.uk.button", [$this.element.blur().hasClass("@-active")]);
            });

        },

        toggle: function() {
            this.element.toggleClass("@-active");
        }
    });

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var active = false, hoverIdle;

    UI.component('dropdown', {

        defaults: {
           'mode'       : 'hover',
           'remaintime' : 800,
           'justify'    : false,
           'boundary'   : UI.$win,
           'delay'      : 0
        },

        remainIdle: false,

        boot: function() {

            var triggerevent = UI.support.touch ? "click" : "mouseenter";

            // init code
            UI.$html.on(triggerevent+".dropdown.uikit", "[data-@-dropdown]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("dropdown")) {

                    var dropdown = UI.dropdown(ele, UI.Utils.options(ele.attr("data-@-dropdown")));

                    if (triggerevent=="click" || (triggerevent=="mouseenter" && dropdown.options.mode=="hover")) {
                        dropdown.element.trigger(triggerevent);
                    }

                    if(dropdown.element.find('.@-dropdown').length) {
                        e.preventDefault();
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.dropdown  = this.find('.@-dropdown');

            this.centered  = this.dropdown.hasClass('@-dropdown-center');
            this.justified = this.options.justify ? UI.$(this.options.justify) : false;

            this.boundary  = UI.$(this.options.boundary);
            this.flipped   = this.dropdown.hasClass('@-dropdown-flip');

            if (!this.boundary.length) {
                this.boundary = UI.$win;
            }

            if (this.options.mode == "click" || UI.support.touch) {

                this.on("click", function(e) {

                    var $target = UI.$(e.target);

                    if (!$target.parents(".@-dropdown").length) {

                        if ($target.is("a[href='#']") || $target.parent().is("a[href='#']") || ($this.dropdown.length && !$this.dropdown.is(":visible")) ){
                            e.preventDefault();
                        }

                        $target.blur();
                    }

                    if (!$this.element.hasClass('@-open')) {

                        $this.show();

                    } else {

                        if ($target.is("a:not(.js-@-prevent)") || $target.is(".@-dropdown-close") || !$this.dropdown.find(e.target).length) {
                            $this.hide();
                        }
                    }
                });

            } else {

                this.on("mouseenter", function(e) {

                    if ($this.remainIdle) {
                        clearTimeout($this.remainIdle);
                    }

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    hoverIdle = setTimeout($this.show.bind($this), $this.options.delay);

                }).on("mouseleave", function() {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    $this.remainIdle = setTimeout(function() {
                        $this.hide();
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

            UI.$html.off("click.outer.dropdown");

            if (active && active[0] != this.element[0]) {
                active.removeClass('@-open');
            }

            if (hoverIdle) {
                clearTimeout(hoverIdle);
            }

            this.checkDimensions();
            this.element.addClass('@-open');
            this.trigger('show.uk.dropdown', [this]);

            UI.Utils.checkDisplay(this.dropdown, true);
            active = this.element;

            this.registerOuterClick();
        },

        hide: function() {
            this.element.removeClass('@-open');
            this.remainIdle = false;

            if (active && active[0] == this.element[0]) active = false;
        },

        registerOuterClick: function(){

            var $this = this;

            UI.$html.off("click.outer.dropdown");

            setTimeout(function() {

                UI.$html.on("click.outer.dropdown", function(e) {

                    if (hoverIdle) {
                        clearTimeout(hoverIdle);
                    }

                    var $target = UI.$(e.target);

                    if (active && active[0] == $this.element[0] && ($target.is("a:not(.js-@-prevent)") || $target.is(".@-dropdown-close") || !$this.dropdown.find(e.target).length)) {
                        $this.hide();
                        UI.$html.off("click.outer.dropdown");
                    }
                });
            }, 10);
        },

        checkDimensions: function() {

            if (!this.dropdown.length) return;

            if (this.justified && this.justified.length) {
                this.dropdown.css("min-width", "");
            }

            var $this     = this,
                dropdown  = this.dropdown.css("margin-" + UI.langdirection, ""),
                offset    = dropdown.show().offset(),
                width     = dropdown.outerWidth(),
                boundarywidth  = this.boundary.width(),
                boundaryoffset = this.boundary.offset() ? this.boundary.offset().left:0;

            // centered dropdown
            if (this.centered) {
                dropdown.css("margin-" + UI.langdirection, (parseFloat(width) / 2 - dropdown.parent().width() / 2) * -1);
                offset = dropdown.offset();

                // reset dropdown
                if ((width + offset.left) > boundarywidth || offset.left < 0) {
                    dropdown.css("margin-" + UI.langdirection, "");
                    offset = dropdown.offset();
                }
            }

            // justify dropdown
            if (this.justified && this.justified.length) {

                var jwidth = this.justified.outerWidth();

                dropdown.css("min-width", jwidth);

                if (UI.langdirection == 'right') {

                    var right1   = boundarywidth - (this.justified.offset().left + jwidth),
                        right2   = boundarywidth - (dropdown.offset().left + dropdown.outerWidth());

                    dropdown.css("margin-right", right1 - right2);

                } else {
                    dropdown.css("margin-left", this.justified.offset().left - offset.left);
                }

                offset = dropdown.offset();

            }

            if ((width + (offset.left-boundaryoffset)) > boundarywidth) {
                dropdown.addClass('@-dropdown-flip');
                offset = dropdown.offset();
            }

            if ((offset.left-boundaryoffset) < 0) {

                dropdown.addClass("@-dropdown-stack");

                if (dropdown.hasClass('@-dropdown-flip')) {

                    if (!this.flipped) {
                        dropdown.removeClass('@-dropdown-flip');
                        offset = dropdown.offset();
                        dropdown.addClass('@-dropdown-flip');
                    }

                    setTimeout(function(){

                        if ((dropdown.offset().left-boundaryoffset) < 0 || !$this.flipped && (dropdown.outerWidth() + (offset.left-boundaryoffset)) < boundarywidth) {
                            dropdown.removeClass('@-dropdown-flip');
                        }
                    }, 0);
                }

                this.trigger('stack.uk.dropdown', [this]);
            }

            dropdown.css("display", "");
        }

    });

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var grids = [];

    UI.component('gridMatchHeight', {

        defaults: {
            "target" : false,
            "row"    : true
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-grid-match]", context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data("gridMatchHeight")) {
                        obj = UI.gridMatchHeight(grid, UI.Utils.options(grid.attr("data-@-grid-match")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns  = this.element.children();
            this.elements = this.options.target ? this.find(this.options.target) : this.columns;

            if (!this.columns.length) return;

            UI.$win.on('resize orientationchange', (function() {

                var fn = function() {
                    $this.match();
                };

                $(function() {
                    fn();
                    UI.$win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 50);
            })());

            UI.$html.on("changed.uk.dom", function(e) {
                $this.columns  = $this.element.children();
                $this.elements = $this.options.target ? $this.find($this.options.target) : $this.columns;
                $this.match();
            });

            this.on("display.uk.check", function(e) {
                if(this.element.is(":visible")) this.match();
            }.bind(this));

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
            "cls": "@-grid-margin"
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-grid-margin]", context).each(function() {
                    var grid = UI.$(this), obj;

                    if (!grid.data("gridMargin")) {
                        obj = UI.gridMargin(grid, UI.Utils.options(grid.attr("data-@-grid-margin")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            var stackMargin = UI.stackMargin(this.element, this.options);
        }
    });

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var active = false, $html = UI.$html, body;

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
            this.paddingdir = "padding-" + (UI.langdirection == 'left' ? "right":"left");
            this.dialog     = this.find(".@-modal-dialog");

            this.on("click", ".@-modal-close", function(e) {
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

            this.element.removeClass("@-open").show();
            this.resize();

            active = this;
            $html.addClass("@-modal-page").height(); // force browser engine redraw

            this.element.addClass("@-open").trigger("show.uk.modal");

            UI.Utils.checkDisplay(this.dialog, true);

            return this;
        },

        hide: function(force) {

            if (!this.isActive()) return;

            if (!force && UI.support.transition) {

                var $this = this;

                this.one(UI.support.transition.end, function() {
                    $this._hide();
                }).removeClass("@-open");

            } else {

                this._hide();
            }

            return this;
        },

        resize: function() {

            var bodywidth  = body.width();

            this.scrollbarwidth = window.innerWidth - bodywidth;

            body.css(this.paddingdir, this.scrollbarwidth);

            this.element.css('overflow-y', this.scrollbarwidth ? 'scroll' : 'auto');

            this.updateScrollable();

        },

        updateScrollable: function() {

            // has scrollable?
            var scrollable = this.dialog.find('.@-overflow-container:visible:first');

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

            this.element.hide().removeClass("@-open");

            $html.removeClass("@-modal-page");

            body.css(this.paddingdir, "");

            if(active===this) active = false;

            this.trigger("hide.uk.modal");
        },

        isActive: function() {
            return (active == this);
        }

    });

    UI.component('modalTrigger', {

        boot: function() {

            // init code
            UI.$html.on("click.modal.uikit", "[data-@-modal]", function(e) {

                var ele = UI.$(this);

                if (ele.is("a")) {
                    e.preventDefault();
                }

                if (!ele.data("modalTrigger")) {
                    var modal = UI.modalTrigger(ele, UI.Utils.options(ele.attr("data-@-modal")));
                    modal.show();
                }

            });

            // close modal on esc button
            UI.$html.on('keydown.modal.uikit', function (e) {

                if (active && e.keyCode === 27 && active.options.keyboard) { // ESC
                    e.preventDefault();
                    active.hide();
                }
            });

            UI.$win.on("resize orientationchange", UI.Utils.debounce(function(){
                if (active) active.resize();
            }, 150));
        },

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

        var modal = UI.modal(UI.$(UI.modal.dialog.template).appendTo("body"), options);

        modal.on("hide.uk.modal", function(){
            if (modal.persist) {
                modal.persist.appendTo(modal.persist.data("modalPersistParent"));
                modal.persist = false;
            }
            modal.element.remove();
        });

        setContent(content, modal);

        return modal;
    };

    UI.modal.dialog.template = '<div class="@-modal"><div class="@-modal-dialog"></div></div>';

    UI.modal.alert = function(content, options) {

        UI.modal.dialog(([
            '<div class="@-margin @-modal-content">'+String(content)+'</div>',
            '<div class="@-modal-buttons"><button class="@-button @-button-primary @-modal-close">Ok</button></div>'
        ]).join("").replace(/@-/g, UI._prefix+'-').replace(/@-/g, UI._prefix+'-'), $.extend({bgclose:false, keyboard:false}, options)).show();
    };

    UI.modal.confirm = function(content, onconfirm, options) {

        onconfirm = $.isFunction(onconfirm) ? onconfirm : function(){};

        var modal = UI.modal.dialog(([
            '<div class="@-margin @-modal-content">'+String(content)+'</div>',
            '<div class="@-modal-buttons"><button class="@-button @-button-primary js-modal-confirm">Ok</button> <button class="@-button @-modal-close">Cancel</button></div>'
        ]).join("").replace(/@-/g, UI._prefix+'-'), $.extend({bgclose:false, keyboard:false}, options));

        modal.element.find(".js-modal-confirm").on("click", function(){
            onconfirm();
            modal.hide();
        });

        modal.show();
    };


    // helper functions
    function setContent(content, modal){

        if(!modal) return;

        if (typeof content === 'object') {

            // convert DOM object to a jQuery object
            content = content instanceof jQuery ? content : UI.$(content);

            if(content.parent().length) {
                modal.persist = content;
                modal.persist.data("modalPersistParent", content.parent());
            }
        }else if (typeof content === 'string' || typeof content === 'number') {
                // just insert the data as innerHTML
                content = $('<div></div>').html(content);
        }else {
                // unsupported data type!
                content = $('<div></div>').html('UIkit.modal Error: Unsupported data type: ' + typeof content);
        }

        content.appendTo(modal.element.find('.@-modal-dialog'));

        return modal;
    }

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    UI.component('nav', {

        defaults: {
            "toggle": ">li.@-parent > a[href='#']",
            "lists": ">li.@-parent > ul",
            "multiple": false
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-nav]", context).each(function() {
                    var nav = UI.$(this);

                    if (!nav.data("nav")) {
                        var obj = UI.nav(nav, UI.Utils.options(nav.attr("data-@-nav")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                var ele = UI.$(this);
                $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
            });

            this.find(this.options.lists).each(function() {
                var $ele   = UI.$(this),
                    parent = $ele.parent(),
                    active = parent.hasClass("@-active");

                $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
                parent.data("list-container", $ele.parent());

                if (active) $this.open(parent, true);
            });

        },

        open: function(li, noanimation) {

            var element = this.element, $li = UI.$(li);

            if (!this.options.multiple) {

                element.children(".@-open").not(li).each(function() {

                    var ele = UI.$(this);

                    if (ele.data("list-container")) {
                        ele.data("list-container").stop().animate({height: 0}, function() {
                            UI.$(this).parent().removeClass("@-open");
                        });
                    }
                });
            }

            $li.toggleClass("@-open");

            if ($li.data("list-container")) {

                if (noanimation) {
                    $li.data('list-container').stop().height($li.hasClass("@-open") ? "auto" : 0);
                } else {
                    $li.data('list-container').stop().animate({
                        height: ($li.hasClass("@-open") ? getHeight($li.data('list-container').find('ul:first')) : 0)
                    });
                }
            }
        }
    });


    // helper

    function getHeight(ele) {
        var $ele = UI.$(ele), height = "auto";

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

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var scrollpos = {x: window.scrollX, y: window.scrollY},
        $win      = UI.$win,
        $doc      = UI.$doc,
        $html     = UI.$html,
        Offcanvas = {

        show: function(element) {

            element = UI.$(element);

            if (!element.length) return;

            var $body     = UI.$('body'),
                bar       = element.find(".@-offcanvas-bar:first"),
                rtl       = (UI.langdirection == "right"),
                flip      = bar.hasClass("@-offcanvas-bar-flip") ? -1:1,
                dir       = flip * (rtl ? -1 : 1);

            scrollpos = {x: window.pageXOffset, y: window.pageYOffset};

            element.addClass("@-active");

            $body.css({"width": window.innerWidth, "height": window.innerHeight}).addClass("@-offcanvas-page");
            $body.css((rtl ? "margin-right" : "margin-left"), (rtl ? -1 : 1) * (bar.outerWidth() * dir)).width(); // .width() - force redraw

            $html.css('margin-top', scrollpos.y * -1);

            bar.addClass("@-offcanvas-bar-show");

            this._initElement(element);

            $doc.trigger('show.uk.offcanvas', [element, bar]);
        },

        hide: function(force) {

            var $body = UI.$('body'),
                panel = UI.$(".@-offcanvas.@-active"),
                rtl   = (UI.langdirection == "right"),
                bar   = panel.find(".@-offcanvas-bar:first"),
                finalize = function() {
                    $body.removeClass("@-offcanvas-page").css({"width": "", "height": "", "margin-left": "", "margin-right": ""});
                    panel.removeClass("@-active");
                    bar.removeClass("@-offcanvas-bar-show");
                    $html.css('margin-top', '');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                    UI.$doc.trigger('hide.uk.offcanvas', [panel, bar]);
                };

            if (!panel.length) return;

            if (UI.support.transition && !force) {

                $body.one(UI.support.transition.end, function() {
                    finalize();
                }).css((rtl ? "margin-right" : "margin-left"), "");

                setTimeout(function(){
                    bar.removeClass("@-offcanvas-bar-show");
                }, 0);

            } else {
                finalize();
            }
        },

        _initElement: function(element) {

            if (element.data("OffcanvasInit")) return;

            element.on("click.uk.offcanvas swipeRight.uk.offcanvas swipeLeft.uk.offcanvas", function(e) {

                var target = UI.$(e.target);

                if (!e.type.match(/swipe/)) {

                    if (!target.hasClass("@-offcanvas-close")) {
                        if (target.hasClass("@-offcanvas-bar")) return;
                        if (target.parents(".@-offcanvas-bar:first").length) return;
                    }
                }

                e.stopImmediatePropagation();
                Offcanvas.hide();
            });

            element.on("click", "a[href^='#']", function(e){

                var element = $(this),
                    href = element.attr("href");

                if (href == "#") {
                    return;
                }

                UI.$doc.one('hide.uk.offcanvas', function() {

                    var target = $(href);

                    if (!target.length) {
                        target = UI.$('[name="'+href.replace('#','')+'"]');
                    }

                    if (UI.Utils.scrollToElement && target.length) {
                        UI.Utils.scrollToElement(target);
                    } else {
                        window.location.href = href;
                    }
                });

                Offcanvas.hide();
            });

            element.data("OffcanvasInit", true);
        }
    };

    UI.component('offcanvasTrigger', {

        boot: function() {

            // init code
            $html.on("click.offcanvas.uikit", "[data-@-offcanvas]", function(e) {

                e.preventDefault();

                var ele = UI.$(this);

                if (!ele.data("offcanvasTrigger")) {
                    var obj = UI.offcanvasTrigger(ele, UI.Utils.options(ele.attr("data-@-offcanvas")));
                    ele.trigger("click");
                }
            });

            $html.on('keydown.uk.offcanvas', function(e) {

                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },

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

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var Animations;

    UI.component('switcher', {

        defaults: {
            connect   : false,
            toggle    : ">*",
            active    : 0,
            animation : false,
            duration  : 200
        },

        animating: false,

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-switcher]", context).each(function() {
                    var switcher = UI.$(this);

                    if (!switcher.data("switcher")) {
                        var obj = UI.switcher(switcher, UI.Utils.options(switcher.attr("data-@-switcher")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.toggle, function(e) {
                e.preventDefault();
                $this.show(this);
            });

            if (this.options.connect) {

                this.connect = UI.$(this.options.connect);

                this.connect.find(".@-active").removeClass(".@-active");

                // delegate switch commands within container content
                if (this.connect.length) {

                    this.connect.on("click", '[data-@-switcher-item]', function(e) {

                        e.preventDefault();

                        var item = UI.$(this).data(UI._prefix+'SwitcherItem');

                        if ($this.index == item) return;

                        switch(item) {
                            case 'next':
                            case 'previous':
                                $this.show($this.index + (item=='next' ? 1:-1));
                                break;
                            default:
                                $this.show(item);
                        }
                    });
                }

                var toggles = this.find(this.options.toggle),
                    active  = toggles.filter(".@-active");

                if (active.length) {
                    this.show(active, false);
                } else {

                    if (this.options.active===false) return;

                    active = toggles.eq(UI.prefix(this.options.active));
                    this.show(active.length ? active : toggles.eq(0), false);
                }
            }

        },

        show: function(tab, animate) {

            if (this.animating) {
                return;
            }

            if (isNaN(tab)) {
                tab = UI.$(tab);
            } else {

                var togglers = this.find(this.options.toggle);

                tab = tab < 0 ? togglers.length-1 : tab;
                tab = togglers.eq(togglers[tab] ? tab : 0);
            }

            var $this     = this,
                active    = UI.$(tab),
                animation = Animations[this.options.animation] || function(current, next) {

                    if (!$this.options.animation) {
                        return Animations.none.apply($this);
                    }

                    var anim = $this.options.animation.split(',');

                    if (anim.length == 1) {
                        anim[1] = anim[0];
                    }

                    anim[0] = anim[0].trim();
                    anim[1] = anim[1].trim();

                    return coreAnimation.apply($this, [anim, current, next]);
                };

            if (animate===false) {
                animation = Animations.none;
            }

            if (active.hasClass("@-disabled")) return;

            this.find(this.options.toggle).filter(".@-active").removeClass("@-active");
            active.addClass("@-active");

            if (this.options.connect && this.connect.length) {

                this.index = this.find(this.options.toggle).index(active);

                if (this.index == -1 ) {
                    this.index = 0;
                }

                this.connect.each(function() {

                    var container = UI.$(this),
                        children  = UI.$(container.children()),
                        current   = UI.$(children.filter('.@-active')),
                        next      = UI.$(children.eq($this.index));

                        $this.animating = true;

                        animation.apply($this, [current, next]).then(function(){

                            current.removeClass("@-active");
                            next.addClass("@-active");
                            UI.Utils.checkDisplay(next, true);

                            $this.animating = false;
                        });
                });
            }

            this.trigger("show.uk.switcher", [active]);
        }
    });

    Animations = {

        'none': function() {
            var d = $.Deferred();
            d.resolve();
            return d.promise();
        },

        'fade': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-fade', current, next]);
        },

        'slide-bottom': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-bottom', current, next]);
        },

        'slide-top': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-top', current, next]);
        },

        'slide-vertical': function(current, next, dir) {

            var anim = ['@-animation-slide-top', '@-animation-slide-bottom'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'slide-left': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-left', current, next]);
        },

        'slide-right': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-slide-right', current, next]);
        },

        'slide-horizontal': function(current, next, dir) {

            var anim = ['@-animation-slide-left', '@-animation-slide-right'];

            if (current && current.index() > next.index()) {
                anim.reverse();
            }

            return coreAnimation.apply(this, [anim, current, next]);
        },

        'scale': function(current, next) {
            return coreAnimation.apply(this, ['@-animation-scale-up', current, next]);
        }
    };

    UI.switcher.animations = Animations;


    // helpers

    function coreAnimation(cls, current, next) {

        var d = $.Deferred(), clsIn = UI.prefix(cls), clsOut = cls, release;

        if (next[0]===current[0]) {
            d.resolve();
            return d.promise();
        }

        if (typeof(cls) == 'object') {
            clsIn  = cls[0];
            clsOut = cls[1] || cls[0];
        }

        release = function() {

            if (current) current.hide().removeClass(UI.prefix('@-active '+clsOut+' @-animation-reverse'));

            next.addClass(clsIn).one(UI.support.animation.end, function() {

                next.removeClass(''+clsIn+'').css({opacity:'', display:''});

                d.resolve();

                if (current) current.css({opacity:'', display:''});

            }.bind(this)).show();
        };

        next.css('animation-duration', this.options.duration+'ms');

        if (current && current.length) {

            current.css('animation-duration', this.options.duration+'ms');

            current.css('display', 'none').addClass(UI.prefix(clsOut+' @-animation-reverse')).one(UI.support.animation.end, function() {
                release();
            }.bind(this)).css('display', '');

        } else {
            next.addClass('@-active');
            release();
        }

        return d.promise();
    }

})(jQuery, UIkit);

(function($, UI) {

    "use strict";


    UI.component('tab', {

        defaults: {
            'target'    : '>li:not(.@-tab-responsive, .@-disabled)',
            'connect'   : false,
            'active'    : 0,
            'animation' : false,
            'duration'  : 200
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-@-tab]", context).each(function() {

                    var tab = UI.$(this);

                    if (!tab.data("tab")) {
                        var obj = UI.tab(tab, UI.Utils.options(tab.attr("data-@-tab")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {
                e.preventDefault();
                $this.find($this.options.target).not(this).removeClass(UI.prefix("@-active")).blur();
                $this.trigger("change.uk.tab", [UI.$(this).addClass("@-active")]);
            });

            if (this.options.connect) {
                this.connect = $(this.options.connect);
            }

            // init responsive tab
            this.responsivetab = UI.$('<li class="@-tab-responsive @-active"><a></a></li>').append(UI.prefix('<div class="@-dropdown @-dropdown-small"><ul class="@-nav @-nav-dropdown"></ul><div>'));

            this.responsivetab.dropdown = this.responsivetab.find('.@-dropdown');
            this.responsivetab.lst      = this.responsivetab.dropdown.find('ul');
            this.responsivetab.caption  = this.responsivetab.find('a:first');

            if (this.element.hasClass("@-tab-bottom")) this.responsivetab.dropdown.addClass("@-dropdown-up");

            // handle click
            this.responsivetab.lst.on('click', 'a', function(e) {

                e.preventDefault();
                e.stopPropagation();

                var link = $(this);

                $this.element.children(':not(.@-tab-responsive)').eq(link.data('index')).trigger('click');
            });

            this.on('show.uk.switcher change.uk.tab', function(e, tab) {
                $this.responsivetab.caption.html(tab.text());
            });

            this.element.append(this.responsivetab);

            // init UIkit components
            if (this.options.connect) {
                UI.switcher(this.element, {
                    "toggle"    : ">li:not(.@-tab-responsive)",
                    "connect"   : this.options.connect,
                    "active"    : this.options.active,
                    "animation" : this.options.animation,
                    "duration"  : this.options.duration
                });
            }

            UI.dropdown(this.responsivetab, {"mode": "click"});

            // init
            $this.trigger("change.uk.tab", [this.element.find(this.options.target).filter('.@-active')]);

            this.check();

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function(){
                if ($this.element.is(":visible"))  $this.check();
            }, 100));

            this.on('display.uk.check', function(){
                if ($this.element.is(":visible"))  $this.check();
            });
        },

        check: function() {

            var children = this.element.children(':not(.@-tab-responsive)').removeClass('@-hidden');

            if (!children.length) return;

            var top          = (children.eq(0).offset().top + Math.ceil(children.eq(0).height()/2)),
                doresponsive = false,
                item, link;

            this.responsivetab.lst.empty();

            children.each(function(){

                if ($(this).offset().top > top) {
                    doresponsive = true;
                }
            });

            if (doresponsive) {

                for (var i = 0; i < children.length; i++) {

                    item = UI.$(children.eq(i));
                    link = item.find('a');

                    if (item.css('float') != 'none' && !item.attr('@-dropdown')) {

                        item.addClass('@-hidden');

                        if (!item.hasClass('@-disabled')) {
                            this.responsivetab.lst.append('<li><a href="'+link.attr('href')+'" data-index="'+i+'">'+link.html()+'</a></li>');
                        }
                    }
                }
            }

            this.responsivetab[this.responsivetab.lst.children().length ? 'removeClass':'addClass']('@-hidden');
        }
    });

})(jQuery, UIkit);

(function($, UI) {

    "use strict";

    var $tooltip,   // tooltip container
        tooltipdelay, checkdelay;

    UI.component('tooltip', {

        defaults: {
            "offset": 5,
            "pos": "top",
            "animation": false,
            "delay": 0, // in miliseconds
            "cls": "",
            "src": function() { return this.attr("title"); }
        },

        tip: "",

        boot: function() {

            // init code
            UI.$html.on("mouseenter.tooltip.uikit focus.tooltip.uikit", "[data-@-tooltip]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("tooltip")) {
                    var obj = UI.tooltip(ele, UI.Utils.options(ele.attr("data-@-tooltip")));
                    ele.trigger("mouseenter");
                }
            });
        },

        init: function() {

            var $this = this;

            if (!$tooltip) {
                $tooltip = UI.$('<div class="@-tooltip"></div>').appendTo("body");
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
            if (checkdelay)       clearTimeout(checkdelay);
            if (!this.tip.length) return;

            $tooltip.stop().css({"top": -2000, "visibility": "hidden"}).show();
            $tooltip.html(UI.prefix('<div class="@-tooltip-inner">') + this.tip + '</div>');

            var $this      = this,
                pos        = $.extend({}, this.element.offset(), {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight}),
                width      = $tooltip[0].offsetWidth,
                height     = $tooltip[0].offsetHeight,
                offset     = typeof(this.options.offset) === "function" ? this.options.offset.call(this.element) : this.options.offset,
                position   = typeof(this.options.pos) === "function" ? this.options.pos.call(this.element) : this.options.pos,
                tmppos     = position.split("-"),
                tcss       = {
                    "display"    : "none",
                    "visibility" : "visible",
                    "top"        : (pos.top + pos.height + height),
                    "left"       : pos.left
                };


            // prevent strange position
            // when tooltip is in offcanvas etc.
            if ($('html').css('position')=='fixed' || $('body').css('position')=='fixed'){
                var bodyoffset = UI.$('body').offset(),
                    htmloffset = UI.$('html').offset(),
                    docoffset  = {'top': (htmloffset.top + bodyoffset.top), 'left': (htmloffset.left + bodyoffset.left)};

                pos.left -= docoffset.left;
                pos.top  -= docoffset.top;
            }


            if ((tmppos[0] == "left" || tmppos[0] == "right") && UI.langdirection == 'right') {
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

                $tooltip.css(tcss).attr("class", UI.prefix(["@-tooltip", "@-tooltip-"+position, $this.options.cls].join(' ')));

                if ($this.options.animation) {
                    $tooltip.css({opacity: 0, display: 'block'}).animate({opacity: 1}, parseInt($this.options.animation, 10) || 400);
                } else {
                    $tooltip.show();
                }

                tooltipdelay = false;

                // close tooltip if element was removed or hidden
                checkdelay = setInterval(function(){
                    if(!$this.element.is(':visible')) $this.hide();
                }, 150);

            }, parseInt(this.options.delay, 10) || 0);
        },

        hide: function() {
            if(this.element.is("input") && this.element[0]===document.activeElement) return;

            if(tooltipdelay) clearTimeout(tooltipdelay);
            if (checkdelay)  clearTimeout(checkdelay);

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

            if(left < 0 || ((left - UI.$win.scrollLeft())+width) > window.innerWidth) {
               axis += "x";
            }

            if(top < 0 || ((top - UI.$win.scrollTop())+height) > window.innerHeight) {
               axis += "y";
            }

            return axis;
        }
    });

})(jQuery, UIkit);
