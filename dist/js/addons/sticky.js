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
            clsactive    : 'uk-active',
            clswrapper   : 'uk-sticky',
            getWidthFrom : ''
        },

        init: function() {

            var stickyId = this.element.attr('id') || ("s"+Math.ceil(Math.random()*10000)),
                wrapper  = $('<div></div>').attr('id', 'sticky-'+stickyId).addClass(this.options.clswrapper);

            wrapper = this.element.wrap(wrapper).parent().css('height', this.element.outerHeight());

            if (this.element.css("float") != "none") {
                wrapper.css({"float":this.element.css("float")});
                this.element.css({"float":"none"});
            }

            sticked.push({
                top: this.options.top,
                bottom: this.options.bottom,
                element: this.element,
                currentTop: null,
                wrapper: wrapper,
                clsactive: this.options.clsactive,
                getWidthFrom: this.options.getWidthFrom || wrapper
            });
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
            extra           = (scrollTop > dwh) ? dwh - scrollTop : 0;

        for (var i = 0; i < sticked.length; i++) {

            if (!sticked[i].element.is(":visible")) {
                continue;
            }

            var sticky     = sticked[i],
                elementTop = sticky.wrapper.offset().top,
                etse       = elementTop - sticky.top - extra;

            if (scrollTop <= etse) {

                if (sticky.currentTop !== null) {
                    sticky.element.css({"position":"", "top":"", "width":"", "left":""});
                    sticky.wrapper.removeClass(sticky.clsactive);
                    sticky.currentTop = null;
                }

            } else {

                var newTop = documentHeight - sticky.element.outerHeight() - sticky.top - sticky.bottom - scrollTop - extra;

                newTop = newTop < 0 ? newTop + sticky.top : sticky.top;

                if (sticky.currentTop != newTop) {
                    sticky.element.css({
                        "position" : "fixed",
                        "top"      : newTop,
                        "width"    : (typeof sticky.getWidthFrom !== 'undefined') ? $(sticky.getWidthFrom).width() : sticky.element.width(),
                        "left"     : sticky.wrapper.offset().left
                    });

                    sticky.wrapper.addClass(sticky.clsactive);
                    sticky.currentTop = newTop;
                }
            }
        }

    }

    // should be more efficient than using $win.scroll(scroller):
    $doc.on('uk-scroll', scroller);

    $doc.on("uk-domready", function(e) {
        setTimeout(function(){

            scroller();

            $("[data-uk-sticky]").each(function(){

                var $ele = $(this);

                if(!$ele.data("sticky")) {
                    UI.sticky($ele, UI.Utils.options($ele.attr('data-uk-sticky')));
                }
            });
        }, 0);
    });

    return $.fn.uksticky;
});