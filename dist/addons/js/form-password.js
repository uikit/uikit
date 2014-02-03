/*! UIkit 2.3.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function($, UI){

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

})(jQuery, jQuery.UIkit);