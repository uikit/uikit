(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-form-select", ["uikit"], function(){
            return jQuery.UIkit.formSelect || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

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