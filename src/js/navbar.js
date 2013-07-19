(function($, UI) {

    "use strict";

    var Navbar = function(element, options) {

        var $this = this;

        this.element = $(element);
        this.options = $.extend({}, this.options, options);

        this.element.on("mouseenter", this.options.toggler, function(e) {
            $this.element.find($this.options.toggler).not(this).removeClass("uk-open");
        });
    };

    $.extend(Navbar.prototype, {

        options: {
            "toggler": ".uk-navbar-nav > li",
            "remaintime": 800
        }

    });

    UI["navbar"] = Navbar;

    // init code
    $(function() {
        $("[data-uk-navbar]").each(function() {
            var navbar = $(this);

            if (!navbar.data("navbar")) {
                navbar.data("navbar", new Navbar(navbar, UI.Utils.options(navbar.data("uk-navbar"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);