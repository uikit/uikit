/*! UIkit 2.24.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(UI) {

    "use strict";

    UI.component('alert', {

        defaults: {
            "fade": true,
            "duration": 200,
            "trigger": ".uk-alert-close"
        },

        boot: function() {

            // init code
            UI.$html.on("click.alert.uikit", "[data-uk-alert]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("alert")) {

                    var alert = UI.alert(ele, UI.Utils.options(ele.attr("data-uk-alert")));

                    if (UI.$(e.target).is(alert.options.trigger)) {
                        e.preventDefault();
                        alert.close();
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.trigger, function(e) {
                e.preventDefault();
                $this.close();
            });
        },

        close: function() {

            var element       = this.trigger("close.uk.alert"),
                removeElement = function () {
                    this.trigger("closed.uk.alert").remove();
                }.bind(this);

            if (this.options.fade) {
                element.css("overflow", "hidden").css("max-height", element.height()).animate({
                    "height"         : 0,
                    "opacity"        : 0,
                    "padding-top"    : 0,
                    "padding-bottom" : 0,
                    "margin-top"     : 0,
                    "margin-bottom"  : 0
                }, this.options.duration, removeElement);
            } else {
                removeElement();
            }
        }

    });

})(UIkit);
