(function($, UI) {

    "use strict";

    var $win        = $(window),

        ScrollSpy   = function(element, options) {

            var $element = $(element);

            if($element.data("scrollspy")) return;

            this.options = $.extend({}, ScrollSpy.defaults, options);
            this.element = $(element);

            var $this = this, idle, inviewstate, initinview,
                fn = function(){

                    var inview = isInView($this.element, $this.options);

                    if(inview && !inviewstate) {

                        if(idle) clearTimeout(idle);

                        if(!initinview) {
                            $this.element.addClass($this.options.initcls);
                            $this.offset = $this.element.offset();
                            initinview = true;

                            $this.element.trigger("uk-scrollspy-init");
                        }

                        idle = setTimeout(function(){

                            if(inview) {
                                $this.element.addClass("uk-scrollspy-inview").addClass($this.options.cls).width();
                            }

                        }, $this.options.delay);

                        inviewstate = true;
                        $this.element.trigger("uk.scrollspy.inview");
                    }

                    if (!inview && inviewstate && $this.options.repeat) {
                        $this.element.removeClass("uk-scrollspy-inview").removeClass($this.options.cls);
                        inviewstate = false;

                        $this.element.trigger("uk.scrollspy.outview");
                    }
                };

            $win.on("scroll", fn).on("resize orientationchange", UI.Utils.debounce(fn, 50));

            fn();

            this.element.data("scrollspy", this);
        };

    ScrollSpy.defaults = {
        "cls"        : "uk-scrollspy-inview",
        "initcls"    : "uk-scrollspy-init-inview",
        "topoffset"  : 0,
        "leftoffset" : 0,
        "repeat"     : false,
        "delay"      : 0
    };

    UI["scrollspy"] = ScrollSpy;

    var ScrollSpyNav = function(element, options) {

        var $element = $(element);

        if($element.data("scrollspynav")) return;

        this.element = $element;
        this.options = $.extend({}, ScrollSpyNav.defaults, options);

        var ids     = [],
            links   = this.element.find("a[href^='#']").each(function(){ ids.push($(this).attr("href")); }),
            targets = $(ids.join(","));

        var $this = this, inviews, fn = function(){

            inviews = [];

            for(var i=0 ; i < targets.length ; i++) {
                if(isInView(targets.eq(i), $this.options)) {
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
                new UI["smoothScroll"](this, $this.options.smoothscroll);
            });
        }

        fn();

        $win.on("scroll", fn).on("resize orientationchange", UI.Utils.debounce(fn, 50));

        this.element.data("scrollspynav", this);
    };

    ScrollSpyNav.defaults = {
        "cls"          : 'uk-active',
        "closest"      : false,
        "topoffset"    : 0,
        "leftoffset"   : 0,
        "smoothscroll" : false
    };

    UI["scrollspynav"] = ScrollSpyNav;

    // helper

    function isInView(element, options) {

        var $element = element;

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(), window_top = $win.scrollTop(), offset = $element.offset(), left = offset.left, top = offset.top;

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    }

    ScrollSpy.isInView = isInView;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-scrollspy]").each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                var obj = new ScrollSpy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
            }
        });

        $("[data-uk-scrollspy-nav]").each(function() {

            var element = $(this);

            if (!element.data("scrollspynav")) {
                var obj = new ScrollSpyNav(element, UI.Utils.options(element.attr("data-uk-scrollspy-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);