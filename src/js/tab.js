(function($, UI) {

    "use strict";

    var Tab = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("tab")) return;

        this.element = $element;
        this.options = $.extend({
            connect: false
        }, this.options, options);

        if (this.options.connect) {
            this.connect = $(this.options.connect);
        }

        if (window.location.hash) {
            var active = this.element.children().filter(window.location.hash);

            if (active.length) {
                this.element.children().removeClass('uk-active').filter(active).addClass("uk-active");
            }
        }

        var mobiletab = $('<li class="uk-tab-responsive uk-active"><a href="javascript:void(0);"></a></li>'),
            caption   = mobiletab.find("a:first"),
            dropdown  = $('<div class="uk-dropdown uk-dropdown-small"><ul class="uk-nav uk-nav-dropdown"></ul><div>'),
            ul        = dropdown.find("ul");

        caption.html(this.element.find("li.uk-active:first").find("a").text());

        if (this.element.hasClass("uk-tab-bottom")) dropdown.addClass("uk-dropdown-up");
        if (this.element.hasClass("uk-tab-flip")) dropdown.addClass("uk-dropdown-flip");

        this.element.find("a").each(function(i) {

            var tab  = $(this).parent(),
                item = $('<li><a href="javascript:void(0);">' + tab.text() + '</a></li>').on("click", function(e) {
                    $this.element.data("switcher").show(i);
                });

            if (!$(this).parents(".uk-disabled:first").length) ul.append(item);
        });

        this.element.uk("switcher", {"toggler": ">li:not(.uk-tab-responsive)", "connect": this.options.connect});

        mobiletab.append(dropdown).uk("dropdown", {"mode": "click"});

        this.element.append(mobiletab).data({
            "dropdown": mobiletab.data("dropdown"),
            "mobilecaption": caption
        }).on("uk.switcher.show", function(e, tab) {
            mobiletab.addClass("uk-active");
            caption.html(tab.find("a").text());
        });

        this.element.data("tab", this);
    };

    $(document).on("uk-domready", function() {

        $("[data-uk-tab]").each(function() {
            new Tab(this, UI.Utils.options(this.getAttribute("data-uk-tab")));
        });
    });

})(jQuery, jQuery.UIkit);