/*! UIkit 2.11.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
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
                        navitems = links.closest($this.options.closest).removeClass($this.options.cls).end().filter("a[href='#"+target.attr("id")+"']").closest($this.options.closest).addClass($this.options.cls);
                    } else {
                        navitems = links.removeClass($this.options.cls).filter("a[href='#"+target.attr("id")+"']").addClass($this.options.cls);
                    }

                    $this.element.trigger("uk.scrollspynav.inview", [target, navitems]);
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
    UI.ready(function(context) {

        $("[data-uk-scrollspy]", context).each(function() {

            var element = $(this);

            if (!element.data("scrollspy")) {
                var obj = UI.scrollspy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
            }
        });

        $("[data-uk-scrollspy-nav]", context).each(function() {

            var element = $(this);

            if (!element.data("scrollspynav")) {
                var obj = UI.scrollspynav(element, UI.Utils.options(element.attr("data-uk-scrollspy-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);