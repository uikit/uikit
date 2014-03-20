(function($, UI) {

    "use strict";

    var $win      = $(window),
        $doc      = $(document),
        Offcanvas = {

        show: function(element) {

            element = $(element);

            if (!element.length) return;

            var doc       = $("html"),
                bar       = element.find(".uk-offcanvas-bar:first"),
                rtl       = ($.UIkit.langdirection == "right"),
                dir       = (bar.hasClass("uk-offcanvas-bar-flip") ? -1 : 1) * (rtl ? -1 : 1),
                scrollbar = dir == -1 && $win.width() < window.innerWidth ? (window.innerWidth - $win.width()) : 0;

            scrollpos = {x: window.scrollX, y: window.scrollY};

            element.addClass("uk-active");

            doc.css({"width": window.innerWidth, "height": window.innerHeight}).addClass("uk-offcanvas-page");
            doc.css((rtl ? "margin-right" : "margin-left"), (rtl ? -1 : 1) * ((bar.outerWidth() - scrollbar) * dir)).width(); // .width() - force redraw

            bar.addClass("uk-offcanvas-bar-show").width();

            element.off(".ukoffcanvas").on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

                var target = $(e.target);

                if (!e.type.match(/swipe/)) {

                    if (!target.hasClass("uk-offcanvas-close")) {
                        if (target.hasClass("uk-offcanvas-bar")) return;
                        if (target.parents(".uk-offcanvas-bar:first").length) return;
                    }
                }

                e.stopImmediatePropagation();
                Offcanvas.hide();
            });

            $doc.on('keydown.ukoffcanvas', function(e) {
                if (e.keyCode === 27) { // ESC
                    Offcanvas.hide();
                }
            });
        },

        hide: function(force) {

            var doc   = $("html"),
                panel = $(".uk-offcanvas.uk-active"),
                rtl   = ($.UIkit.langdirection == "right"),
                bar   = panel.find(".uk-offcanvas-bar:first");

            if (!panel.length) return;

            if ($.UIkit.support.transition && !force) {

                doc.one($.UIkit.support.transition.end, function() {
                    doc.removeClass("uk-offcanvas-page").attr("style", "");
                    panel.removeClass("uk-active");
                    window.scrollTo(scrollpos.x, scrollpos.y);
                }).css((rtl ? "margin-right" : "margin-left"), "");

                setTimeout(function(){
                    bar.removeClass("uk-offcanvas-bar-show");
                }, 50);

            } else {
                doc.removeClass("uk-offcanvas-page").attr("style", "");
                panel.removeClass("uk-active");
                bar.removeClass("uk-offcanvas-bar-show");
                window.scrollTo(scrollpos.x, scrollpos.y);
            }

            panel.off(".ukoffcanvas");
            $doc.off(".ukoffcanvas");
        }

    }, scrollpos;


    var OffcanvasTrigger = function(element, options) {

        var $this    = this,
            $element = $(element);

        if($element.data("offcanvas")) return;

        this.options = $.extend({
            "target": $element.is("a") ? $element.attr("href") : false
        }, options);

        this.element = $element;

        $element.on("click", function(e) {
            e.preventDefault();
            Offcanvas.show($this.options.target);
        });

        this.element.data("offcanvas", this);
    };

    OffcanvasTrigger.offcanvas = Offcanvas;

    UI["offcanvas"] = OffcanvasTrigger;


    // init code
    $doc.on("click.offcanvas.uikit", "[data-uk-offcanvas]", function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data("offcanvas")) {
            var obj = new OffcanvasTrigger(ele, UI.Utils.options(ele.attr("data-uk-offcanvas")));
            ele.trigger("click");
        }
    });

})(jQuery, jQuery.UIkit);