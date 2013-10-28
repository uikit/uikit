(function($, doc) {

    "use strict";

    var UI = $.UIkit || {};

    if (UI.fn) {
        return;
    }

    UI.fn = function(command, options) {

        var args = arguments, cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i), component = cmd[1], method = cmd[2];

        if (!UI[component]) {
            $.error("UIkit component [" + component + "] does not exist.");
            return this;
        }

        return this.each(function() {
            var $this = $(this), data = $this.data(component);
            if (!data) $this.data(component, (data = new UI[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };

    UI.version = '1.2.0';

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
                if (element.style[name] !== undefined) {
                    return transEndEventNames[name];
                }
            }

        }());

        return transitionEnd && { end: transitionEnd };

    })();

    UI.support.touch            = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
    UI.support.mutationobserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);


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

    $.UIkit = UI;
    $.fn.uk = UI.fn;

    $.UIkit.langdirection = $("html").attr("dir") == "rtl" ? "right" : "left";

    $(function(){

        $(doc).trigger("uk-domready");

        // Check for dom modifications
        if(!UI.support.mutationobserver) return;

        var observer = new UI.support.mutationobserver(UI.Utils.debounce(function(mutations) {
            $(doc).trigger("uk-domready");
        }, 300));

        // pass in the target node, as well as the observer options
        observer.observe(document.body, { childList: true, subtree: true });
    });


})(jQuery, document);