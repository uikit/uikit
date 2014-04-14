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

    var FormSelect = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("formSelect")) return;

        this.element = $element;
        this.options = $.extend({}, FormSelect.defaults, options);
        this.label   = this.element.find(this.options.label);
        this.select  = this.element.find('select');

        // init + on change event
        this.select.on("change", (function(){

            var select = $this.select[0], fn = function(){
                $this.label.text(select.options[select.selectedIndex].text);
                return fn;
            };

            $(document).on("uk-domready", fn);

            return fn();
        })());

        this.element.data("formSelect", this);
    };

    FormSelect.defaults = {
        'label': '>span:first'
    };

    UI["formSelect"] = FormSelect;

    // init code
    $(document).on("uk-domready", function(e) {

        $("[data-uk-form-select]").each(function(){
            var ele = $(this);

            if (!ele.data("formSelect")) {
                e.preventDefault();
                var obj = new FormSelect(ele, UI.Utils.options(ele.attr("data-uk-form-select")));
            }
        });
    });

    return FormSelect;
});