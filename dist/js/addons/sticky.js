/*! UIkit 2.8.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-sticky", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    var $win         = UI.$win,
        $doc         = UI.$doc,
        sticked      = [];

    UI.component('sticky', {

        defaults: {
            top          : 0,
            bottom       : 0,
            animation    : '',
            clsinit      : 'uk-sticky-init',
            clsactive    : 'uk-active',
            clswrapper   : 'uk-sticky',
            getWidthFrom : '',
            media   : false
        },

        init: function() {

            var stickyId = this.element.attr('id') || ("s"+Math.ceil(Math.random()*10000)),
                wrapper  = $('<div></div>').attr('id', 'sticky-'+stickyId).addClass(this.options.clswrapper);

            wrapper = this.element.wrap(wrapper).parent();

            if (this.element.css('position') != 'absolute') {
                wrapper.css('height', this.element.outerHeight());
            }

            if (this.element.css("float") != "none") {
                wrapper.css({"float":this.element.css("float")});
                this.element.css({"float":"none"});
            }

            this.sticky = {
                options      : this.options,
                element      : this.element,
                currentTop   : null,
                wrapper      : wrapper,
                init         : false,
                getWidthFrom : this.options.getWidthFrom || wrapper,
                reset        : function(force) {

                    var finalize = function() {
                        this.element.css({"position":"", "top":"", "width":"", "left":""});
                        this.wrapper.removeClass([this.options.clsactive, this.options.clsinit].join(' '));
                        this.element.removeClass([this.options.animation, 'uk-animation-reverse'].join(' '));

                        this.currentTop = null;
                        this.animate    = false;
                    }.bind(this);


                    if (!force && this.options.animation && UI.support.animation) {

                        this.animate = true;

                        this.element.removeClass(this.options.animation).one(UI.support.animation.end, function(){
                            finalize();
                        }).width(); // force redraw

                        this.element.addClass(this.options.animation+' '+'uk-animation-reverse');
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
                        dwh            = documentHeight - $win.height(),
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
                        sticky.wrapper.addClass(sticky.options.clsinit);
                    }

                    sticky.wrapper.addClass(sticky.options.clsactive);

                    if (sticky.options.animation && sticky.init) {
                        sticky.element.addClass(sticky.options.animation);
                    }

                    sticky.currentTop = newTop;
                }
            }

            sticky.init = true;
        }

    }

    // should be more efficient than using $win.scroll(scroller):
    $doc.on('uk-scroll', scroller);
    $win.on('resize orientationchange', UI.Utils.debounce(function() {

        if (!sticked.length) return;

        for (var i = 0; i < sticked.length; i++) {
            sticked[i].reset(true);
        }

        scroller();
    }, 100));

    $doc.on("uk-domready", function(e) {
        setTimeout(function(){


            $("[data-uk-sticky]").each(function(){

                var $ele = $(this);

                if(!$ele.data("sticky")) {
                    UI.sticky($ele, UI.Utils.options($ele.attr('data-uk-sticky')));
                }
            });

            scroller();
        }, 0);
    });

    return $.fn.uksticky;
});