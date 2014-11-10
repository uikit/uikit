/*! UIkit 2.12.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function($, UI) {

    "use strict";

    var scrollpos = {x: window.scrollX, y: window.scrollY},
        $win      = UI.$win,
        $doc      = UI.$doc,
        $html     = UI.$html,
        Offcanvas = {

        show: function(element) {

            element = $(element);

            if (!element.length) return;

            var $body     = $('body'),
                bar       = element.find(".uk-offcanvas-bar:first"),
                rtl       = ($.UIkit.langdirection == "right"),
                flip      = bar.hasClass("uk-offcanvas-bar-flip") ? -1:1,
                dir       = flip * (rtl ? -1 : 1);

            scrollpos = {x: window.pageXOffset, y: window.pageYOffset};

            element.addClass("uk-active");

            $body.css({"width": window.innerWidth, "height": window.innerHeight}).addClass("uk-offcanvas-page");
            $body.css((rtl ? "margin-right" : "margin-left"), (rtl ? -1 : 1) * (bar.outerWidth() * dir)).width(); // .width() - force redraw

            $html.css('margin-top', scrollpos.y * -1);

            bar.addClass("uk-offcanvas-bar-show");

            this._initElement(element);

            $doc.trigger('uk.offcanvas.show', [element, bar]);
        },

        hide: function(force) {

            var $body = $('body'),
                panel = $(".uk-offcanvas.uk-active"),
                rtl   = ($.UIkit.langdirection == "right"),
                bar   = panel.find(".uk-offcanvas-bar:first"),
                finalize = function() {
                    $body.removeClass("uk-offcanvas-page").css({"width": "", "height": "", "margin-left": "", "margin-right": ""});
                    panel.removeClass("uk-active");
                    bar.removeClass("uk-offcanvas-bar-show");
                    $html.css('margin-top', '');
                    window.scrollTo(scrollpos.x, scrollpos.y);
                    $doc.trigger('uk.offcanvas.hide', [panel, bar]);
                };

            if (!panel.length) return;

            if ($.UIkit.support.transition && !force) {

                $body.one($.UIkit.support.transition.end, function() {
                    finalize();
                }).css((rtl ? "margin-right" : "margin-left"), "");

                setTimeout(function(){
                    bar.removeClass("uk-offcanvas-bar-show");
                }, 0);

            } else {
                finalize();
            }
        },

        _initElement: function(element) {

            if (element.data("ukOffcanvasInit")) return;

            element.on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

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

            element.on("click", "a[href^='#']", function(e){

                var element = $(this),
                    href = element.attr("href");

                if (href == "#") {
                    return;
                }

                $doc.one('uk.offcanvas.hide', function() {

                    var target = $(href);

                    if (!target.length) {
                        target = $('[name="'+href.replace('#','')+'"]');
                    }

                    if (UI.Utils.scrollToElement && target.length) {
                        UI.Utils.scrollToElement(target);
                    } else {
                        window.location.href = href;
                    }
                });

                Offcanvas.hide();
            });

            element.data("ukOffcanvasInit", true);
        }
    };

    UI.component('offcanvasTrigger', {

        init: function() {

            var $this = this;

            this.options = $.extend({
                "target": $this.element.is("a") ? $this.element.attr("href") : false
            }, this.options);

            this.on("click", function(e) {
                e.preventDefault();
                Offcanvas.show($this.options.target);
            });
        }
    });

    UI.offcanvas = Offcanvas;

    // init code
    $html.on("click.offcanvas.uikit", "[data-uk-offcanvas]", function(e) {

        e.preventDefault();

        var ele = $(this);

        if (!ele.data("offcanvasTrigger")) {
            var obj = UI.offcanvasTrigger(ele, UI.Utils.options(ele.attr("data-uk-offcanvas")));
            ele.trigger("click");
        }
    });

    $html.on('keydown.ukoffcanvas', function(e) {
        if (e.keyCode === 27) { // ESC
            Offcanvas.hide();
        }
    });

})(jQuery, jQuery.UIkit);