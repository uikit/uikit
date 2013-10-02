(function($, UI) {

    "use strict";

    var $win        = $(window),

        ScrollSpy   = function(element, options) {

            this.options = $.extend({}, this.options, options);

            var $this = this, inviewstate, initinview,
                fn = function(){

                    var inview = isInView($this);

                    if(inview && !inviewstate) {

                        if(!initinview) {
                            $this.element.addClass($this.options.initcls);
                            $this.offset = $this.element.offset();
                            initinview = true;

                            $this.element.trigger("uk-scrollspy-init");
                        }

                        $this.element.addClass("uk-scrollspy-inview").addClass($this.options.cls).width();
                        inviewstate = true;

                        $this.element.trigger("uk.scrollspy.inview");
                    }

                    if (!inview && inviewstate && $this.options.repeat) {
                        $this.element.removeClass("uk-scrollspy-inview").removeClass($this.options.cls);
                        inviewstate = false;

                        $this.element.trigger("uk.scrollspy.outview");
                    }
                };

            this.element = $(element);

            $win.on("scroll", fn).on("resize orientationchange", UI.Utils.debounce(fn, 50));

            fn();
        };

    $.extend(ScrollSpy.prototype, {

        options: {
            "cls": "uk-scrollspy-inview",
            "initcls": "uk-scrollspy-init-inview",
            "topoffset": 0,
            "leftoffset": 0,
            "repeat": false
        }

    });

    UI["scrollspy"] = ScrollSpy;


    function isInView(obj) {

        var $element = obj.element, options = obj.options;

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = obj.offset || $element.offset(), left = offset.left, top = offset.top;

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    }


    // init code
    $(function() {
        $("[data-uk-scrollspy]").each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                element.data("scrollspy", new ScrollSpy(element, UI.Utils.options(element.data("uk-scrollspy"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);