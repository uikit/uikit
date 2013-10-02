(function($, UI) {

    "use strict";

    var Alert = function(element, options) {

        var $this = this;

        this.options = $.extend({}, this.options, options);
        this.element = $(element).on("click", this.options.trigger, function(e) {
            e.preventDefault();
            $this.close();
        });
    };

    $.extend(Alert.prototype, {

        options: {
            "fade": true,
            "duration": 200,
            "trigger": ".uk-alert-close"
        },

        close: function() {

            var element = this.element.trigger("close");

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height": 0,
                    "opacity": 0,
                    "padding-top": 0,
                    "padding-bottom": 0,
                    "margin-top": 0,
                    "margin-bottom": 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }

            function removeElement() {
                element.trigger("closed").remove();
            }
        }

    });

    UI["alert"] = Alert;

    // init code
    $(document).on("click.alert.uikit", "[data-uk-alert]", function(e) {

        var ele = $(this);
        if (!ele.data("alert")) {
            ele.data("alert", new Alert(ele, UI.Utils.options(ele.data("uk-alert"))));

            if ($(e.target).is(ele.data("alert").options.trigger)) {

                e.preventDefault();

                ele.data("alert").close();
            }
        }
    });

})(jQuery, jQuery.UIkit);