/*! UIkit 2.7.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-form-password", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    UI.component('formPassword', {

        defaults: {
            "lblShow": "Show",
            "lblHide": "Hide"
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

    // init code
    $(document).on("click.formpassword.uikit", "[data-uk-form-password]", function(e) {

        var ele = $(this);
        if (!ele.data("formPassword")) {

            e.preventDefault();

            var obj = UI.formPassword(ele, UI.Utils.options(ele.attr("data-uk-form-password")));
            ele.trigger("click");
        }
    });

    return UI.formPassword;
});