/*! UIkit 2.6.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-form-password", ["uikit"], function(){
            return jQuery.UIkit.formPassword || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    var FormPassword = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("formPassword")) return;

        this.options = $.extend({}, FormPassword.defaults, options);

        this.element = $element.on("click", function(e) {

            e.preventDefault();

            if($this.input.length) {
                var type = $this.input.attr("type");
                $this.input.attr("type", type=="text" ? "password":"text");
                $this.element.text($this.options[type=="text" ? "lblShow":"lblHide"]);
            }
        });

        $this.input = this.element.next("input").length ? this.element.next("input") : this.element.prev("input");
        $this.element.text(this.options[$this.input.is("[type='password']") ? "lblShow":"lblHide"]);

        this.element.data("formPassword", this);
    };

    FormPassword.defaults = {
        "lblShow": "Show",
        "lblHide": "Hide"
    };

    UI["formPassword"] = FormPassword;

    // init code
    $(document).on("click.formpassword.uikit", "[data-uk-form-password]", function(e) {

        var ele = $(this);
        if (!ele.data("formPassword")) {

            e.preventDefault();

            var obj = new FormPassword(ele, UI.Utils.options(ele.attr("data-uk-form-password")));
            ele.trigger("click");
        }
    });

    return FormPassword;

});