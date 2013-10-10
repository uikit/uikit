(function($, UI) {

    "use strict";

    var SmoothScroll = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("smoothScroll")) return;

        this.options = $.extend({
            duration: 1000,
            transition: 'easeOutExpo'
        }, options);

        this.element = $element.on("click", function(e) {

            // get / set parameters
            var target    = ($(this.hash).length ? $(this.hash) : $("body")).offset().top,
                docheight = $(document).height(),
                winheight = $(window).height();

            if ((target + winheight) > docheight) {
                target = (target - winheight) + 50;
            }

            // animate to target and set the hash to the window.location after the animation
            $("html,body").stop().animate({scrollTop: target}, $this.options.duration, $this.options.transition);

            // cancel default click action
            return false;
        });

        this.element.data("smoothScroll", this);
    };

    UI["smoothScroll"] = SmoothScroll;


    if (!$.easing['easeOutExpo']) {
        $.easing['easeOutExpo'] = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };
    }


    // init code
    $(document).on("click.smooth-scroll.uikit", "[data-uk-smooth-scroll]", function(e) {
        var ele = $(this);

        if (!ele.data("smoothScroll")) {
            var obj = new SmoothScroll(ele, UI.Utils.options(ele.attr("data-uk-smooth-scroll")));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);