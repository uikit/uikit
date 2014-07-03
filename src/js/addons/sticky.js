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
            clsinit      : 'uk-sticky-init',
            clsactive    : 'uk-active',
            clswrapper   : 'uk-sticky',
            getWidthFrom : ''
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
                top          : this.options.top,
                bottom       : this.options.bottom,
                element      : this.element,
                currentTop   : null,
                wrapper      : wrapper,
                init         : false,
                clsactive    : this.options.clsactive,
                clsinit      : this.options.clsinit,
                getWidthFrom : this.options.getWidthFrom || wrapper,
                reset        : function() {
                    this.element.css({"position":"", "top":"", "width":"", "left":""});
                    this.wrapper.removeClass([this.clsactive, this.clsinit].join(' '));
                    this.currentTop = null;
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

        for (var i = 0; i < sticked.length; i++) {

            if (!sticked[i].element.is(":visible")) {
                continue;
            }

            var sticky     = sticked[i],
                elementTop = sticky.wrapper.offset().top,
                etse       = elementTop - sticky.top - extra;

            if (scrollTop < etse) {

                if (sticky.currentTop !== null) {
                    sticky.reset();
                }

            } else {

                if (sticky.top < 0) {
                    newTop = 0;
                } else {
                    newTop = documentHeight - sticky.element.outerHeight() - sticky.top - sticky.bottom - scrollTop - extra;
                    newTop = newTop < 0 ? newTop + sticky.top : sticky.top;
                }

                if (sticky.currentTop != newTop) {

                    sticky.element.css({
                        "position" : "fixed",
                        "top"      : newTop,
                        "width"    : (typeof sticky.getWidthFrom !== 'undefined') ? $(sticky.getWidthFrom).width() : sticky.element.width(),
                        "left"     : sticky.wrapper.offset().left
                    });

                    if (!sticky.init) {
                        sticky.wrapper.addClass(sticky.clsinit);
                    }

                    sticky.wrapper.addClass(sticky.clsactive);
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
            sticked[i].reset();
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