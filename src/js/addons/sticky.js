(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-sticky", ["uikit"], function(){
            return jQuery.UIkit.sticky || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    var $window      = $(window),
        $document    = $(document),
        sticked      = [],
        windowHeight = $window.height();

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

        var scrollTop       = $window.scrollTop(),
            documentHeight  = $document.height(),
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
        windowHeight = $window.height();
    }

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);

    $(document).on("uk-domready", function(e) {
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