(function($, UI) {

    "use strict";

    var Navbar = function(element, options) {

        var $this = this;

        this.element = $(element);
        this.options = $.extend({}, this.options, options);

        this.element.find(".uk-dropdown-navbar").each(function(){

            var parent = $(this).parent();

            if (!parent.attr("data-uk-dropdown")) {
                parent.attr("data-uk-dropdown", JSON.stringify($this.options));
            }
        });
    };

    $.extend(Navbar.prototype, {

        options: {
            "dropdown": {}
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