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

    UI.version = '2.8.0';
    UI.$doc    = $doc;
    UI.$win    = $win;

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