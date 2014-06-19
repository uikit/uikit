/*! UIkit 2.8.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-form-select", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    UI.component('formSelect', {
        defaults: {
            'target': '>span:first'
        },

        init: function() {
            var $this = this;

            this.target  = this.find(this.options.target);
            this.select  = this.find('select');

            // init + on change event
            this.select.on("change", (function(){

                var select = $this.select[0], fn = function(){

                    try {
                        $this.target.text(select.options[select.selectedIndex].text);
                    } catch(e) {}

                    return fn;
                };

                return fn();
            })());

            this.element.data("formSelect", this);
        }
    });

    // init code
    $(document).on("uk-domready", function(e) {

        $("[data-uk-form-select]").each(function(){
            var ele = $(this);

            if (!ele.data("formSelect")) {
                var obj = UI.formSelect(ele, UI.Utils.options(ele.attr("data-uk-form-select")));
            }
        });
    });

    return UI.formSelect;
});