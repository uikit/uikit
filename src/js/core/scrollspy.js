(function(UI) {

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
            "target"     : false,
            "cls"        : "uk-scrollspy-inview",
            "initcls"    : "uk-scrollspy-init-inview",
            "topoffset"  : 0,
            "leftoffset" : 0,
            "repeat"     : false,
            "delay"      : 0
        },

        boot: function() {

            // listen to scroll and resize
            $doc.on("scrolling.uk.document", checkScrollSpy);
            $win.on("load resize orientationchange", UI.Utils.debounce(checkScrollSpy, 50));

            // init code
            UI.ready(function(context) {

                UI.$("[data-uk-scrollspy]", context).each(function() {

                    var element = UI.$(this);

                    if (!element.data("scrollspy")) {
                        var obj = UI.scrollspy(element, UI.Utils.options(element.attr("data-uk-scrollspy")));
                    }
                });
            });
        },

        init: function() {

            var $this = this, inviewstate, initinview, togglecls = this.options.cls.split(/,/), fn = function(){

                if ($this.element.data('scrollspy-worker')) {
                    return;
                }

                $this.element.data('scrollspy-worker', 0);

                var elements     = $this.options.target ? $this.element.find($this.options.target) : $this.element,
                    delayIdx     = elements.length === 1 ? 1 : 0,
                    toggleclsIdx = 0;

                elements.each(function(idx){

                    var element = UI.$(this), inviewstate = element.data('inviewstate'), inview = UI.Utils.isInView(element, $this.options), toggle = togglecls[toggleclsIdx].trim();

                    if (inview && !inviewstate) {

                        if (element.data('idle')) {
                            clearTimeout(element.data('idle'));
                        }

                        if(!initinview) {
                            element.addClass($this.options.initcls);
                            $this.offset = element.offset();
                            initinview = true;

                            element.trigger("init.uk.scrollspy");
                        }

                        element.data('idle', setTimeout(function(){

                            if (inview) {
                                element.addClass("uk-scrollspy-inview").toggleClass(toggle).width();
                                element.trigger("inview.uk.scrollspy");
                            }

                            element.data('idle', false);

                            $this.element.data('scrollspy-worker', $this.element.data('scrollspy-worker') - 1);

                        }, $this.options.delay * delayIdx));

                        element.data('inviewstate', true);

                        delayIdx++;

                        $this.element.data('scrollspy-worker', $this.element.data('scrollspy-worker') + 1);
                    }

                    if (!inview && inviewstate && $this.options.repeat && !element.data('idle')) {

                        element.removeClass("uk-scrollspy-inview").toggleClass(toggle);
                        element.data('inviewstate', false);

                        element.trigger("outview.uk.scrollspy");
                    }

                    toggleclsIdx = togglecls[toggleclsIdx + 1] ? (toggleclsIdx + 1) : 0;

                });
            };

            fn();

            this.check = !this.options.target ? fn : UI.Utils.debounce(function(){
                fn();
            }, 50);

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

        boot: function() {

            // listen to scroll and resize
            $doc.on("scrolling.uk.document", checkScrollSpyNavs);
            $win.on("resize orientationchange", UI.Utils.debounce(checkScrollSpyNavs, 50));

            // init code
            UI.ready(function(context) {

                UI.$("[data-uk-scrollspy-nav]", context).each(function() {

                    var element = UI.$(this);

                    if (!element.data("scrollspynav")) {
                        var obj = UI.scrollspynav(element, UI.Utils.options(element.attr("data-uk-scrollspy-nav")));
                    }
                });
            });
        },

        init: function() {

            var ids     = [],
                links   = this.find("a[href^='#']").each(function(){ ids.push($(this).attr("href")); }),
                targets = UI.$(ids.join(",")),

                clsActive  = this.options.cls,
                clsClosest = this.options.closest || this.options.closest;

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

})(UIkit);
