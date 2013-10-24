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

                    var inview = isInView($this);

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



            if(this.options.targets && this.element.attr("id")) {

                var id  = this.element.attr("id"),
                    cls = this.options.targets===true ? 'uk-active' : this.options.targets,
                    parents = cls.match(/::parents\((.+)\)/);

                cls = cls.replace(/::parents(.+)/g,"");

                this.element.on("uk.scrollspy.inview", function(){
                    var elements = $('a[href="#'+id+'"]');

                    if(parents) {
                        elements.parents(parents[1]).addClass(cls);
                    } else {
                        elements.addClass(cls);
                    }

                }).on("uk.scrollspy.outview", function(){
                    var elements = $('a[href="#'+id+'"]');

                    if(parents) {
                        elements.parents(parents[1]).removeClass(cls);
                    } else {
                        elements.removeClass(cls);
                    }
                });
            }

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
        "delay"      : 0,
        "targets"    : false
    };

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
    $(document).on("uk-domready", function(e) {
        $("[data-uk-scrollspy]").each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                var obj = new ScrollSpy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
            }
        });
    });

})(jQuery, jQuery.UIkit);