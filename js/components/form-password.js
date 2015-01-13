/*! UIkit 2.16.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function(addon) {

    var component;

    if (jQuery && UIkit) {
        component = addon(jQuery, UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-form-password", ["uikit"], function(){
            return component || addon(jQuery, UIkit);
        });
    }

})(function($, UI){

    "use strict";

    UI.component('formPassword', {

        defaults: {
            "lblShow": "Show",
            "lblHide": "Hide"
        },

        boot: function() {
            // init code
            UI.$html.on("click.formpassword.uikit", "[data-@-form-password]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("formPassword")) {

                    e.preventDefault();

                    var obj = UI.formPassword(ele, UI.Utils.options(ele.attr("data-@-form-password")));
                    ele.trigger("click");
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                e.preventDefault();

                if($this.input.length) {
                    var type = $this.input.attr("type");
                    $this.input.attr("type", type=="text" ? "password":"text");
                    $this.element.text($this.options[type=="text" ? "lblShow":"lblHide"]);
                }
            });

            this.input = this.element.next("input").length ? this.element.next("input") : this.element.prev("input");
            this.element.text(this.options[this.input.is("[type='password']") ? "lblShow":"lblHide"]);

            this.element.data("formPassword", this);
        }
    });

    return UI.formPassword;
});
