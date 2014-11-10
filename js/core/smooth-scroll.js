/*! UIkit 2.12.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    UI.component('smoothScroll', {

        init: function() {

            var $this = this;

            this.on("click", function(e) {
                e.preventDefault();
                scrollToElement($(this.hash).length ? $(this.hash) : $("body"), $this.options);
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
        $("html,body").stop().animate({scrollTop: target}, options.duration, options.transition).promise().done(options.complete);
    }

    UI.Utils.scrollToElement = scrollToElement;

    if (!$.easing['easeOutExpo']) {
        $.easing['easeOutExpo'] = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }

    // init code
    UI.$html.on("click.smooth-scroll.uikit", "[data-uk-smooth-scroll]", function(e) {
        var ele = $(this);

        if (!ele.data("smoothScroll")) {
            var obj = UI.smoothScroll(ele, UI.Utils.options(ele.attr("data-uk-smooth-scroll")));
            ele.trigger("click");
        }

        return false;
    });

})(jQuery, jQuery.UIkit);