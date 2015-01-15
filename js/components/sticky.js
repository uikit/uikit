/*! UIkit 2.16.2 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (jQuery && UIkit) {
        component = addon(jQuery, UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-sticky", ["uikit"], function(){
            return component || addon(jQuery, UIkit);
        });
    }

})(function($, UI){

    "use strict";

    var $win         = UI.$win,
        $doc         = UI.$doc,
        sticked      = [];

    UI.component('sticky', {

        defaults: {
            top          : 0,
            bottom       : 0,
            animation    : '',
            clsinit      : '@-sticky-init',
            clsactive    : '@-active',
            getWidthFrom : '',
            media        : false,
            target       : false
        },

        boot: function() {

            // should be more efficient than using $win.scroll(scroller):
            UI.$doc.on('scrolling.uk.document', scroller);
            UI.$win.on('resize orientationchange', UI.Utils.debounce(function() {

                if (!sticked.length) return;

                for (var i = 0; i < sticked.length; i++) {
                    sticked[i].reset(true);
                }

                scroller();
            }, 100));

            // init code
            UI.ready(function(context) {

                setTimeout(function(){

                    UI.$("[data-@-sticky]", context).each(function(){

                        var $ele = UI.$(this);

                        if(!$ele.data("sticky")) {
                            UI.sticky($ele, UI.Utils.options($ele.attr('data-@-sticky')));
                        }
                    });

                    scroller();
                }, 0);
            });
        },

        init: function() {

            var wrapper  = UI.$('<div class="@-sticky-placeholder"></div>').css({
                        'height' : this.element.css('position') != 'absolute' ? this.element.outerHeight() : '',
                        'float'  : this.element.css("float") != "none" ? this.element.css("float") : '',
                        'margin' : this.element.css("margin")
                });

            wrapper = this.element.css('margin', 0).wrap(wrapper).parent();

            this.sticky = {
                options      : this.options,
                element      : this.element,
                currentTop   : null,
                wrapper      : wrapper,
                init         : false,
                getWidthFrom : this.options.getWidthFrom || wrapper,
                reset        : function(force) {

                    var finalize = function() {
                        this.element.css({"position":"", "top":"", "width":"", "left":"", "margin":"0"});
                        this.element.removeClass([this.options.animation, '@-animation-reverse', this.options.clsactive].join(' '));

                        this.currentTop = null;
                        this.animate    = false;
                    }.bind(this);


                    if (!force && this.options.animation && UI.support.animation) {

                        this.animate = true;

                        this.element.removeClass(this.options.animation).one(UI.support.animation.end, function(){
                            finalize();
                        }).width(); // force redraw

                        this.element.addClass(this.options.animation+' '+'@-animation-reverse');
                    } else {
                        finalize();
                    }
                },
                check: function() {

                    if (this.options.media) {

                        switch(typeof(this.options.media)) {
                            case 'number':
                                if (window.innerWidth < this.options.media) {
                                    return false;
                                }
                                break;
                            case 'string':
                                if (window.matchMedia && !window.matchMedia(this.options.media).matches) {
                                    return false;
                                }
                                break;
                        }
                    }

                    var scrollTop      = $win.scrollTop(),
                        documentHeight = $doc.height(),
                        dwh            = documentHeight - window.innerHeight,
                        extra          = (scrollTop > dwh) ? dwh - scrollTop : 0,
                        elementTop     = this.wrapper.offset().top,
                        etse           = elementTop - this.options.top - extra;

                    return (scrollTop  >= etse);
                }
            };

            sticked.push(this.sticky);
        },

        update: function() {
            scroller();
        }
    });

    function scroller() {

        if (!sticked.length) return;

        var scrollTop       = $win.scrollTop(),
            documentHeight  = $doc.height(),
            dwh             = documentHeight - $win.height(),
            extra           = (scrollTop > dwh) ? dwh - scrollTop : 0,
            cls, newTop;

        if(scrollTop < 0) return;


        for (var i = 0; i < sticked.length; i++) {

            if (!sticked[i].element.is(":visible") || sticked[i].animate) {
                continue;
            }

            var sticky = sticked[i];

            if (!sticky.check()) {

                if (sticky.currentTop !== null) {
                    sticky.reset();
                }

            } else {

                if (sticky.options.top < 0) {
                    newTop = 0;
                } else {
                    newTop = documentHeight - sticky.element.outerHeight() - sticky.options.top - sticky.options.bottom - scrollTop - extra;
                    newTop = newTop < 0 ? newTop + sticky.options.top : sticky.options.top;
                }

                if (sticky.currentTop != newTop) {

                    sticky.element.css({
                        "position" : "fixed",
                        "top"      : newTop,
                        "width"    : (typeof sticky.getWidthFrom !== 'undefined') ? $(sticky.getWidthFrom).width() : sticky.element.width(),
                        "left"     : sticky.wrapper.offset().left
                    });

                    if (!sticky.init) {

                        sticky.element.addClass(sticky.options.clsinit);

                        if (location.hash && scrollTop > 0 && sticky.options.target) {

                            var $target = $(location.hash);

                            if ($target.length) {

                                setTimeout((function($target, sticky){

                                    return function() {

                                        sticky.element.width(); // force redraw

                                        var offset       = $target.offset(),
                                            maxoffset    = offset.top + $target.outerHeight(),
                                            stickyOffset = sticky.element.offset(),
                                            stickyHeight = sticky.element.outerHeight(),
                                            stickyMaxOffset = stickyOffset.top + stickyHeight;

                                        if (stickyOffset.top < maxoffset && offset.top < stickyMaxOffset) {
                                            scrollTop = offset.top - stickyHeight - sticky.options.target;
                                            window.scrollTo(0, scrollTop);
                                        }
                                    };

                                })($target, sticky), 0);
                            }
                        }
                    }

                    sticky.element.addClass(sticky.options.clsactive);
                    sticky.element.css('margin', '');

                    if (sticky.options.animation && sticky.init) {
                        sticky.element.addClass(sticky.options.animation);
                    }

                    sticky.currentTop = newTop;
                }
            }

            sticky.init = true;
        }

    }


    return UI.sticky;
});
