/*! UIkit 2.7.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

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

    var $win         = $(window),
        $doc         = $(document),
        sticked      = [],
        windowHeight = $win.height();

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

            this.element.wrapAll(wrapper);

            if (this.element.css("float") == "right") {
                this.element.css({"float":"none"}).parent().css({"float":"right"});
            }

            var stickyWrapper = this.element.parent().css('height', this.element.outerHeight());

            sticked.push({
                top: this.options.top,
                bottom: this.options.bottom,
                stickyElement: this.element,
                currentTop: null,
                stickyWrapper: stickyWrapper,
                clsactive: this.options.clsactive,
                getWidthFrom: this.options.getWidthFrom
            });
        },

        update: function() {
            scroller();
        }
    });

    function scroller() {

        var scrollTop       = $win.scrollTop(),
            documentHeight  = $doc.height(),
            dwh             = documentHeight - windowHeight,
            extra           = (scrollTop > dwh) ? dwh - scrollTop : 0;

        for (var i = 0; i < sticked.length; i++) {

            if(!sticked[i].stickyElement.is(":visible")) {
                continue;
            }

            var s = sticked[i], elementTop = s.stickyWrapper.offset().top, etse = elementTop - s.top - extra;

            if (scrollTop <= etse) {

                if (s.currentTop !== null) {
                    s.stickyElement.css({"position":"", "top":"", "width":""}).parent().removeClass(s.clsactive);
                    s.currentTop = null;
                }

            } else {

                var newTop = documentHeight - s.stickyElement.outerHeight() - s.top - s.bottom - scrollTop - extra;

                newTop = newTop<0 ? newTop + s.top : s.top;

                if (s.currentTop != newTop) {
                    s.stickyElement.css({"position": "fixed", "top": newTop, "width": s.stickyElement.width()});

                    if (typeof s.getWidthFrom !== 'undefined') {
                        s.stickyElement.css('width', $(s.getWidthFrom).width());
                    }

                    s.stickyElement.parent().addClass(s.clsactive);
                    s.currentTop = newTop;
                }
            }
        }

    }

    function resizer() {
        windowHeight = $win.height();
    }

    // should be more efficient than using $win.scroll(scroller) and $win.resize(resizer):
    $doc.on('uk-scroll', scroller);
    $win.on('resize orientationchange', resizer);

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