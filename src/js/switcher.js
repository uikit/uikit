(function($, UI) {

    "use strict";

    var Switcher = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("switcher")) return;

        this.options = $.extend({}, Switcher.defaults, options);

        this.element = $element.on("click", this.options.toggler, function(e) {
            e.preventDefault();
            $this.show(this);
        });

        if (this.options.connect) {

            this.connect = $(this.options.connect).find(".uk-active").removeClass(".uk-active").end();

            var active = this.element.find(this.options.toggler).filter(".uk-active");

            if (active.length) {
                this.show(active);
            }
        }

        this.element.data("switcher", this);
    };

    $.extend(Switcher.prototype, {

        show: function(tab) {

            tab = isNaN(tab) ? $(tab) : this.element.find(this.options.toggler).eq(tab);

            var active = tab;

            if (active.hasClass("uk-disabled")) return;

            this.element.find(this.options.toggler).filter(".uk-active").removeClass("uk-active");
            active.addClass("uk-active");

            if (this.options.connect && this.connect.length) {

                var index = this.element.find(this.options.toggler).index(active);

                this.connect.children().removeClass("uk-active").eq(index).addClass("uk-active");
            }

            this.element.trigger("uk.switcher.show", [active]);
        }

    });

    Switcher.defaults = {
        connect: false,
        toggler: ">*"
    };

    UI["switcher"] = Switcher;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-switcher]").each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                var obj = new Switcher(switcher, UI.Utils.options(switcher.attr("data-uk-switcher")));
            }
        });
    });

})(jQuery, jQuery.UIkit);