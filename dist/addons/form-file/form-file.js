/*! UIkit 2.4.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-form-file", ["uikit"], function(){
            return jQuery.UIkit.formfile ? jQuery.UIkit.formfile : addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

    var FormFile = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("formfile")) return;

        this.options = $.extend({}, FormFile.defaults, options);

        this.element = $element;

        this.input = this.element.find("input[type='text']:first");
        this.file  = this.element.find("input[type='file']:first");

        this.file.on("change", function(){
            $this.input.val(this.value.replace(/^.*[\/\\]/g, ''));
        });

        this.element.data("formfile", this);
    };

    FormFile.defaults = {};

    UI["formfile"] = FormFile;

    // init code
    $(document).on("click.formfile.uikit", "[data-uk-form-file]", function(e) {

        var ele = $(this);
        if (!ele.data("formfile")) {
            var obj = new FormFile(ele, UI.Utils.options(ele.attr("data-uk-form-file")));
            ele.trigger("click");
        }
    });

    return FormFile;

});