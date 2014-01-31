/*! UIkit 2.3.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

/*
 * Based on https://github.com/garand/sticky
 */

(function(global, $, UI, $window, $document){

  var defaults = {
        top          : 0,
        bottom       : 0,
        clsactive    : 'uk-sticky-active',
        clswrapper   : 'uk-sticky-wrapper',
        getWidthFrom : ''
      },

      sticked = [],

      windowHeight = $window.height(),

      scroller = function() {

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

      },

      resizer = function() {
        windowHeight = $window.height();
      },

      methods = {

        init: function(options) {

          var o = $.extend({}, defaults, options);

          return this.each(function() {

            var stickyElement = $(this);

            if(stickyElement.data("sticky")) return;

            var stickyId      = stickyElement.attr('id') || ("s"+Math.ceil(Math.random()*10000)),
                wrapper       = $('<div></div>').attr('id', stickyId + '-sticky-wrapper').addClass(o.clswrapper);

            stickyElement.wrapAll(wrapper);

            if (stickyElement.css("float") == "right") {
              stickyElement.css({"float":"none"}).parent().css({"float":"right"});
            }

            stickyElement.data("sticky", true);

            var stickyWrapper = stickyElement.parent();
            stickyWrapper.css('height', stickyElement.outerHeight());
            sticked.push({
              top: o.top,
              bottom: o.bottom,
              stickyElement: stickyElement,
              currentTop: null,
              stickyWrapper: stickyWrapper,
              clsactive: o.clsactive,
              getWidthFrom: o.getWidthFrom
            });
          });
        },

        update: scroller
      };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    if (window.addEventListener) {
      window.addEventListener('scroll', scroller, false);
      window.addEventListener('resize', resizer, false);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', scroller);
      window.attachEvent('onresize', resizer);
    }

    $.fn.uksticky = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.sticky');
      }
    };

    $(document).on("uk-domready", function(e) {
      setTimeout(function(){

        scroller();

        $("[data-uk-sticky]").each(function(){

          var $ele    = $(this);

          if(!$ele.data("sticky")) $ele.uksticky(UI.Utils.options($ele.attr('data-uk-sticky')));
        });
      }, 0);
    });

})(this, jQuery, jQuery.UIkit, jQuery(window), jQuery(document));