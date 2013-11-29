(function($, UI) {

    "use strict";

    var Alert = function(element, options) {

        var $this = this;

        this.options = $.extend({}, Alert.defaults, options);
        this.element = $(element);

        if(this.element.data("alert")) return;

        this.element.on("click", this.options.trigger, function(e) {
            e.preventDefault();
            $this.close();
        });

        this.element.data("alert", this);
    };

    $.extend(Alert.prototype, {

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

    Alert.defaults = {
        "fade": true,
        "duration": 200,
        "trigger": ".uk-alert-close"
    };

    UI["alert"] = Alert;

    // init code
    $(document).on("click.alert.uikit", "[data-uk-alert]", function(e) {

        var ele = $(this);
        if (!ele.data("alert")) {

            var alert = new Alert(ele, UI.Utils.options(ele.data("uk-alert")));

            if ($(e.target).is(ele.data("alert").options.trigger)) {
                e.preventDefault();
                alert.close();
            }
        }
    });

})(jQuery, jQuery.UIkit);