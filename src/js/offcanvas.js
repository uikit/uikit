(function($, UI, DocumentTouch) {

    "use strict";

    if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) {
        $("html").addClass("uk-touch");
    }

    var Offcanvas = {

        show: function(element) {

            element = $(element);

            if (!element.length) return;

            var doc       = $("html"),
                bar       = element.find(".uk-offcanvas-bar:first"),
                dir       = bar.hasClass("uk-offcanvas-bar-flip") ? -1 : 1,
                scrollbar = dir == -1 && $(window).width() < window.innerWidth ? (window.innerWidth - $(window).width()) : 0,
                scrollpos = {x: window.scrollX, y: window.scrollY};

            element.addClass("uk-active");

            doc.css("width", doc.outerWidth()).addClass("uk-offcanvas-page").width(); // .width() - force redraw
            doc.css("margin-" + $.UIkit.langdirection, (bar.width() - scrollbar) * dir);

            window.scrollTo(scrollpos.x, scrollpos.y);

            bar.css($.UIkit.langdirection == "left" ? (dir == -1 ? "right" : "left") : (dir == -1 ? "left" : "right"), 0);

            element.off(".ukoffcanvas").on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

                var target = $(e.target);

                if (!e.type.match(/swipe/)) {
                    if (target.hasClass("uk-offcanvas-bar")) return;
                    if (target.parents(".uk-offcanvas-bar:first").length) return;
                }

                e.stopImmediatePropagation();

                Offcanvas.hide();
            });

            $(document).on('keydown.offcanvas', function(e) {
                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },
        hide: function(force) {

            var doc   = $("html"),
                panel = $(".uk-offcanvas.uk-active"),
                bar   = panel.find(".uk-offcanvas-bar:first");

            if (!panel.length) return;

            if ($.UIkit.support.transition && !force) {

                doc.one($.UIkit.support.transition.end, function() {
                    doc.removeClass("uk-offcanvas-page").css("width", "");
                }).css("margin-" + $.UIkit.langdirection, 0);

                bar.one($.UIkit.support.transition.end, function() {
                    panel.removeClass("uk-active");
                }).css({"left": "", "right": ""});

            } else {
                doc.removeClass("uk-offcanvas-page").css("width", "").css("margin-" + $.UIkit.langdirection, "");
                panel.removeClass("uk-active");
                bar.css({"left": "", "right": ""});
            }

            panel.off(".offcanvas");
            $(document).off(".offcanvas");
        }
    };


    var OffcanvasTrigger = function(element, options) {

        var $this    = this,
            $element = $(element);

        this.options = $.extend({
            "target": $element.is("a") ? $element.attr("href") : false
        }, options);

        this.element = $element;

        $element.on("click", function(e) {
            e.preventDefault();
            Offcanvas.show($this.options.target);
        });
    };

    OffcanvasTrigger.offcanvas = Offcanvas;

    UI["offcanvas"] = OffcanvasTrigger;


    // init code
    $(document).on("click.offcanvas.uikit", "[data-uk-offcanvas]", function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data("offcanvas")) {
            ele.data("offcanvas", new OffcanvasTrigger(ele, UI.Utils.options(ele.data("uk-offcanvas"))));

            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit, window.DocumentTouch);