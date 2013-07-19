(function($, UI) {

    "use strict";

    var Tab = function(element, options) {

        this.element = $(element);
        this.options = $.extend({
            connect: false
        }, this.options, options);

        if (this.options.connect) {
            this.connect = $(this.options.connect);
        }

        var mobiletab = $('<li></li>').addClass("uk-tab-responsive uk-active").append('<a href="javascript:void(0);"> <i class="uk-icon-caret-down"></i></a>'),
            caption   = mobiletab.find("a:first"),
            dropdown  = $('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>'),
            ul        = dropdown.find("ul");

        caption.text(this.element.find("li.uk-active:first").find("a").text());

        if (this.element.hasClass("uk-tab-bottom")) dropdown.addClass("uk-dropdown-up");
        if (this.element.hasClass("uk-tab-flip")) dropdown.addClass("uk-dropdown-flip");

        this.element.find("a").each(function() {

            var tab  = $(this),
                item = $('<li><a href="#">' + tab.text() + '</a></li>').on("click", function(e) {
                    e.preventDefault();
                    tab.parent().trigger("click");
                    mobiletab.removeClass("uk-open");
                });

            if (!tab.parents(".uk-disabled:first").length) ul.append(item);
        });

        this.element.uk("switcher", {"toggler": ">li:not(.uk-tab-responsive)", "connect": this.options.connect});

        mobiletab.append(dropdown).uk("dropdown");

        this.element.append(mobiletab).data({
            "dropdown": mobiletab.data("dropdown"),
            "mobilecaption": caption
        }).on("ui.switcher.show", function(e, tab) {
            mobiletab.addClass("uk-active");
            caption.text(tab.find("a").text());
        });

    };

    UI["tab"] = Tab;

    // init code
    $(function() {
        $("[data-uk-tab]").each(function() {
            var tab = $(this);

            if (!tab.data("tab")) {
                tab.data("tab", new Tab(tab, UI.Utils.options(tab.data("uk-tab"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);