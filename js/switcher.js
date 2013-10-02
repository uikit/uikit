(function($, UI) {

    "use strict";

    var Switcher = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);

        this.element = $(element).on("click", this.options.toggler, function(e) {
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

    };

    $.extend(Switcher.prototype, {

        options: {
            connect: false,
            toggler: ">*"
        },

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

    UI["switcher"] = Switcher;

    // init code
    $(function() {
        $("[data-uk-switcher]").each(function() {
            var switcher = $(this);

            if (!switcher.data("switcher")) {
                switcher.data("switcher", new Switcher(switcher, UI.Utils.options(switcher.data("uk-switcher"))));
            }
        });
    });

})(jQuery, jQuery.UIkit);